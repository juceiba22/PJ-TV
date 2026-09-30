import { RECURSOS } from "@/lib/biblioteca";
import { BibliotecaCatalogo } from "./biblioteca-catalogo";
import { Library } from "lucide-react";

export default function BibliotecaPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 sm:justify-start">
          <Library className="h-3.5 w-3.5" />
          <span>Biblioteca Justicialista</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">Leer para conducir</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
          Doctrina, discursos, historia y material de formación para toda la militancia. Leé online o descargá cada documento.
        </p>
      </div>
      <BibliotecaCatalogo recursos={RECURSOS} />
    </main>
  );
}
