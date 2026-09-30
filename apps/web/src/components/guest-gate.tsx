"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { demoLogin } from "@/app/actions/auth";
import { UserRound, AlertCircle } from "lucide-react";

// Permite participar sin registrarse: pide un apodo y abre una sesión invitada.
export function GuestGate({
  message = "Participá con un apodo, sin registrarte",
  compact = false,
}: {
  message?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function enter(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await demoLogin({ name, provider: "invitado" });
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className={`flex flex-col gap-2 ${compact ? "" : "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"}`}>
      <p className="flex items-center gap-1.5 text-xs text-zinc-400">
        <UserRound className="h-3.5 w-3.5 text-amber-400" />
        <span>{message}</span>
      </p>
      <form onSubmit={enter} className="flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          placeholder="Tu apodo"
          className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-sky-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || name.trim().length < 2}
          className="shrink-0 rounded-xl bg-sky-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-sky-500 disabled:opacity-40"
        >
          {pending ? "..." : "Entrar"}
        </button>
      </form>
      <p className="text-[11px] text-zinc-500">
        o{" "}
        <Link href="/login" className="font-semibold text-sky-400 hover:text-sky-300 underline">
          ingresá con Google o email
        </Link>
      </p>
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-400">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
