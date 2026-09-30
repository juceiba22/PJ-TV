export const CATEGORIAS = [
  { slug: "filosofia-justicialista", label: "Filosofía Justicialista" },
  { slug: "principios-doctrinarios", label: "Principios Doctrinarios" },
  { slug: "principios-politicos", label: "Principios Políticos" },
  { slug: "lineamientos-economicos", label: "Lineamientos Económicos" },
  { slug: "cultura", label: "Cultura" },
  { slug: "justicia-social", label: "Justicia Social" },
  { slug: "soberania-politica", label: "Soberanía Política" },
  { slug: "independencia-economica", label: "Independencia Económica" },
];

export function categoriaLabel(slug: string | null | undefined) {
  if (!slug) return null;
  return CATEGORIAS.find((c) => c.slug === slug)?.label ?? slug;
}
