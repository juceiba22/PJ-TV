import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getThreads } from "@/lib/queries/forums";
import { createThread } from "@/app/actions/forum";
import { getCurrentProfile } from "@/lib/dal";

export default async function CategoriaPage({
  params,
  searchParams,
}: PageProps<"/foros/[categoria]">) {
  const { categoria: slug } = await params;
  const { provincia } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const threads = await getThreads(
    category.id,
    typeof provincia === "string" ? provincia : undefined,
  );
  const profile = await getCurrentProfile();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{category.name}</h1>

      {profile && (
        <form action={createThread} className="mb-8 flex flex-col gap-2">
          <input type="hidden" name="category_id" value={category.id} />
          <input type="hidden" name="category_slug" value={category.slug} />
          <input
            name="title"
            placeholder="Título del debate"
            required
            minLength={3}
            className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
          />
          <input
            name="provincia"
            placeholder="Provincia (opcional, para debates regionales)"
            className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
          />
          <div className="flex gap-2 flex-col sm:flex-row">
            <select
              name="instrumento_tipo"
              className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 bg-white dark:bg-black"
            >
              <option value="texto">Texto (Debate libre)</option>
              <option value="video">Video Externo (YouTube, Vimeo...)</option>
              <option value="documento">Documento (PDF, Google Docs...)</option>
            </select>
            <input
              name="instrumento_url"
              placeholder="Enlace al video o documento (si aplica)"
              className="flex-1 rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
            />
          </div>
          <button
            type="submit"
            className="self-start rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            Abrir debate
          </button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {threads.length === 0 && (
          <p className="text-neutral-500">Todavía no hay debates en esta categoría.</p>
        )}
        {threads.map((t) => (
          <Link
            key={t.id}
            href={`/foros/${slug}/${t.id}`}
            className="rounded-lg border border-neutral-200 p-4 transition hover:border-blue-500 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{t.title}</p>
              {t.instrumento_tipo && t.instrumento_tipo !== 'texto' && (
                <span className="text-xs uppercase bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">
                  {t.instrumento_tipo}
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              @{t.author?.username}
              {t.provincia ? ` · ${t.provincia}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
