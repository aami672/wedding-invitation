Add-Type -AssemblyName System.Drawing

function Get-ImageHash($path) {
    try {
        $img = [System.Drawing.Image]::FromFile($path)
        $bmp = New-Object System.Drawing.Bitmap(16, 16)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::Bilinear
        $g.DrawImage($img, 0, 0, 16, 16)
        $g.Dispose()
        $img.Dispose()

        $bytes = New-Object byte[] 256
        $idx = 0
        for ($y = 0; $y -lt 16; $y++) {
            for ($x = 0; $x -lt 16; $x++) {
                $c = $bmp.GetPixel($x, $y)
                # grayscale luminance
                $gray = [byte](0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B)
                $bytes[$idx++] = $gray
            }
        }
        $bmp.Dispose()
        return $bytes
    } catch {
        return $null
    }
}

function Get-HashDistance($h1, $h2) {
    if ($null -eq $h1 -or $null -eq $h2) { return 999999 }
    $diff = 0
    for ($i = 0; $i -lt 256; $i++) {
        $d = [math]::Abs([int]$h1[$i] - [int]$h2[$i])
        $diff += $d
    }
    return $diff
}

$origDir = "$HOME\Downloads\Wedding\bride"
$galleryDir = "public\images\gallery"

$origFiles = Get-ChildItem "$origDir\*.jpg"
$origHashes = @{}
foreach ($f in $origFiles) {
    $origHashes[$f.Name] = Get-ImageHash $f.FullName
}

Write-Host "Computed $($origHashes.Count) original hashes."

$galleryFiles = Get-ChildItem "$galleryDir\*.jpg"
foreach ($gf in $galleryFiles) {
    $gHash = Get-ImageHash $gf.FullName
    $bestMatch = ""
    $bestDist = 999999
    foreach ($origName in $origHashes.Keys) {
        $dist = Get-HashDistance $gHash $origHashes[$origName]
        if ($dist -lt $bestDist) {
            $bestDist = $dist
            $bestMatch = $origName
        }
    }
    Write-Host "$($gf.Name) -> $bestMatch (dist: $bestDist)"
}

# Also test groom and bride
foreach ($couplePhoto in @("public\images\ashish_groom.jpg", "public\images\preeti_bride.jpg")) {
    $cHash = Get-ImageHash $couplePhoto
    $bestMatch = ""
    $bestDist = 999999
    foreach ($origName in $origHashes.Keys) {
        $dist = Get-HashDistance $cHash $origHashes[$origName]
        if ($dist -lt $bestDist) {
            $bestDist = $dist
            $bestMatch = $origName
        }
    }
    Write-Host "$couplePhoto -> $bestMatch (dist: $bestDist)"
}
