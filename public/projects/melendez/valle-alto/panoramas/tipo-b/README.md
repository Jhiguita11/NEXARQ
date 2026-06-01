# Panoramas — Valle Alto / Apartamento Tipo B

Coloca aqui las imagenes equirectangulares 360 del Apartamento Tipo B.

Este tour corresponde al modelo de menor area del proyecto Valle Alto (Constructora Melendez).

## Especificaciones tecnicas

- Formato: JPG (preferido por tamano) o PNG/WebP
- Relacion de aspecto: 2:1 (ejemplo: 6000x3000 px)
- Resolucion minima recomendada: 4096x2048 px
- Peso maximo recomendado por imagen: 8 MB (optimiza con JPG quality 85)

## Nomenclatura de archivos

Usa nombres en minusculas con guiones, sin espacios ni acentos:

| Escena             | Nombre de archivo        |
|--------------------|--------------------------|
| Hall / Entrada     | entrada.jpg              |
| Sala / Living      | sala.jpg                 |
| Cocina             | cocina.jpg               |
| Alcoba principal   | alcoba-principal.jpg     |
| Bano principal     | bano-principal.jpg       |
| Balcon / Terraza   | balcon.jpg               |
| Alcoba auxiliar    | alcoba-auxiliar.jpg      |
| Bano social        | bano-social.jpg          |
| Zona de ropas      | zona-ropas.jpg           |

## Siguiente paso

Una vez colocadas las imagenes, verificar que las rutas en tour.config.ts coincidan:
  src/projects/melendez/valle-alto/tour.config.ts

La funcion PANO() de tipo-b usa el prefijo:
  /projects/melendez/valle-alto/panoramas/tipo-b/
