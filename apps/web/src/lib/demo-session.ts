import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@pjtv/shared";

// ============================================================
// Acceso simulado (demo): Google, email sin contraseña o invitado.
// Crea una sesión real de Supabase para que chat/foros/afiliación
// funcionen con RLS, sin pedir credenciales reales.
// ============================================================
export type DemoLoginInput = {
  name: string;
  email?: string;
  provider: "google" | "email" | "invitado";
  role?: "afiliado" | "referente";
  provincia?: string;
  ciudad_municipio?: string;
  nombre_unidad_basica?: string;
};

function toUsername(name: string) {
  const base = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20);
  return base.length >= 2 ? base : "compa";
}

export async function startDemoSession(
  supabase: SupabaseClient<Database>,
  input: DemoLoginInput,
): Promise<{ error?: string; user?: User }> {
  const name = input.name?.trim();
  if (!name || name.length < 2) return { error: "Ingresá tu nombre o un apodo." };

  const role = input.role === "referente" ? "referente" : "afiliado";
  const username = `${toUsername(name)}_${Math.floor(Math.random() * 900 + 100)}`;
  const metadata = {
    username,
    role,
    display_name: name,
    demo_provider: input.provider,
    demo_email: input.email?.trim() || null,
  };

  await supabase.auth.signOut();

  // Sesión anónima de Supabase (requiere "Allow anonymous sign-ins" en
  // Authentication > Sign In / Providers). El perfil se crea por trigger.
  const anon = await supabase.auth.signInAnonymously({ options: { data: metadata } });
  const user = anon.data.user ?? undefined;

  if (anon.error || !user) {
    const disabled = /anonymous/i.test(anon.error?.message ?? "");
    return {
      error: disabled
        ? "El acceso de demostración no está habilitado en el servidor (Supabase: Allow anonymous sign-ins)."
        : `No se pudo iniciar la sesión: ${anon.error?.message ?? "error desconocido"}`,
    };
  }

  if (role === "referente" && user) {
    await supabase.from("referente_details").upsert({
      user_id: user.id,
      provincia: input.provincia?.trim() || "Salta",
      ciudad_municipio: input.ciudad_municipio?.trim() || "Salta Capital",
      barrio_direccion: "—",
      nombre_unidad_basica: input.nombre_unidad_basica?.trim() || null,
    });
  }

  return { user };
}
