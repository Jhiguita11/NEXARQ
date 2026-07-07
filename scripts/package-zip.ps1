# Empaqueta out/ en un .zip con separadores "/" (compatible Linux) e incluye
# archivos ocultos (.htaccess, .nojekyll). Uso:
#   powershell -File scripts/package-zip.ps1 -Dest "C:\ruta\salida.zip"
param(
  [string]$Dest = "C:\Users\PCMIESDEV\Desktop\valle-alto-tour360.zip",
  [string]$Src  = "out"
)
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$slash = [char]0x2F   # '/'
$back  = [char]0x5C   # '\'

if (Test-Path $Dest) { Remove-Item $Dest -Force }
$srcRoot = (Resolve-Path $Src).Path
$fsOut = [System.IO.File]::Open($Dest, [System.IO.FileMode]::Create)
$arch  = New-Object System.IO.Compression.ZipArchive($fsOut, [System.IO.Compression.ZipArchiveMode]::Create)
$n = 0
Get-ChildItem -Path $Src -Recurse -File -Force | ForEach-Object {
  $rel = $_.FullName.Substring($srcRoot.Length + 1).Replace($back, $slash)
  [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($arch, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal)
  $n++
}
$arch.Dispose(); $fsOut.Dispose()
Write-Output "Archivos agregados: $n"

# Verificacion
$z = [System.IO.Compression.ZipFile]::OpenRead($Dest)
$bs = ($z.Entries | Where-Object { $_.FullName.Contains($back) }).Count
$ht = [bool]($z.Entries | Where-Object { $_.FullName -eq '.htaccess' })
$as = ($z.Entries | Where-Object { $_.FullName -like 'assets/*' }).Count
$pn = [bool]($z.Entries | Where-Object { $_.FullName -eq 'vendor/pannellum/pannellum.js' })
$nx = ($z.Entries | Where-Object { $_.FullName -like '_next/*' }).Count
$idx = [bool]($z.Entries | Where-Object { $_.FullName -eq 'index.html' })
$z.Dispose()
$f = Get-Item $Dest
Write-Output ("ZIP: {0:N1} MB | backslash:{1} | index.html:{2} | .htaccess:{3} | assets/*:{4} | pannellum:{5} | _next restante:{6}" -f ($f.Length/1MB), $bs, $idx, $ht, $as, $pn, $nx)
