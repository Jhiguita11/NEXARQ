# Panoramas — [Edificio A] / [Unidad 01]

Carpeta placeholder para imagenes 360 de una unidad.

## Convenio de nomenclatura de carpetas

### Un solo tour por proyecto
```
public/projects/<constructora>/<proyecto>/panoramas/<edificio>/<unidad>/
```

Ejemplos:
```
public/projects/ospinas/san-pablo/panoramas/bloque-1/casa-01/
public/projects/amarilo/reserva/panoramas/torre-norte/apto-501/
```

### Multiples tours por proyecto (tipologias de apartamento)

Cuando un proyecto tiene varias tipologias de apartamento, cada tipologia
recibe su propia carpeta directamente bajo panoramas/:
```
public/projects/<constructora>/<proyecto>/panoramas/<tipo>/
```

Ejemplos:
```
public/projects/melendez/valle-alto/panoramas/tipo-a/
public/projects/melendez/valle-alto/panoramas/tipo-b/
public/projects/ospinas/san-pablo/panoramas/tipo-studio/
public/projects/ospinas/san-pablo/panoramas/tipo-2hab/
```

En tour.config.ts, cada tipologia tiene su propia constante PANO y su propio
export de TourConfig:
```typescript
const PANO_A = (path: string) => assetPath(`/projects/.../panoramas/tipo-a/${path}`);
const PANO_B = (path: string) => assetPath(`/projects/.../panoramas/tipo-b/${path}`);

export const tourTipoA: TourConfig = { ... };
export const tourTipoB: TourConfig = { ... };
export default tourTipoA;
```

## Convenio de nomenclatura de archivos de panorama

```
sala.jpg
cocina.jpg
entrada.jpg
alcoba-principal.jpg
alcoba-auxiliar.jpg
bano-principal.jpg
bano-social.jpg
balcon.jpg
terraza.jpg
lobby.jpg
salon-social.jpg
piscina.jpg
```

Regla: minusculas, guiones, sin acentos, sin espacios.
