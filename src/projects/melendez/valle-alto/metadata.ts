// ─── Metadata SEO del proyecto Valle Alto ─────────────────────────────
// Este archivo alimenta el layout.tsx cuando se activa este proyecto.
// Actualiza los valores cuando se defina el dominio y el contenido final.

export const valleAltoMetadata = {
  // ─── Datos del proyecto ──────────────────────────────────────────
  projectName: 'Valle Alto',
  constructora: 'Constructora Melendez',
  agency: 'MIESGROUP',

  // ─── SEO ─────────────────────────────────────────────────────────
  title: 'Valle Alto | Recorrido Virtual 360° | Constructora Melendez',
  description:
    'Explora cada espacio del proyecto Valle Alto con tecnologia de recorrido virtual 360°. ' +
    'Apartamentos modernos con acabados de alta calidad. Constructora Melendez.',
  keywords: [
    'Valle Alto',
    'Constructora Melendez',
    'recorrido virtual 360',
    'apartamentos nuevos',
    'tour virtual arquitectonico',
    'inmobiliaria',
    'MIESGROUP',
  ],

  // ─── Open Graph / Social ─────────────────────────────────────────
  // ogImage: URL de imagen preview para redes sociales (1200x630 px recomendado)
  // Usar un render o foto exterior del proyecto
  ogImage: '/projects/melendez/valle-alto/images/exterior/building.jpg',
  ogType: 'website' as const,

  // ─── Schema markup ───────────────────────────────────────────────
  // Para uso futuro con JSON-LD (RealEstate, LocalBusiness, etc.)
  schema: {
    type: 'RealEstateAgent',
    name: 'Valle Alto — Constructora Melendez',
    address: {
      // ACTUALIZAR: direccion real del proyecto
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      addressCountry: 'CO',
    },
  },
};
