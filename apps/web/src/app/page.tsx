import Link from "next/link";
import { getLiveStreams } from "@/lib/queries/streams";
import { categoriaLabel } from "@/lib/categorias";
import { streamThumbnail } from "@/lib/video";
import { RECURSOS } from "@/lib/biblioteca";
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  IdCard,
  MapPin,
  MessageSquare,
  MessagesSquare,
  Radio,
  Scale,
  Factory,
  Flag,
  Tv,
  UserRound,
} from "lucide-react";

const BANDERAS = [
  {
    titulo: "Justicia Social",
    icon: Scale,
    texto:
      "El trabajo como fuente de dignidad y la riqueza de la Nación al servicio de una vida digna para cada argentino.",
  },
  {
    titulo: "Independencia Económica",
    icon: Factory,
    texto:
      "Industria nacional, mercado interno y valor agregado: decidir sobre nuestros recursos para no depender de nadie.",
  },
  {
    titulo: "Soberanía Política",
    icon: Flag,
    texto:
      "Una Nación que decide su destino sin tutelas, con un pueblo organizado protagonista de sus decisiones.",
  },
];

const FUNCIONES = [
  { icon: Tv, titulo: "Transmisiones en vivo", texto: "Cada Unidad Básica transmite sus actos, clases y plenarios desde OBS o el celular.", href: "/en-vivo" },
  { icon: MessagesSquare, titulo: "Chat en tiempo real", texto: "La militancia de todo el país conversa en vivo durante cada transmisión.", href: "/en-vivo" },
  { icon: MessageSquare, titulo: "Foros doctrinarios", texto: "Debates organizados por ejes: filosofía, economía, cultura, soberanía y más.", href: "/foros" },
  { icon: BookOpen, titulo: "Biblioteca", texto: "Doctrina, discursos y material de formación para leer online o descargar.", href: "/biblioteca" },
  { icon: HeartHandshake, titulo: "Afiliación digital", texto: "Sumate al Partido en tres pasos desde el celular, sin trámites.", href: "/afiliate" },
  { icon: IdCard, titulo: "Carnet digital", texto: "Tu credencial de afiliado/a con QR, siempre en el bolsillo.", href: "/perfil" },
];

function SolDeMayo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <g fill="currentColor">
        {Array.from({ length: 32 }).map((_, i) => (
          <path
            key={i}
            d={i % 2 === 0 ? "M100 4 L106 48 L94 48 Z" : "M100 18 Q110 34 100 50 Q90 34 100 18 Z"}
            transform={`rotate(${i * 11.25} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="44" />
      </g>
    </svg>
  );
}

export default async function LandingPage() {
  const streams = await getLiveStreams({});
  const enVivo = streams.slice(0, 3);
  const destacados = RECURSOS.slice(0, 3);

  return (
    <main className="flex w-full flex-1 flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-800/60">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(116,172,223,0.22)_0%,rgba(116,172,223,0.22)_33%,rgba(255,255,255,0.04)_33%,rgba(255,255,255,0.04)_66%,rgba(116,172,223,0.14)_66%)]" />
        <SolDeMayo className="pointer-events-none absolute -right-24 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 text-amber-300/[0.07] sm:-right-10" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            {streams.length > 0 && (
              <Link
                href="/en-vivo"
                className="flex w-fit items-center gap-2 rounded-full border border-red-500/40 bg-red-600/15 px-3.5 py-1.5 text-xs font-bold text-red-200 transition hover:bg-red-600/25"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                {streams.length} {streams.length === 1 ? "transmisión" : "transmisiones"} en vivo ahora
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-tight text-white sm:text-7xl">
              La militancia,
              <br />
              <span className="text-[#74acdf]">en vivo</span> y{" "}
              <span className="text-amber-300">organizada</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              PJ TV es la plataforma digital del Justicialismo: transmisiones desde cada Unidad Básica,
              debate doctrinario, biblioteca de formación y afiliación digital, en un solo lugar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/en-vivo"
                className="flex items-center gap-2 rounded-xl bg-[#74acdf] px-6 py-3.5 text-sm font-black uppercase tracking-wider text-sky-950 shadow-xl shadow-sky-500/20 transition hover:scale-105 hover:bg-sky-300"
              >
                <Tv className="h-4 w-4" />
                Ver transmisiones
              </Link>
              <Link
                href="/afiliate"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white backdrop-blur transition hover:bg-white/10"
              >
                <HeartHandshake className="h-4 w-4 text-amber-300" />
                Afiliate
              </Link>
            </div>
          </div>

          {/* Vivo destacado */}
          <div className="lg:col-span-5">
            {enVivo[0] ? (
              <Link
                href={`/stream/${enVivo[0].id}`}
                className="group relative block aspect-video overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-sky-900/40 transition hover:border-sky-400/60"
              >
                {streamThumbnail(enVivo[0]) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={streamThumbnail(enVivo[0])!} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  En vivo
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-sky-900 shadow-2xl transition group-hover:scale-110">
                    <Radio className="h-7 w-7" />
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="line-clamp-1 text-base font-bold text-white">{enVivo[0].title}</p>
                  <p className="text-xs text-zinc-300">
                    @{enVivo[0].referente_username}
                    {enVivo[0].provincia ? ` · ${enVivo[0].provincia}` : ""}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-zinc-950/60 text-center">
                <SolDeMayo className="h-20 w-20 text-amber-300/80" />
                <p className="text-sm text-zinc-400">Próximas transmisiones muy pronto</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TRES BANDERAS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300">Nuestra doctrina</span>
          <h2 className="mt-2 font-display text-4xl uppercase tracking-tight text-white sm:text-5xl">Las tres banderas</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Un proyecto de país que pone en el centro al trabajo, a la producción nacional y a un pueblo organizado.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {BANDERAS.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={b.titulo}
                className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-7"
              >
                <span className="absolute right-5 top-3 font-display text-7xl text-white/[0.04]">{i + 1}</span>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#74acdf]/15 text-[#74acdf]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-white">{b.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{b.texto}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CITA */}
      <section className="relative overflow-hidden border-y border-zinc-800/60 bg-[#74acdf]/[0.07]">
        <SolDeMayo className="pointer-events-none absolute -left-16 top-1/2 h-72 w-72 -translate-y-1/2 text-amber-300/[0.08]" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <p className="font-display text-3xl uppercase leading-tight tracking-tight text-white sm:text-5xl">
            “La organización vence al tiempo”
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-amber-300">Juan Domingo Perón</p>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#74acdf]">La plataforma</span>
          <h2 className="mt-2 font-display text-4xl uppercase tracking-tight text-white sm:text-5xl">
            Todo el Movimiento, conectado
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FUNCIONES.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.titulo}
                href={f.href}
                className="group flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:-translate-y-0.5 hover:border-sky-500/50 hover:bg-zinc-900"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-amber-300 transition group-hover:bg-[#74acdf] group-hover:text-sky-950">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{f.titulo}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">{f.texto}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AHORA EN VIVO */}
      {enVivo.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="flex items-center gap-3 font-display text-3xl uppercase tracking-tight text-white sm:text-4xl">
              <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
              Ahora en vivo
            </h2>
            <Link href="/en-vivo" className="flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300">
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enVivo.map((s) => (
              <Link
                key={s.id}
                href={`/stream/${s.id}`}
                className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition hover:-translate-y-1 hover:border-sky-500/60"
              >
                <div className="relative aspect-video bg-zinc-950">
                  {streamThumbnail(s) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={streamThumbnail(s)!} alt="" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Radio className="h-8 w-8 text-zinc-700" />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">
                    En vivo
                  </span>
                </div>
                <div className="p-4">
                  <p className="line-clamp-1 font-bold text-white group-hover:text-sky-300">{s.title}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
                    <span>@{s.referente_username}</span>
                    {s.provincia ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-sky-400" />
                        {s.provincia}
                      </span>
                    ) : (
                      categoriaLabel(s.categoria)
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CÓMO PARTICIPAR */}
      <section className="border-y border-zinc-800/60 bg-zinc-900/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">Cómo participar</span>
            <h2 className="mt-2 font-display text-4xl uppercase tracking-tight text-white sm:text-5xl">
              Sumarse lleva un minuto
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Podés mirar y comentar sin registrarte. Cuando quieras dar el paso, te afiliás desde el celular.
            </p>
          </div>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
            {[
              { icon: UserRound, t: "Entrá", d: "Con Google, con tu email o como invitado con un apodo." },
              { icon: MessagesSquare, t: "Participá", d: "Chateá en los vivos, abrí debates y leé la Biblioteca." },
              { icon: HeartHandshake, t: "Afiliate", d: "Tres pasos y recibís tu carnet digital al instante." },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <li key={p.t} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="font-display text-3xl text-[#74acdf]">0{i + 1}</span>
                    <Icon className="h-5 w-5 text-amber-300" />
                  </div>
                  <p className="font-bold text-white">{p.t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">{p.d}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* BIBLIOTECA */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl uppercase tracking-tight text-white sm:text-4xl">Desde la Biblioteca</h2>
          <Link href="/biblioteca" className="flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300">
            Ver catálogo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {destacados.map((r) => (
            <Link
              key={r.slug}
              href={`/biblioteca/${r.slug}`}
              className="group flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-amber-300/50"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">{r.categoria}</span>
              <p className="font-serif text-lg font-bold text-white group-hover:text-amber-100">{r.titulo}</p>
              <p className="line-clamp-2 text-xs text-zinc-400">{r.descripcion}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#74acdf] via-sky-500 to-sky-700 p-8 text-sky-950 sm:p-14">
          <SolDeMayo className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 text-amber-300/40" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl uppercase leading-none tracking-tight sm:text-6xl">
              Para un peronista no hay nada mejor que otro peronista
            </h2>
            <p className="mt-4 text-sm font-medium text-sky-950/80 sm:text-base">
              Afiliate digitalmente, recibí tu carnet y sumate a la conversación de toda la militancia.
            </p>
            <Link
              href="/afiliate"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:scale-105"
            >
              Quiero afiliarme
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
