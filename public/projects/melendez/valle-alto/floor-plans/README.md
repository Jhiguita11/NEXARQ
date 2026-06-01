# Planos de Planta — Valle Alto

Archivos de plano de planta para el componente FloorPlan interactivo.

## Formatos aceptados

El FloorPlan del sistema se renderiza como SVG en el codigo (coordenadas x,y,width,height
definidas en tour.config.ts). No se necesita imagen aqui para el plano interactivo.

Sin embargo, los archivos originales del arquitecto deben guardarse aqui como referencia
para extraer las coordenadas correctas de cada habitacion.

## Archivos esperados

| Archivo                    | Descripcion                                           |
|----------------------------|-------------------------------------------------------|
| tipo-a-plano.pdf           | Plano original del Tipo A (del arquitecto)            |
| tipo-a-plano.png           | Version imagen del plano Tipo A para medicion visual  |
| tipo-b-plano.pdf           | Plano original del Tipo B                             |
| tipo-b-plano.png           | Version imagen del plano Tipo B para medicion visual  |

## Como usar los planos para configurar el FloorPlan

1. Abre la imagen del plano (tipo-a-plano.png o tipo-b-plano.png)
2. Identifica el ancho y alto total del plano en pixeles
3. Para cada habitacion, mide x, y (esquina superior izquierda), width y height
4. Normaliza los valores a un sistema de coordenadas de 300x200 (canvas del FloorPlan)
5. Ingresa esos valores en el campo rooms[] del floorPlan en tour.config.ts:
   - Para Tipo A: dentro de valleAltoTipoA.buildings[0].apartments[0].floorPlan.rooms
   - Para Tipo B: dentro de valleAltoTipoB.buildings[0].apartments[0].floorPlan.rooms

Consultar src/projects/melendez/valle-alto/tour.config.ts para la estructura exacta.
