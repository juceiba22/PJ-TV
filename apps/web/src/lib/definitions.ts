import * as z from "zod";

export const SignupFormSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "El usuario debe tener al menos 3 caracteres.")
      .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guión bajo."),
    email: z.email("Ingresá un email válido.").trim(),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    role: z.enum(["afiliado", "referente"]),
    provincia: z.string().trim().optional(),
    ciudad_municipio: z.string().trim().optional(),
    barrio_direccion: z.string().trim().optional(),
    nombre_unidad_basica: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.role !== "referente" ||
      (data.provincia && data.ciudad_municipio && data.barrio_direccion),
    {
      message:
        "Provincia, ciudad/municipio y barrio/dirección son obligatorios para Referentes.",
      path: ["provincia"],
    },
  );

export type SignupFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof SignupFormSchema>, string[]>>;
      message?: string;
    }
  | undefined;

export const LoginFormSchema = z.object({
  email: z.email("Ingresá un email válido.").trim(),
  password: z.string().min(1, "Ingresá tu contraseña."),
});

export type LoginFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof LoginFormSchema>, string[]>>;
      message?: string;
    }
  | undefined;
