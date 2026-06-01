// ─── Metadata SEO — Template ──────────────────────────────────────────
// Copia y personaliza este archivo para cada proyecto nuevo.

export const projectMetadata = {
  projectName: '_NOMBRE DEL PROYECTO_',
  constructora: '_NOMBRE DE LA CONSTRUCTORA_',
  agency: 'MIESGROUP',

  title: '_PROYECTO_ | Recorrido Virtual 360° | _CONSTRUCTORA_',
  description:
    'Explora cada espacio del proyecto _PROYECTO_ con tecnologia de recorrido virtual 360°. ' +
    '_CONSTRUCTORA_.',
  keywords: [
    '_PROYECTO_',
    '_CONSTRUCTORA_',
    'recorrido virtual 360',
    'tour virtual arquitectonico',
    'MIESGROUP',
  ],

  ogImage: '/projects/_constructora_/_proyecto_/images/exterior/building.jpg',
  ogType: 'website' as const,

  schema: {
    type: 'RealEstateAgent',
    name: '_PROYECTO_ — _CONSTRUCTORA_',
    address: {
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      addressCountry: 'CO',
    },
  },
};
