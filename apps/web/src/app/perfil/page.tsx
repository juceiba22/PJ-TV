import { requireProfile } from "@/lib/dal";
import { updateProfile } from "@/app/actions/profile";
import {
  User,
  CreditCard,
  Hash,
  Calendar,
  ShieldCheck,
  Award,
  Sparkles,
  Save,
  CheckCircle2,
  QrCode,
  Flame,
} from "lucide-react";

export default async function PerfilPage() {
  const profile = await requireProfile();
  const details = Array.isArray(profile.affiliate_details)
    ? profile.affiliate_details[0]
    : profile.affiliate_details;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Credencial Digital y Perfil de Afiliado
        </h1>
        <p className="text-sm text-zinc-400">
          Mantené actualizados tus datos de afiliación partidaria y visualizá tu carnet digital autenticado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Formulario de Datos */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-6 sm:p-8 backdrop-blur-md lg:col-span-6">
          <div className="mb-6 flex items-center gap-2.5 border-b border-zinc-800/60 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 text-sky-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Datos del Afiliado</h2>
              <p className="text-xs text-zinc-400">Información registrada en el padrón</p>
            </div>
          </div>

          <form
            action={async (formData) => {
              "use server";
              await updateProfile(formData);
            }}
            className="flex flex-col gap-4"
          >
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                <User className="h-3.5 w-3.5 text-sky-400" />
                <span>Nombre Completo</span>
              </label>
              <input
                type="text"
                name="nombre_completo"
                placeholder="Ej: Juan Domingo Pérez"
                defaultValue={details?.nombre_completo || ""}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  <CreditCard className="h-3.5 w-3.5 text-sky-400" />
                  <span>DNI / Documento</span>
                </label>
                <input
                  type="text"
                  name="dni"
                  placeholder="Ej: 35123456"
                  defaultValue={details?.dni || ""}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm font-mono text-white placeholder-zinc-600 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  <Hash className="h-3.5 w-3.5 text-amber-400" />
                  <span>Nº de Afiliado</span>
                </label>
                <input
                  type="text"
                  name="numero_afiliado"
                  placeholder="Ej: BA-98742"
                  defaultValue={details?.numero_afiliado || ""}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm font-mono text-white placeholder-zinc-600 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                <span>Fecha de Afiliación</span>
              </label>
              <input
                type="date"
                name="fecha_afiliacion"
                defaultValue={
                  details?.fecha_afiliacion
                    ? new Date(details.fecha_afiliacion).toISOString().split("T")[0]
                    : ""
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.02] hover:shadow-blue-600/50"
              >
                <Save className="h-4 w-4" />
                <span>Guardar y Actualizar Carnet</span>
              </button>
            </div>
          </form>
        </div>

        {/* Vista del Carnet Digital Plástico */}
        <div className="flex flex-col items-center gap-4 lg:col-span-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Credencial Oficial Autenticada</span>
          </div>

          {/* Tarjeta / Carnet Estilo Credencial */}
          <div className="relative aspect-[1.586/1] w-full max-w-md overflow-hidden rounded-2xl border-2 border-amber-400/90 bg-gradient-to-br from-blue-950 via-slate-900 to-sky-950 p-5 shadow-[0_15px_40px_rgba(234,179,8,0.18)] transition hover:shadow-[0_20px_50px_rgba(234,179,8,0.28)]">
            {/* Fondo decorativo con tramas y holograma */}
            <div className="absolute right-0 top-0 -mr-12 -mt-12 h-44 w-44 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
            <div className="absolute left-0 bottom-0 -ml-12 -mb-12 h-44 w-44 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />

            {/* Header del Carnet */}
            <div className="relative z-10 flex items-center justify-between border-b border-amber-400/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-blue-950">
                    <Flame className="h-4 w-4 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-widest text-white uppercase sm:text-sm">
                    PARTIDO JUSTICIALISTA
                  </h3>
                  <p className="text-[9px] font-semibold tracking-wider text-amber-300">
                    REPÚBLICA ARGENTINA · CONSEJO NACIONAL
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-300 border border-amber-400/40">
                  DIGITAL ID
                </span>
              </div>
            </div>

            {/* Cuerpo del Carnet */}
            <div className="relative z-10 mt-4 flex items-center gap-4">
              {/* Foto / Avatar */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-amber-400/70 bg-blue-950/80 shadow-md">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Foto de perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-amber-400">
                    <User className="h-8 w-8" />
                    <span className="text-[8px] font-bold uppercase mt-0.5 text-zinc-400">
                      AFILIADO
                    </span>
                  </div>
                )}
              </div>

              {/* Nombre y Cargo */}
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                  {profile.role === "referente" ? "Referente Territorial" : "Afiliado/a Titular"}
                </span>
                <h4 className="truncate text-base font-black uppercase tracking-tight text-white sm:text-lg">
                  {details?.nombre_completo || profile.username}
                </h4>
                <p className="text-[11px] font-mono font-medium text-zinc-400">
                  @{profile.username}
                </p>
              </div>
            </div>

            {/* Metadata Grid (DNI / Nº Afiliado / Fecha) */}
            <div className="relative z-10 mt-4 grid grid-cols-3 gap-2 rounded-xl bg-black/40 p-2.5 border border-white/10 backdrop-blur-sm">
              <div>
                <span className="block text-[8px] font-bold uppercase tracking-wider text-zinc-400">
                  DNI
                </span>
                <span className="font-mono text-xs font-bold text-amber-300">
                  {details?.dni || "---"}
                </span>
              </div>

              <div>
                <span className="block text-[8px] font-bold uppercase tracking-wider text-zinc-400">
                  Nº AFILIADO
                </span>
                <span className="font-mono text-xs font-bold text-sky-300">
                  {details?.numero_afiliado || "---"}
                </span>
              </div>

              <div>
                <span className="block text-[8px] font-bold uppercase tracking-wider text-zinc-400">
                  AFILIACIÓN
                </span>
                <span className="font-mono text-xs font-bold text-zinc-200">
                  {details?.fecha_afiliacion
                    ? new Date(details.fecha_afiliacion).toLocaleDateString("es-AR")
                    : "---"}
                </span>
              </div>
            </div>

            {/* Footer con microtexto */}
            <div className="relative z-10 mt-3 flex items-center justify-between text-[8px] text-zinc-400">
              <span className="tracking-widest font-mono">PJTV-SEC-AUTH-2026</span>
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="h-2.5 w-2.5" />
                <span>PADRÓN VALIDADO</span>
              </div>
            </div>
          </div>

          <p className="max-w-xs text-center text-xs text-zinc-500">
            Esta credencial digital cuenta con validez interna en la plataforma PJ TV y sus foros de debate doctrinario.
          </p>
        </div>
      </div>
    </main>
  );
}
