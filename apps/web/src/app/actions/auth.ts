"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  LoginFormSchema,
  LoginFormState,
  SignupFormSchema,
  SignupFormState,
} from "@/lib/definitions";

export async function signup(
  _state: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const validated = SignupFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    provincia: formData.get("provincia") || undefined,
    ciudad_municipio: formData.get("ciudad_municipio") || undefined,
    barrio_direccion: formData.get("barrio_direccion") || undefined,
    nombre_unidad_basica: formData.get("nombre_unidad_basica") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { username, email, password, role, ...territorial } = validated.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, role } },
  });

  if (error) {
    return { message: error.message };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { message: `Cuenta creada, pero falló el inicio de sesión: ${signInError.message}` };
  }

  if (role === "referente" && data.user) {
    const { error: refError } = await supabase.from("referente_details").insert({
      user_id: data.user.id,
      provincia: territorial.provincia!,
      ciudad_municipio: territorial.ciudad_municipio!,
      barrio_direccion: territorial.barrio_direccion!,
      nombre_unidad_basica: territorial.nombre_unidad_basica || null,
    });

    if (refError) {
      return { message: `Cuenta creada, pero falló el registro territorial: ${refError.message}` };
    }
  }

  redirect("/");
}

export async function login(
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const validated = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(validated.data);

  if (error) {
    return { message: "Email o contraseña incorrectos." };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
