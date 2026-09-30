import Link from "next/link";
import { requireProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/app/actions/profile";
import { CarnetDigital } from "@/components/carnet-digital";
import { ArrowRight, HeartHandshake, MapPin, Phone, Save, Sparkles, User } from "lucide-react";

type Afiliacion = {
  email?: string | null;
  telefono?: string | null;
  provincia?: string | null;
  localidad?: string | null;
  barrio?: string | null;
  intereses?: string[];
};

const inputClass =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-sky-500 focus:outline-none";

export default async function PerfilPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const details = Array.isArray(profile.affiliate_details)
    ? profile.affiliate_details[0]
    : profile.affiliate_details;
  const afiliacion = (user?.user_metadata?.afiliacion ?? {}) as Afiliacion;
  const displayName =
    details?.nombre_completo || (user?.user_metadata?.display_name as string | undefined) || profile.username;
  const localidad = [afiliacion.localidad, afiliacion.provincia].filter(Boolean).join(", ") || null;
  const afiliado = Boolean(details?.numero_afiliado);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Mi perfil y carnet digital</h1>
        <p className="text-sm text-zinc-400">
          Hola, <span className="font-semibold text-zinc-200">{displayName}</span>. Acá está tu credencial de afiliado/a.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-col items-center gap-4 lg:col-span-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Credencial digital</span>
          </div>

          {afiliado ? (
            <CarnetDigital
              data={{
                nombre: displayName,
                username: profile.username,
                role: profile.role,
                numeroAfiliado: details?.numero_afiliado ?? null,
                fechaAfiliacion: details?.fecha_afiliacion ?? null,
                localidad,
                avatarUrl: profile.avatar_url,
              }}
            />
          ) : (
            <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-sky-500/40 bg-sky-500/5 p-8 text-center">
              <HeartHandshake className="h-10 w-10 text-sky-400" />
              <div>
                <p className="text-base font-bold text-white">Todavía no tenés tu carnet</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Completá la afiliación digital en tres pasos, sin DNI, y lo generamos al instante.
                </p>
              </div>
              <Link
                href="/afiliate"
                className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500"
              >
                Afiliarme ahora
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-md sm:p-8 lg:col-span-6">
          <div className="mb-6 flex items-center gap-2.5 border-b border-zinc-800/60 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600/20 text-sky-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Mis datos</h2>
              <p className="text-xs text-zinc-400">@{profile.username} · {profile.role === "referente" ? "Referente UB" : "Militante"}</p>
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
                Nombre y apellido
              </label>
              <input name="nombre_completo" defaultValue={details?.nombre_completo ?? ""} placeholder={displayName} className={inputClass} disabled={!afiliado} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  <MapPin className="h-3.5 w-3.5 text-sky-400" />
                  Localidad
                </label>
                <input name="localidad" defaultValue={afiliacion.localidad ?? ""} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  Barrio
                </label>
                <input name="barrio" defaultValue={afiliacion.barrio ?? ""} className={inputClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                Celular
              </label>
              <input name="telefono" defaultValue={afiliacion.telefono ?? ""} className={inputClass} />
            </div>

            {afiliacion.intereses && afiliacion.intereses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {afiliacion.intereses.map((i) => (
                  <span key={i} className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300">
                    {i}
                  </span>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 py-3 text-sm font-bold text-white shadow-lg shadow-sky-600/30 transition hover:scale-[1.02]"
            >
              <Save className="h-4 w-4" />
              Guardar cambios
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
