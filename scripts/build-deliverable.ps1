# Compila el ENTREGABLE (ZIP estático PORTABLE) para publicar en CUALQUIER
# subcarpeta del servidor, con el nombre que se quiera.
#
#   powershell -ExecutionPolicy Bypass -File scripts\build-deliverable.ps1
#
# Usa el modo portable de Next: basePath "" + assetPrefix "./" (rutas
# relativas NATIVAS, sin post-procesar el HTML). NO usar el enfoque de
# reescribir /_next/ a mano: corrompe la hidratación de Turbopack y el splash
# queda pegado (pantalla negra). Verificado con Playwright en subcarpeta.
#
# Recuerde colocar  out\LEEME - Instrucciones.txt  antes de empaquetar (o
# dejar que este script conserve el que ya exista tras el build... el build
# regenera out/, así que el LEEME se agrega después).
param(
  [string]$Dest = "C:\Users\PCMIESDEV\Desktop\valle-alto-tour360.zip"
)
Set-Location (Split-Path $PSScriptRoot -Parent)

$env:NEXT_PUBLIC_BASE_PATH = $null
$env:NEXT_PUBLIC_PORTABLE_BUILD = "1"
$env:NEXT_TELEMETRY_DISABLED = "1"

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force out, .next -ErrorAction SilentlyContinue

Write-Output "Compilando build PORTABLE (assetPrefix ./) ..."
bun run build
if (-not (Test-Path "out\index.html")) { Write-Error "Build falló"; exit 1 }

Write-Output "Coloque out\LEEME - Instrucciones.txt y luego empaquete con:"
Write-Output "  powershell -File scripts\package-zip.ps1 -Dest `"$Dest`""
