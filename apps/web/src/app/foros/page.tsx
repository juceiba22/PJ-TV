import Link from "next/link";
import { getCategories } from "@/lib/queries/forums";
import {
  MessageSquare,
  BookOpen,
  ArrowRight,
  Sparkles,
  Flame,
  Shield,
  Coins,
  Palette,
  Users,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
  "filosofia-justicialista": BookOpen,
  "principios-doctrinarios": Flame,
  "principios-politicos": Shield,
  "lineamientos-economicos": Coins,
  cultura: Palette,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "filosofia-justicialista":
    "La Comunidad Organizada, el humanismo justicialista y la concepción integral del hombre.",
  "principios-doctrinarios":
    "Las 20 verdades peronistas y las bases ideológicas de nuestro movimiento.",
  "principios-politicos":
    "Soberanía política, representatividad y conducción estratégica en el territorio.",
  "lineamientos-economicos":
    "Independencia económica, desarrollo productivo, justicia distributiva y trabajo.",
  cultura:
    "Identidad nacional, arte, comunicación popular y pensamiento latinoamericano.",
};

export default async function ForosPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ágora de Formación y Debate</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">
          Foros Doctrinarios
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
          Espacios de formación, intercambio de ideas y debate federal organizados según los grandes ejes doctrinarios del peronismo.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const Icon = CATEGORY_ICONS[c.slug] ?? MessageSquare;
          const desc =
            CATEGORY_DESCRIPTIONS[c.slug] ??
            "Participá en los debates e intercambio de documentos de esta categoría.";

          return (
            <Link
              key={c.id}
              href={`/foros/${c.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-sky-500/60 hover:shadow-xl hover:shadow-sky-500/10"
            >
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/20 to-sky-500/10 border border-sky-500/30 text-sky-400 shadow-inner transition group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-zinc-50 transition group-hover:text-sky-400">
                    {c.name}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-3">
                    {desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-zinc-800/60 pt-4 text-xs font-semibold text-sky-400 group-hover:text-sky-300">
                <span>Ver debates abiertos</span>
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
