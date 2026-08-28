import { requireProfile } from "@/lib/dal";
import { updateProfile } from "@/app/actions/profile";
import Image from "next/image";

export default async function PerfilPage() {
  const profile = await requireProfile();
  // Supabase join podría retornar un array con 1 elemento o un objeto
  const details = Array.isArray(profile.affiliate_details) 
    ? profile.affiliate_details[0] 
    : profile.affiliate_details;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Mi Perfil y Carnet de Afiliado</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        
        {/* Formulario de Datos */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Actualizar Datos Personales</h2>
          <form action={updateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre Completo</label>
              <input 
                type="text" 
                name="nombre_completo" 
                defaultValue={details?.nombre_completo || ""} 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">DNI</label>
              <input 
                type="text" 
                name="dni" 
                defaultValue={details?.dni || ""} 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Número de Afiliado</label>
              <input 
                type="text" 
                name="numero_afiliado" 
                defaultValue={details?.numero_afiliado || ""} 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Afiliación</label>
              <input 
                type="date" 
                name="fecha_afiliacion" 
                defaultValue={details?.fecha_afiliacion ? new Date(details.fecha_afiliacion).toISOString().split('T')[0] : ""} 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Guardar Datos
            </button>
          </form>
        </div>

        {/* Carnet Digital */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-2xl overflow-hidden border-2 border-yellow-400">
            {/* Header del Carnet */}
            <div className="bg-white text-blue-900 px-6 py-4 flex items-center justify-between border-b-4 border-yellow-400">
              <div className="flex-1 font-black text-xl tracking-wider">
                PARTIDO JUSTICIALISTA
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-xs shadow-inner">
                {/* Placeholder para logo escudo PJ */}
                <span>ESCUDO</span>
              </div>
            </div>

            {/* Cuerpo del Carnet */}
            <div className="px-6 py-6 space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 border-white flex-shrink-0 flex items-center justify-center text-gray-500">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>FOTO</span>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-wide">
                    {details?.nombre_completo || profile.username}
                  </h3>
                  <p className="text-blue-100 font-medium">Afiliado/a</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-800/50 p-3 rounded">
                  <p className="text-xs text-blue-200 uppercase font-semibold">DNI</p>
                  <p className="font-mono text-lg">{details?.dni || "---"}</p>
                </div>
                <div className="bg-blue-800/50 p-3 rounded">
                  <p className="text-xs text-blue-200 uppercase font-semibold">Nº Afiliado</p>
                  <p className="font-mono text-lg">{details?.numero_afiliado || "---"}</p>
                </div>
              </div>
              
              <div className="bg-blue-800/50 p-3 rounded">
                <p className="text-xs text-blue-200 uppercase font-semibold">Fecha de Afiliación</p>
                <p className="font-medium">
                  {details?.fecha_afiliacion 
                    ? new Date(details.fecha_afiliacion).toLocaleDateString("es-AR") 
                    : "---"}
                </p>
              </div>
            </div>

            {/* Footer del Carnet */}
            <div className="bg-blue-900 px-6 py-3 text-center text-sm font-semibold tracking-widest text-blue-200">
              CARNET DIGITAL AUTENTICADO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
