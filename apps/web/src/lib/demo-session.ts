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

  // 1) Acceso anónimo de Supabase (si está habilitado en el proyecto)
  const anon = await supabase.auth.signInAnonymously({ options: { data: metadata } });
  let user = anon.data.user ?? undefined;

  // 2) Respaldo: cuenta interna con email generado (sin confirmación de correo)
  if (anon.error || !user) {
    const email = `demo.${crypto.randomUUID().slice(0, 12)}@pjtv-demo.com`;
    const password = crypto.randomUUID() + crypto.randomUUID();
    const signUp = await supabase.auth.signUp({ email, password, options: { data: metadata } });
    if (signUp.error) {
      return { error: `No se pudo iniciar la sesión demo: ${signUp.error.message}` };
    }
    if (!signUp.data.session) {
      const signIn = await supabase.auth.signInWithPassword({ email, password });
      if (signIn.error) {
        return { error: `No se pudo iniciar la sesión demo: ${signIn.error.message}` };
      }
    }
    user = signUp.data.user ?? undefined;
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
