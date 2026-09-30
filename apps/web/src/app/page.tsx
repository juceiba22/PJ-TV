import Link from "next/link";
import { getLiveStreams } from "@/lib/queries/streams";
import { categoriaLabel } from "@/lib/categorias";
import { streamThumbnail } from "@/lib/video";
import { RECURSOS } from "@/lib/biblioteca";
import { ETAPAS_CONDUCCION } from "@/lib/doctrina";
import { VeinteVerdades } from "@/components/veinte-verdades";
import { ArrowRight, BookOpen, Factory, Flag, HeartHandshake, MapPin, Radio, Scale, Tv } from "lucide-react";

const BANDERAS = [
  {
    titulo: "Justicia Social",
    lema: "Socialmente justa",
    icon: Scale,
    texto:
      "Da a cada persona su derecho en función social. El trabajo es un derecho que crea la dignidad del hombre y un deber, porque es justo que cada uno produzca por lo menos lo que consume.",
  },
  {
    titulo: "Independencia Económica",
    lema: "Económicamente libre",
    icon: Factory,
    texto:
      "La economía social pone el capital al servicio de la economía, y a la economía al servicio del bienestar social. Producir, industrializar y decidir sobre lo nuestro.",
  },
  {
    titulo: "Soberanía Política",
    lema: "Políticamente soberana",
    icon: Flag,
    texto:
      "El equilibrio entre el derecho del individuo y el de la comunidad. Un gobierno que hace lo que el pueblo quiere y defiende un solo interés: el del pueblo.",
  },
];

const HITOS = [
  { valor: "1945", label: "17 de octubre: nace el Movimiento" },
  { valor: "3", label: "Banderas históricas" },
  { valor: "20", label: "Verdades" },
  { valor: "1", label: "Solo interés: el del pueblo" },
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

function Eyebrow({ children, color = "text-red-600" }: { children: React.ReactNode; color?: string }) {
  return <span className={`text-xs font-bold uppercase tracking-[0.2em] ${color}`}>{children}</span>;
}

export default async function LandingPage() {
  const streams = await getLiveStreams({});
  const enVivo = streams.slice(0, 3);
  const destacados = RECURSOS.filter((r) => r.tipo === "pdf").slice(0, 4);

  return (
    <main className="flex w-full flex-1 flex-col">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#74acdf_0%,#74acdf_32%,#ffffff_32%,#ffffff_68%,#74acdf_68%,#74acdf_100%)] opacity-[0.22]" />
        <SolDeMayo className="pointer-events-none absolute -right-24 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 text-amber-300/25 sm:-right-10" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/pj-escudo.svg" alt="Escudo del Partido Justicialista" className="h-20 w-20 drop-shadow-md sm:h-24 sm:w-24" />
              <p className="font-display text-3xl uppercase leading-[0.9] tracking-tight text-blue-600 sm:text-4xl">
                Partido
                <br />
                Justicialista
              </p>
            </div>

            <h1 className="font-display text-5xl uppercase leading-[0.92] tracking-tight text-blue-800 sm:text-7xl">
              <span className="block text-sky-400">Socialmente justa.</span>
              <span className="block">Económicamente libre.</span>
              <span className="block text-red-600">Políticamente soberana.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Somos el movimiento que puso al trabajo, a la producción nacional y al pueblo organizado en el
              centro de la historia argentina. Hoy la militancia también se encuentra acá: en vivo, debatiendo
              y formándose en la doctrina.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/afiliate"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-display text-base uppercase tracking-wider text-white shadow-xl shadow-blue-600/25 transition hover:scale-105 hover:bg-blue-700"
              >
                <HeartHandshake className="h-4 w-4" />
                Afiliate
              </Link>
              <Link
                href="/en-vivo"
                className="flex items-center gap-2 rounded-xl border-2 border-blue-600 bg-white px-6 py-3.5 font-display text-base uppercase tracking-wider text-blue-600 transition hover:bg-sky-50"
              >
                <Tv className="h-4 w-4 text-red-600" />
                Ver en vivo
              </Link>
              {streams.length > 0 && (
                <span className="flex items-center gap-2 text-xs font-bold text-red-600">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
                  {streams.length} {streams.length === 1 ? "transmisión" : "transmisiones"} ahora
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            {enVivo[0] ? (
              <Link
                href={`/stream/${enVivo[0].id}`}
                className="group relative block aspect-video overflow-hidden rounded-3xl border-4 border-white bg-black shadow-2xl shadow-sky-900/25 ring-1 ring-sky-900/10 transition hover:-translate-y-1"
              >
                {streamThumbnail(enVivo[0]) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={streamThumbnail(enVivo[0])!} alt="" className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  En vivo
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-2xl transition group-hover:scale-110">
                    <Radio className="h-7 w-7" />
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="line-clamp-1 text-base font-bold">{enVivo[0].title}</p>
                  <p className="text-xs text-white/80">
                    @{enVivo[0].referente_username}
                    {enVivo[0].provincia ? ` · ${enVivo[0].provincia}` : ""}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-3xl border-4 border-white bg-sky-50 text-center shadow-xl ring-1 ring-sky-900/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/pj-escudo.svg" alt="" className="h-24 w-24" />
                <p className="text-sm font-semibold text-blue-600">Próximas transmisiones muy pronto</p>
              </div>
            )}
          </div>
        </div>
        <div className="franja-salta relative h-3 w-full" />
      </section>

      {/* ============ HITOS ============ */}
      <section className="bg-blue-600 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {HITOS.map((h) => (
            <div key={h.label} className="text-center">
              <p className="font-display text-5xl leading-none sm:text-6xl">{h.valor}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-sky-200">{h.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ QUIÉNES SOMOS ============ */}
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>Quiénes somos</Eyebrow>
          <h2 className="mt-2 font-display text-4xl uppercase leading-[0.95] tracking-tight text-blue-700 sm:text-6xl">
            Una filosofía de vida simple, práctica y popular
          </h2>
          <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-zinc-300">
            <p>
              El Justicialismo nació como una nueva filosofía de la vida: <strong className="text-zinc-50">profundamente
              cristiana y profundamente humana</strong>. No es un círculo ni una fórmula de laboratorio, es un
              movimiento esencialmente popular, hecho por los que trabajan.
            </p>
            <p>
              Creemos que un gobierno sin doctrina es un cuerpo sin alma. Por eso el peronismo tiene su propia
              doctrina política, económica y social, y la sostiene con organización, formación y militancia en cada
              barrio del país.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nuestra escala de valores</p>
            <ol className="mt-3 grid grid-cols-3 gap-3">
              {["La Patria", "El Movimiento", "Los hombres"].map((v, i) => (
                <li
                  key={v}
                  className={`rounded-2xl border p-4 text-center ${
                    i === 0 ? "border-blue-600 bg-blue-600 text-white" : i === 1 ? "border-sky-300 bg-sky-100 text-blue-700" : "border-sky-200 bg-white text-blue-700"
                  }`}
                >
                  <span className="block font-display text-3xl leading-none">{i + 1}º</span>
                  <span className="mt-1 block font-display text-lg uppercase tracking-wide">{v}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-5">
          <figure className="relative overflow-hidden rounded-3xl bg-[linear-gradient(180deg,#74acdf_0_33%,#ffffff_33%_66%,#74acdf_66%)] p-8 shadow-2xl shadow-sky-900/20 ring-1 ring-sky-900/10">
            <SolDeMayo className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 text-amber-300/60" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/pj-escudo.svg" alt="" className="relative mx-auto h-56 w-56 drop-shadow-xl" />
            <blockquote className="relative mt-6 rounded-2xl bg-white/95 p-5 text-center shadow-lg">
              <p className="font-display text-2xl uppercase leading-tight tracking-tight text-blue-700 sm:text-3xl">
                “En esta tierra, lo mejor que tenemos es el pueblo”
              </p>
              <figcaption className="mt-2 text-xs font-bold uppercase tracking-widest text-red-600">Verdad Nº 20</figcaption>
            </blockquote>
          </figure>
        </div>
      </section>

      {/* ============ TRES BANDERAS ============ */}
      <section className="bg-sky-50">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 max-w-3xl">
            <Eyebrow>Nuestra doctrina</Eyebrow>
            <h2 className="mt-2 font-display text-4xl uppercase tracking-tight text-blue-700 sm:text-5xl">Las tres banderas</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Una doctrina política, económica y social que se resume en un solo proyecto de país.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {BANDERAS.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.titulo}
                  className="relative flex flex-col overflow-hidden rounded-3xl border border-sky-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-900/10"
                >
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#74acdf_0_33%,#ffffff_33%_66%,#74acdf_66%)]" />
                  <span className="absolute right-5 top-3 font-display text-7xl text-sky-100">{i + 1}</span>
                  <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="relative text-xs font-bold uppercase tracking-widest text-red-600">{b.lema}</p>
                  <h3 className="relative mt-1 font-display text-3xl uppercase tracking-wide text-blue-700">{b.titulo}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-zinc-400">{b.texto}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 20 VERDADES ============ */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Eyebrow>17 de octubre de 1950 · Plaza de Mayo</Eyebrow>
            <h2 className="mt-2 font-display text-4xl uppercase tracking-tight text-blue-700 sm:text-5xl">
              Las 20 Verdades del Justicialismo
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Leídas por Perón desde los balcones de la Casa de Gobierno, siguen siendo la síntesis más clara de lo que somos.
            </p>
          </div>
          <Link
            href="/biblioteca/las-20-verdades"
            className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800"
          >
            <BookOpen className="h-4 w-4" /> Documento original
          </Link>
        </div>
        <VeinteVerdades />
      </section>

      {/* ============ CITA ORGANIZACIÓN ============ */}
      <section className="relative overflow-hidden bg-red-600 text-white">
        <div className="absolute inset-x-0 top-0 h-2 bg-negro" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-negro" />
        <SolDeMayo className="pointer-events-none absolute -left-16 top-1/2 h-72 w-72 -translate-y-1/2 text-amber-300/25" />
        <SolDeMayo className="pointer-events-none absolute -right-20 top-1/2 hidden h-72 w-72 -translate-y-1/2 text-amber-300/15 md:block" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="font-display text-4xl uppercase leading-tight tracking-tight sm:text-6xl">
            “La organización vence al tiempo”
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base text-red-50/90">
            Los hombres pasan, las organizaciones permanecen. Por eso organizamos el Movimiento: para que la
            doctrina y la militancia sobrevivan a cualquier coyuntura.
          </p>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-amber-200">
            Juan Domingo Perón
          </p>
        </div>
      </section>

      {/* ============ COMUNIDAD ORGANIZADA ============ */}
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-sky-300 bg-sky-50" />
          <div className="absolute inset-[16%] rounded-full bg-sky-100" />
          <div className="absolute inset-[34%] flex items-center justify-center rounded-full bg-blue-600 shadow-xl shadow-blue-600/30">
            <span className="font-display text-3xl uppercase text-white">Yo</span>
          </div>
          <span className="absolute top-[9%] font-display text-xl uppercase tracking-widest text-blue-700">Nación</span>
          <span className="absolute top-[24%] font-display text-lg uppercase tracking-widest text-sky-500">Nosotros</span>
          <span className="absolute bottom-[8%] rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-red-600 shadow">
            Armonía
          </span>
        </div>
        <div>
          <Eyebrow>La Comunidad Organizada · 1949</Eyebrow>
          <h2 className="mt-2 font-display text-4xl uppercase leading-[0.95] tracking-tight text-blue-700 sm:text-6xl">
            La realización del yo en el nosotros
          </h2>
          <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-zinc-300">
            <p>
              Frente al individualismo que aísla y al colectivismo que anula, el Justicialismo propone la armonía:
              personas plenas dentro de una comunidad que también se realiza. Nadie se salva solo.
            </p>
            <p>
              En la Comunidad Organizada la felicidad no es un bien que se disfruta en el egoísmo, sino algo que se
              comparte. Por eso cada Unidad Básica, cada club, cada cooperadora y cada sindicato son parte de un mismo
              tejido: las organizaciones libres del pueblo.
            </p>
          </div>
          <Link
            href="/biblioteca/la-comunidad-organizada"
            className="mt-6 inline-flex items-center gap-2 font-display text-base uppercase tracking-wider text-blue-600 hover:text-blue-800"
          >
            Leer La Comunidad Organizada <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ============ CONDUCCIÓN → PLATAFORMA ============ */}
      <section className="bg-blue-900 text-white">
        <div className="franja-salta h-2 w-full" />
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 max-w-3xl">
            <Eyebrow color="text-amber-300">La plataforma PJ TV</Eyebrow>
            <h2 className="mt-2 font-display text-4xl uppercase leading-[0.95] tracking-tight sm:text-5xl">
              Organizar, educar, enseñar, capacitar y conducir
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-sky-100/80 sm:text-base">
              Perón enseñaba que conducir no es solo conducir: primero hay que organizar, educar, enseñar y capacitar.
              Construimos una herramienta digital para cada una de esas tareas.
            </p>
          </div>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ETAPAS_CONDUCCION.map((e, i) => (
              <li key={e.verbo}>
                <Link
                  href={e.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-sky-300/60 hover:bg-white/10"
                >
                  <span className="font-display text-4xl leading-none text-sky-300">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-2xl uppercase tracking-wide">{e.verbo}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-sky-100/80">{e.texto}</p>
                  <span className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-300 group-hover:text-amber-200">
                    {e.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ AHORA EN VIVO ============ */}
      {enVivo.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="flex items-center gap-3 font-display text-3xl uppercase tracking-tight text-blue-700 sm:text-4xl">
              <span className="h-3 w-3 animate-pulse rounded-full bg-red-600" />
              Ahora en vivo
            </h2>
            <Link href="/en-vivo" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800">
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enVivo.map((s) => (
              <Link
                key={s.id}
                href={`/stream/${s.id}`}
                className="group overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-900/10"
              >
                <div className="relative aspect-video bg-black">
                  {streamThumbnail(s) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={streamThumbnail(s)!} alt="" className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-sky-100">
                      <Radio className="h-8 w-8 text-sky-300" />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">
                    En vivo
                  </span>
                </div>
                <div className="p-4">
                  <p className="line-clamp-1 font-bold text-zinc-50 group-hover:text-blue-600">{s.title}</p>
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

      {/* ============ BIBLIOTECA ============ */}
      <section className="bg-sky-50">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <Eyebrow>Leer para conducir</Eyebrow>
              <h2 className="mt-1 font-display text-3xl uppercase tracking-tight text-blue-700 sm:text-4xl">La doctrina, en sus fuentes</h2>
            </div>
            <Link href="/biblioteca" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800">
              Ver Biblioteca <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destacados.map((r) => (
              <Link
                key={r.slug}
                href={`/biblioteca/${r.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-900/10"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-5 text-center">
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#74acdf_0_33%,#ffffff_33%_66%,#74acdf_66%)]" />
                  <p className="font-serif text-xl font-bold leading-snug text-white">{r.titulo}</p>
                  <span className="absolute bottom-3 right-3 rounded bg-amber-300 px-1.5 py-0.5 text-[10px] font-black text-blue-900">
                    {r.anio}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">{r.autor}</span>
                  <p className="line-clamp-3 text-xs leading-relaxed text-zinc-400">{r.descripcion}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 text-white sm:p-14">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(180deg,#74acdf_0_33%,#ffffff_33%_66%,#74acdf_66%)] opacity-90 md:block" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/pj-escudo.svg" alt="" className="absolute right-[8%] top-1/2 hidden h-52 w-52 -translate-y-1/2 drop-shadow-xl md:block" />
          <div className="relative max-w-xl">
            <Eyebrow color="text-amber-300">Verdad Nº 6</Eyebrow>
            <h2 className="mt-2 font-display text-4xl uppercase leading-none tracking-tight sm:text-6xl">
              Para un justicialista no hay nada mejor que otro justicialista
            </h2>
            <p className="mt-4 text-sm font-medium text-sky-100 sm:text-base">
              Afiliate en tres pasos desde el celular, recibí tu carnet digital y sumate a la conversación de toda la
              militancia. Podés entrar como invitado cuando quieras.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/afiliate"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-display text-base uppercase tracking-wider text-blue-700 transition hover:scale-105"
              >
                Quiero afiliarme
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/60 px-6 py-3.5 font-display text-base uppercase tracking-wider text-white transition hover:bg-white/10"
              >
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
