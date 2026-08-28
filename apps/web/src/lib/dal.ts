import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const getCurrentProfile = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      role,
      avatar_url,
      affiliate_details (
        nombre_completo,
        dni,
        numero_afiliado,
        fecha_afiliacion
      )
    `)
    .eq("id", user.id)
    .single();

  return profile;
});

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireReferente() {
  const profile = await requireProfile();
  if (profile.role !== "referente") redirect("/");
  return profile;
}
