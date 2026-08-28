import Link from "next/link";
import { getCurrentProfile } from "@/lib/dal";
import { logout } from "@/app/actions/auth";

export async function NavBar() {
  const profile = await getCurrentProfile();

  return (
    <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
      <Link href="/" className="text-lg font-bold">
        PJ TV
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/">Streams</Link>
        <Link href="/foros">Foros</Link>
        {profile?.role === "referente" && <Link href="/dashboard">Mi UB</Link>}
        {profile ? (
          <div className="flex items-center gap-3">
            <Link href="/perfil" className="font-medium hover:text-blue-600">
              Mi Perfil
            </Link>
            <span className="text-neutral-500">@{profile.username}</span>
            <form action={logout}>
              <button type="submit" className="font-medium text-red-600 hover:text-red-700">
                Salir
              </button>
            </form>
          </div>
        ) : (
          <>
            <Link href="/login">Ingresar</Link>
            <Link
              href="/registro"
              className="rounded bg-blue-600 px-3 py-1.5 font-medium text-white"
            >
              Registrarme
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
