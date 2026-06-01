# Valle Alto — Constructora Melendez

Proyecto de recorrido virtual 360 producido por MIESGROUP para Constructora Melendez.

Este proyecto tiene **dos tours independientes**, uno por cada tipologia de apartamento:

| Tour            | Export                | Descripcion                          |
|-----------------|-----------------------|--------------------------------------|
| Tipo A          | `valleAltoTipoA`      | Modelo mayor — 2 hab / 2 banos       |
| Tipo B          | `valleAltoTipoB`      | Modelo menor — 2 hab / 1 bano        |

## Archivos de configuracion

| Archivo         | Proposito                                             |
|-----------------|-------------------------------------------------------|
| tour.config.ts  | Configuracion de ambos tours: escenas, hotspots,      |
|                 | planos de planta. Exporta valleAltoTipoA y TipoB.     |
| metadata.ts     | Metadatos SEO: title, description, Open Graph         |

## Estructura de panoramas

```
public/projects/melendez/valle-alto/panoramas/
  tipo-a/          <- imagenes 360 del Apartamento Tipo A
    entrada.jpg
    sala.jpg
    cocina.jpg
    alcoba-principal.jpg
    bano-principal.jpg
    balcon.jpg
  tipo-b/          <- imagenes 360 del Apartamento Tipo B
    entrada.jpg
    sala.jpg
    cocina.jpg
    alcoba-principal.jpg
    bano-principal.jpg
    balcon.jpg
```

## Como activar un tour en la aplicacion

Editar `src/lib/tour-store.ts` e importar el tour deseado:

```typescript
// Tipo A (default):
import tourConfig from '@/projects/melendez/valle-alto/tour.config';

// Tipo B:
import { valleAltoTipoB as tourConfig } from '@/projects/melendez/valle-alto/tour.config';
```

Y en `src/app/layout.tsx`, importar los metadatos:
```typescript
import { valleAltoMetadata } from '@/projects/melendez/valle-alto/metadata';
export const metadata: Metadata = { ...valleAltoMetadata };
```

## Estado de implementacion

### Comun a ambos tours
- [ ] Logos de Melendez recibidos y colocados en public/projects/melendez/branding/
- [ ] Logo de MIESGROUP colocado en public/projects/melendez/branding/
- [ ] Imagen exterior del edificio: public/projects/melendez/valle-alto/images/exterior/building.jpg
- [ ] Metadatos SEO finales actualizados en metadata.ts
- [ ] Tour activado en tour-store.ts y layout.tsx
- [ ] Build de produccion probado

### Apartamento Tipo A
- [ ] Panoramas recibidos y colocados en public/projects/melendez/valle-alto/panoramas/tipo-a/
- [ ] Hotspots calibrados (pitch/yaw ajustados sobre los panoramas reales)
- [ ] Plano tipo-a-plano.png colocado en floor-plans/ y coordenadas medidas
- [ ] Coordenadas del floorPlan ingresadas en tour.config.ts (valleAltoTipoA)

### Apartamento Tipo B
- [ ] Panoramas recibidos y colocados en public/projects/melendez/valle-alto/panoramas/tipo-b/
- [ ] Hotspots calibrados (pitch/yaw ajustados sobre los panoramas reales)
- [ ] Plano tipo-b-plano.png colocado en floor-plans/ y coordenadas medidas
- [ ] Coordenadas del floorPlan ingresadas en tour.config.ts (valleAltoTipoB)
