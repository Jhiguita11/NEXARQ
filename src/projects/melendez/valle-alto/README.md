# Valle Alto — Constructora Melendez

Proyecto de recorrido virtual 360° producido por MIESGROUP para Constructora Melendez.

Este proyecto tiene **dos tours**, uno por cada tipología de apartamento:

| Tour    | Export            | Estado       | Panoramas                                     |
|---------|-------------------|--------------|-----------------------------------------------|
| Tipo B  | `valleAltoTipoB`  | Activo       | 7 JPGs entregados y funcionando               |
| Tipo A  | `valleAltoTipoA`  | Activo       | 7 JPGs entregados y funcionando               |

Ambas tipologías están activas, en el tour web y en el modo VR.

## Modo VR

`public/vr.html` no lleva las escenas escritas a mano: se generan desde este
mismo `tour.config.ts`, que es la única fuente de verdad. Tras tocar escenas,
hotspots o variantes hay que regenerarlas, y tras añadir panoramas nuevos hay
que producir sus versiones reducidas (el Quest no renderiza 8000×4000):

```bash
bun scripts/generate-vr-panoramas.mjs public/projects/melendez/valle-alto/panoramas/tipo-a
bun scripts/generate-vr-panoramas.mjs public/projects/melendez/valle-alto/panoramas/tipo-b
bun scripts/generate-vr-scenes.ts
```

---

## Archivos de configuración

| Archivo          | Propósito                                                       |
|------------------|-----------------------------------------------------------------|
| `tour.config.ts` | Config de ambos tours: escenas, hotspots, planos. Exports: `valleAltoTipoA`, `valleAltoTipoB`, default combinado. |
| `metadata.ts`    | Metadatos SEO: title, description, Open Graph                   |

---

## Estructura de panoramas

```
public/projects/melendez/valle-alto/panoramas/
  tipo-a/                  PENDIENTE — cliente entregará panoramas
    README.md
  tipo-b/                  COMPLETO — 7 JPGs
    acceso.jpg
    sala.jpg
    estudio.jpg
    alcoba-principal.jpg
    alcoba-auxiliar.jpg
    alcoba-opcion-2.jpg
    bano.jpg
    vr/                    Copia de los 7 JPGs para modo A-Frame
      acceso.jpg
      sala.jpg
      estudio.jpg
      alcoba-principal.jpg
      alcoba-auxiliar.jpg
      alcoba-opcion-2.jpg
      bano.jpg
```

---

## Modo VR (Meta Quest)

El archivo `public/vr.html` contiene el tour VR solo para Tipo B.
Se accede desde el sidebar del tour → "Realidad Virtual".
El link pasa automáticamente `?scene=<escena actual>` para abrir en la
escena donde estaba el usuario.

---

## Cómo activar una tipología en la app

Editar `src/lib/tour-store.ts`:

```typescript
// Config combinado (muestra selector con Tipo A y Tipo B):
import tourConfig from '@/projects/melendez/valle-alto/tour.config';

// Solo Tipo B:
import { valleAltoTipoB as tourConfig } from '@/projects/melendez/valle-alto/tour.config';

// Solo Tipo A (cuando tenga panoramas):
import { valleAltoTipoA as tourConfig } from '@/projects/melendez/valle-alto/tour.config';
```

---

## Lista de pendientes

### Tipo A (bloqueado hasta que lleguen assets del cliente)
- [ ] Recibir y colocar panoramas en `panoramas/tipo-a/`
  - `entrada.jpg`, `sala.jpg`, `cocina.jpg`, `alcoba-principal.jpg`, `bano-principal.jpg`, `balcon.jpg`
- [ ] Calibrar hotspots (pitch/yaw) usando `?debug=1`
- [ ] Recibir y colocar plano Tipo A en `floor-plans/`
- [ ] Medir coordenadas dotX/dotY del floor plan sobre el plano real
- [ ] Actualizar el checklist del estado en este README

### Galería de renders (pendiente cliente)
- [ ] Recibir renders de zonas comunes (gimnasio, piscina, lobby, etc.)
- [ ] Colocar en `images/renders/`
- [ ] Descomentar y completar el array `gallery` en `tour.config.ts`

### Planta Tipo A (pendiente cliente)
- [ ] Recibir plano limpio del Tipo A
- [ ] Colocar en `floor-plans/`
- [ ] Descomentar la entrada del Tipo A en el array `plantas` de `tour.config.ts`

### SEO / Metadata
- [ ] Actualizar dirección real en `metadata.ts` (schema.address)
- [ ] Colocar imagen exterior en `images/exterior/building.jpg` para OG preview

### Listo
- [x] 7 panoramas Tipo B entregados y funcionando
- [x] Modo VR A-Frame (public/vr.html) para Meta Quest — 7 escenas con hotspots
- [x] Plano Tipo B con coordenadas calibradas
- [x] Logos de Melendez y Valle Alto en branding/
- [x] Hotspots Tipo B calibrados con pitch/yaw reales
- [x] Variantes de escena (Espacio Multiple como alcoba o como estudio)
- [x] Animaciones de reproducción (playbackAnimations) en todas las escenas Tipo B
- [x] Selector muestra Tipo A como "Próximamente" mientras no tenga panoramas
- [x] Enlace VR contextual: pasa ?scene= según la escena activa
