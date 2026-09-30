import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecurso, RECURSOS } from "@/lib/biblioteca";
import { ArrowLeft, Download, ExternalLink, MessageSquare } from "lucide-react";

export function generateStaticParams() {
  return RECURSOS.map((r) => ({ slug: r.slug }));
}

export default async function RecursoPage({ params }: PageProps<"/biblioteca/[slug]">) {
  const { slug } = await params;
  const r = getRecurso(slug);
  if (!r) notFound();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Link href="/biblioteca" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-zinc-50">
        <ArrowLeft className="h-4 w-4" />
        Volver a la Biblioteca
      </Link>

      <header className="flex flex-col gap-3 border-b border-zinc-800/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">{r.categoria}</span>
          <h1 className="mt-1 text-2xl font-black text-zinc-50 sm:text-4xl">{r.titulo}</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {r.autor}
            {r.anio ? ` · ${r.anio}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {r.tipo === "pdf" && r.archivo && (
            <a href={r.archivo} download className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-500">
              <Download className="h-3.5 w-3.5" />
              Descargar PDF
            </a>
          )}
          {r.tipo === "enlace" && r.url && (
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-500">
              <ExternalLink className="h-3.5 w-3.5" />
              Abrir sitio
            </a>
          )}
          <Link href="/foros/principios-doctrinarios" className="flex items-center gap-1.5 rounded-xl border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800">
            <MessageSquare className="h-3.5 w-3.5" />
            Debatir en el foro
          </Link>
        </div>
      </header>

      <p className="text-sm leading-relaxed text-zinc-300">{r.descripcion}</p>

      {r.tipo === "pdf" && r.archivo && (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <iframe src={`${r.archivo}#view=FitH`} title={r.titulo} className="h-[80vh] w-full" />
        </div>
      )}

      {r.tipo === "enlace" && r.url && (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-white">
          <iframe src={r.url} title={r.titulo} className="h-[75vh] w-full" />
        </div>
      )}

      {r.tipo === "texto" && r.contenido && (
        <article className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-5 font-serif text-[17px] leading-8 text-zinc-200">
            {r.contenido.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>
      )}
    </main>
  );
}
