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
            <p className="font-medium">{t.title}</p>
            <p className="text-sm text-neutral-500">
              @{t.author?.username}
              {t.provincia ? ` · ${t.provincia}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
