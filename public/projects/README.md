# public/projects/ — Assets de Proyectos MIESGROUP

Esta carpeta contiene todos los assets estaticos (imagenes, logos, planos)
de los proyectos de recorrido virtual producidos por MIESGROUP.

## Estructura de carpetas

```
public/projects/
├── _template/                      Carpeta de referencia para proyectos nuevos
│   ├── branding/                   Logos placeholder
│   └── panoramas/
│       └── edificio-a/
│           └── unidad-01/          Panoramas 360 placeholder
│
└── <constructora>/                 Una carpeta por cada constructora cliente
    ├── branding/                   Logos de la constructora (compartidos)
    └── <proyecto>/                 Una carpeta por cada proyecto
        ├── panoramas/
        │   └── <edificio>/
        │       ├── <unidad>/       Imagenes 360 equirectangulares
        │       └── areas-comunes/  Zonas compartidas del edificio
        ├── images/
        │   ├── exterior/           Foto o render exterior del edificio
        │   └── renders/            Renders interiores para thumbnails
        └── floor-plans/            Planos originales del arquitecto (PDF/PNG)
```

## Proyectos activos

| Constructora          | Proyecto    | Carpeta                           | Estado      |
|-----------------------|-------------|-----------------------------------|-------------|
| Constructora Melendez | Valle Alto  | melendez/valle-alto/              | En progreso |

## Convenciones de nomenclatura

- Todos los nombres de carpetas: minusculas, guiones, sin acentos, sin espacios
- Constructora:  nombre-corto (melendez, ospinas, amarilo, cusezar)
- Proyecto:      nombre-url-friendly (valle-alto, san-pablo, reserva-norte)
- Archivos:      nombre-escena.jpg (sala.jpg, alcoba-principal.jpg)

## Como agregar un proyecto nuevo

1. Copia _template/ → public/projects/<constructora>/<proyecto>/
2. Copia src/projects/_template/ → src/projects/<constructora>/<proyecto>/
3. Coloca los assets (logos, panoramas, planos) en la estructura copiada
4. Completa tour.config.ts con los datos reales
5. Activa el proyecto en src/lib/tour-store.ts cambiando el import del config
