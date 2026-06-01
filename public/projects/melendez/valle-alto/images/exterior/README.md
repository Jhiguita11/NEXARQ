# Imagenes Exteriores — Valle Alto

Esta carpeta contiene la imagen principal del edificio que aparece como fondo
en la pantalla de seleccion de apartamentos (BuildingSelector).

## Archivo requerido

- building.jpg (o building.png / building.webp)
  Fotografia o render exterior del proyecto Valle Alto.
  Resolucion recomendada: 1920x1080 px o superior (panoramica 16:9).
  Esta imagen debe mostrar claramente la fachada del edificio con suficiente
  contexto visual para ubicar los hotspots flotantes sobre cada apartamento.

## Archivo opcional

- building-night.jpg    Version nocturna (para efecto dia/noche si se implementa)
- aerial.jpg            Vista aerea del conjunto

## Uso en el codigo

El archivo se referencia en tour.config.ts como buildingImage dentro del BuildingConfig.
Actualmente el sistema usa /public/building.png como fallback global.
Al definir un proyecto con imagen propia, la ruta debe ser:
  /projects/melendez/valle-alto/images/exterior/building.jpg
