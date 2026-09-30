"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { startDemoSession } from "@/lib/demo-session";

export type AfiliacionInput = {
  nombre_completo: string;
  email: string;
  telefono?: string;
  provincia: string;
  localidad: string;
  barrio?: string;
  fecha_nacimiento?: string;
  intereses?: string[];
  adhesion: boolean;
};

const PROVINCIA_CODIGO: Record<string, string> = {
  Salta: "SAL",
  "Buenos Aires": "BA",
  "Ciudad de Buenos Aires": "CABA",
  Jujuy: "JUY",
  Tucumán: "TUC",
  Córdoba: "COR",
  "Santa Fe": "SF",
  Mendoza: "MZA",
};

function generarNumeroAfiliado(provincia: string) {
  const codigo = PROVINCIA_CODIGO[provincia] ?? provincia.slice(0, 3).toUpperCase();
  const numero = Math.floor(100000 + Math.random() * 900000);
  return `PJ-${codigo}-${numero}`;
}

// Afiliación digital (demo): no pide DNI. Si no hay sesión, crea una cuenta
// con los datos del formulario y genera el carnet con número de afiliación.
export async function afiliarse(
  input: AfiliacionInput,
): Promise<{ error?: string; numero?: string }> {
  if (!input.adhesion) return { error: "Tenés que adherir a los principios del Movimiento." };
  if (!input.nombre_completo?.trim() || input.nombre_completo.trim().length < 3)
    return { error: "Ingresá tu nombre completo." };
  if (!input.email?.includes("@")) return { error: "Ingresá un email válido." };
  if (!input.provincia || !input.localidad?.trim())
    return { error: "Indicá tu provincia y localidad." };

  const supabase = await createClient();
  let {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const res = await startDemoSession(supabase, {
      name: input.nombre_completo,
      email: input.email,
      provider: "email",
    });
    if (res.error || !res.user) return { error: res.error ?? "No se pudo crear la cuenta." };
    user = res.user;
  }

  const { data: existing } = await supabase
    .from("affiliate_details")
    .select("numero_afiliado")
    .eq("user_id", user.id)
    .maybeSingle();

  const numero = existing?.numero_afiliado || generarNumeroAfiliado(input.provincia);

  const { error } = await supabase.from("affiliate_details").upsert(
    {
      user_id: user.id,
      nombre_completo: input.nombre_completo.trim(),
      numero_afiliado: numero,
      fecha_afiliacion: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) return { error: `No se pudo registrar la afiliación: ${error.message}` };

  await supabase.auth.updateUser({
    data: {
      display_name: input.nombre_completo.trim(),
      afiliacion: {
        email: input.email.trim(),
        telefono: input.telefono?.trim() || null,
        provincia: input.provincia,
        localidad: input.localidad.trim(),
        barrio: input.barrio?.trim() || null,
        fecha_nacimiento: input.fecha_nacimiento || null,
        intereses: input.intereses ?? [],
      },
    },
  });

  revalidatePath("/", "layout");
  return { numero };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "No autorizado." };
  }

  const nombre_completo = (formData.get("nombre_completo") as string)?.trim();
  const telefono = (formData.get("telefono") as string)?.trim();
  const localidad = (formData.get("localidad") as string)?.trim();
  const barrio = (formData.get("barrio") as string)?.trim();

  if (nombre_completo) {
    const { error } = await supabase
      .from("affiliate_details")
      .update({ nombre_completo, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    if (error) return { error: `Error al actualizar perfil: ${error.message}` };
  }

  const prev = (user.user_metadata?.afiliacion ?? {}) as Record<string, unknown>;
  await supabase.auth.updateUser({
    data: {
      display_name: nombre_completo || user.user_metadata?.display_name,
      afiliacion: {
        ...prev,
        telefono: telefono || prev.telefono || null,
        localidad: localidad || prev.localidad || null,
        barrio: barrio || prev.barrio || null,
      },
    },
  });

  revalidatePath("/perfil");
  return { success: true };
}
