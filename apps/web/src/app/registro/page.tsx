"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";

export default function RegistroPage() {
  const [state, action, pending] = useActionState(signup, undefined);
  const [role, setRole] = useState<"afiliado" | "referente">("afiliado");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      <form action={action} className="flex flex-col gap-4">
        <fieldset className="flex gap-4">
          <legend className="mb-1 text-sm font-medium">Tipo de cuenta</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="role"
              value="afiliado"
              checked={role === "afiliado"}
              onChange={() => setRole("afiliado")}
            />
            Afiliado
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="role"
              value="referente"
              checked={role === "referente"}
              onChange={() => setRole("referente")}
            />
            Referente (Unidad Básica)
          </label>
        </fieldset>

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium">
            Usuario
          </label>
          <input
            id="username"
            name="username"
            required
            className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
          />
          {state?.errors?.username && (
            <p className="text-sm text-red-600">{state.errors.username[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
          />
          {state?.errors?.email && (
            <p className="text-sm text-red-600">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
          />
          {state?.errors?.password && (
            <p className="text-sm text-red-600">{state.errors.password[0]}</p>
          )}
        </div>

        {role === "referente" && (
          <div className="flex flex-col gap-4 rounded border border-neutral-300 p-4 dark:border-neutral-700">
            <p className="text-sm font-medium">Datos territoriales de la Unidad Básica</p>
            <div className="flex flex-col gap-1">
              <label htmlFor="provincia" className="text-sm">
                Provincia
              </label>
              <input
                id="provincia"
                name="provincia"
                required
                className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="ciudad_municipio" className="text-sm">
                Ciudad / Municipio
              </label>
              <input
                id="ciudad_municipio"
                name="ciudad_municipio"
                required
                className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="barrio_direccion" className="text-sm">
                Barrio / Dirección
              </label>
              <input
                id="barrio_direccion"
                name="barrio_direccion"
                required
                className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="nombre_unidad_basica" className="text-sm">
                Nombre de la Unidad Básica (opcional)
              </label>
              <input
                id="nombre_unidad_basica"
                name="nombre_unidad_basica"
                className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
              />
            </div>
            {state?.errors?.provincia && (
              <p className="text-sm text-red-600">{state.errors.provincia[0]}</p>
            )}
          </div>
        )}

        {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {pending ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium text-blue-600">
          Ingresá
        </Link>
      </p>
    </main>
  );
}
