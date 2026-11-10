Add-Type -AssemblyName System.Drawing

$origDir = "$HOME\Downloads\Wedding\bride"
$origFiles = Get-ChildItem "$origDir\*.jpg"

Write-Host "Total original files: $($origFiles.Count)"
foreach ($f in $origFiles) {
    try {
        $img = [System.Drawing.Image]::FromFile($f.FullName)
        Write-Host "$($f.Name) : $([math]::Round($f.Length/1024)) KB ($($img.Width) x $($img.Height))"
        $img.Dispose()
    } catch {
        Write-Host "$($f.Name) : error loading"
    }
}
