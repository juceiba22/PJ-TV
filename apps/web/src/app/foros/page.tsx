import Link from "next/link";
import { getCategories } from "@/lib/queries/forums";

export default async function ForosPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Foros Doctrinarios</h1>
      <div className="flex flex-col gap-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/foros/${c.slug}`}
            className="rounded-lg border border-neutral-200 p-4 font-medium transition hover:border-blue-500 dark:border-neutral-800"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
