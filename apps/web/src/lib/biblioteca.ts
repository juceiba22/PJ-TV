// Catálogo de la Biblioteca. Para sumar material:
//  - PDF: copiar el archivo a apps/web/public/biblioteca/ y usar tipo "pdf" con archivo "/biblioteca/nombre.pdf"
//  - Página web: tipo "enlace" con la URL
//  - Texto propio: tipo "texto" con los párrafos en `contenido`
export type Recurso = {
  slug: string;
  titulo: string;
  autor: string;
  anio?: string;
  categoria: CategoriaBiblioteca;
  descripcion: string;
  tipo: "pdf" | "enlace" | "texto";
  archivo?: string;
  url?: string;
  contenido?: string[];
  portada?: string;
  destacado?: boolean;
};

export const CATEGORIAS_BIBLIOTECA = [
  "Doctrina",
  "Discursos",
  "Historia",
  "Formación política",
  "Documentos partidarios",
] as const;

export type CategoriaBiblioteca = (typeof CATEGORIAS_BIBLIOTECA)[number];

export const RECURSOS: Recurso[] = [
  {
    slug: "las-tres-banderas",
    titulo: "Las tres banderas del Justicialismo",
    autor: "Escuela de Formación PJ TV",
    categoria: "Formación política",
    descripcion: "Introducción a la Justicia Social, la Independencia Económica y la Soberanía Política.",
    tipo: "texto",
    destacado: true,
    contenido: [
      "El Justicialismo se organiza alrededor de tres banderas que resumen su proyecto de país. No son consignas aisladas: se sostienen mutuamente y ninguna puede realizarse plenamente sin las otras dos.",
      "Justicia Social. El trabajo es la fuente de la dignidad y el eje de la vida comunitaria. La riqueza que produce la Nación debe distribuirse de manera que cada argentino acceda a una vida digna: vivienda, salud, educación, descanso y cultura.",
      "Independencia Económica. Un pueblo no es libre si las decisiones sobre su producción, su moneda y sus recursos se toman afuera. Desarrollar la industria nacional, cuidar el mercado interno y agregar valor a lo que producimos es condición de la justicia social.",
      "Soberanía Política. La Nación decide su destino sin tutelas. Soberanía es también participación: un pueblo organizado, con sus organizaciones libres, que protagoniza las decisiones que lo afectan.",
      "Las tres banderas se proyectan en la idea de Comunidad Organizada: una sociedad donde el Estado, los trabajadores, los empresarios y las organizaciones del pueblo cooperan en armonía para alcanzar la grandeza de la Nación y la felicidad del pueblo.",
    ],
  },
  {
    slug: "la-unidad-basica",
    titulo: "La Unidad Básica: puerta de entrada al Movimiento",
    autor: "Escuela de Formación PJ TV",
    categoria: "Formación política",
    descripcion: "Qué es una UB, cómo se organiza y cuál es su rol en el territorio.",
    tipo: "texto",
    contenido: [
      "La Unidad Básica es la célula de organización territorial del peronismo. Es el lugar donde el vecino se acerca al Movimiento, donde se forman los cuadros y donde se canalizan las demandas del barrio.",
      "Una UB activa cumple tres funciones: acción social (acompañar a los vecinos en sus necesidades concretas), formación política (estudiar la doctrina y la realidad local) y organización (articular con otras UB, con el municipio y con las organizaciones libres del pueblo).",
      "PJ TV le da a cada Unidad Básica una herramienta nueva: transmitir sus actividades en vivo, abrir debates en los foros y sumar afiliados digitalmente, conectando el territorio con toda la militancia.",
    ],
  },
  {
    slug: "guia-militancia-digital",
    titulo: "Guía de militancia digital",
    autor: "Equipo PJ TV",
    categoria: "Documentos partidarios",
    descripcion: "Buenas prácticas para transmitir, debatir y comunicar desde la plataforma.",
    tipo: "texto",
    contenido: [
      "1. Transmití con regularidad: una actividad semanal en vivo genera una comunidad fiel. Anunciá el horario en los foros y redes.",
      "2. Moderá con respeto: el chat es un espacio de encuentro. Los referentes pueden moderar mensajes que agravien a compañeros.",
      "3. Formación antes que consigna: usá la Biblioteca para acompañar cada debate con material de lectura.",
      "4. Sumá afiliados: compartí el enlace de afiliación digital al final de cada transmisión.",
    ],
  },
];

export function getRecurso(slug: string) {
  return RECURSOS.find((r) => r.slug === slug) ?? null;
}
