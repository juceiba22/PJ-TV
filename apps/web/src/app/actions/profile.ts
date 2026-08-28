"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "No autorizado." };
  }

  const nombre_completo = formData.get("nombre_completo") as string;
  const dni = formData.get("dni") as string;
  const numero_afiliado = formData.get("numero_afiliado") as string;
  const fecha_afiliacion = formData.get("fecha_afiliacion") as string;

  // Insertar o actualizar
  const { error } = await supabase
    .from("affiliate_details")
    .upsert({
      user_id: user.id,
      nombre_completo: nombre_completo || null,
      dni: dni || null,
      numero_afiliado: numero_afiliado || null,
      fecha_afiliacion: fecha_afiliacion ? new Date(fecha_afiliacion).toISOString() : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (error) {
    return { error: `Error al actualizar perfil: ${error.message}` };
  }

  revalidatePath("/perfil");
  return { success: true };
}
