"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-bold">Ingresar</h1>
      <form action={action} className="flex flex-col gap-4">
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
        {state?.message && <p className="text-sm text-red-600">{state.message}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {pending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        ¿No tenés cuenta?{" "}
        <Link href="/registro" className="font-medium text-blue-600">
          Registrate
        </Link>
      </p>
    </main>
  );
}
