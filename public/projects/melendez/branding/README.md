# Branding — Constructora Melendez

Logos y activos de marca de la Constructora Melendez.
Estos archivos son compartidos por todos los proyectos de Melendez.

## Archivos esperados

| Archivo                        | Uso                                                    |
|--------------------------------|--------------------------------------------------------|
| logo-melendez.svg              | Logo principal (vectorial, preferido)                  |
| logo-melendez.png              | Logo principal en PNG con fondo transparente           |
| logo-melendez-white.png        | Version blanca para fondos oscuros                     |
| logo-melendez-dark.png         | Version oscura para fondos claros                      |
| logo-miesgroup.svg             | Logo MIESGROUP (agencia) para co-branding              |
| logo-miesgroup.png             | Logo MIESGROUP en PNG transparente                     |
| logo-miesgroup-white.png       | Version blanca de MIESGROUP para fondos oscuros        |

## Especificaciones

- SVG: preferido, sin rasterizacion, escala perfecta a cualquier tamano
- PNG: minimo 400x200 px, fondo transparente (alpha), sin padding excesivo
- Nombres en minusculas con guiones, sin espacios

## Uso en tour.config.ts

```typescript
brand: {
  name: 'Valle Alto',
  tagline: 'Constructora Melendez',
  logo: '/projects/melendez/branding/logo-melendez-white.png',
  secondaryLogo: '/projects/melendez/branding/logo-miesgroup-white.png',
  website: 'https://www.constructoramelendez.com',
}
```

## Nota sobre co-branding

El splash screen y el badge superior muestran el logo principal (brand.logo).
El co-branding de MIESGROUP se puede mostrar en el splash screen con el campo
secondaryLogo (requiere implementacion en splash-screen.tsx).
