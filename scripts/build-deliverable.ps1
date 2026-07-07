# Compila el ENTREGABLE (ZIP estático) para publicar en una subcarpeta fija.
#
#   powershell -ExecutionPolicy Bypass -File scripts\build-deliverable.ps1 -Folder vallealtorecorridovr
#
# Usa basePath = /<Folder> (rutas absolutas correctas para esa subcarpeta).
# NOTA: el enfoque "portable con rutas relativas" NO funciona con Turbopack
# (rompe la hidratacion -> el splash se queda pegado -> pantalla negra), por
# eso se compila con basePath fijo. La carpeta en el servidor DEBE llamarse
# igual que -Folder.
param(
  [string]$Folder = "vallealtorecorridovr",
  [string]$Dest = "C:\Users\PCMIESDEV\Desktop\valle-alto-tour360.zip"
)
Set-Location (Split-Path $PSScriptRoot -Parent)

$env:NEXT_PUBLIC_RELATIVE = $null
$env:NEXT_PUBLIC_BASE_PATH = "/$Folder"
$env:NEXT_TELEMETRY_DISABLED = "1"

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force out, .next -ErrorAction SilentlyContinue

Write-Output "Compilando para /$Folder ..."
bun run build
if (-not (Test-Path "out\index.html")) { Write-Error "Build falló"; exit 1 }

# (El archivo out\LEEME - Instrucciones.txt se coloca manualmente antes de empaquetar.)
powershell -ExecutionPolicy Bypass -File "$PSScriptRoot\package-zip.ps1" -Dest $Dest
Write-Output "Listo. Recuerde: la carpeta en el servidor debe llamarse '$Folder'."
