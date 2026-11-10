Add-Type -AssemblyName System.Drawing

$origDir = "$HOME\Downloads\Wedding\bride"
$galleryDir = "public\images\gallery"

$origFiles = Get-ChildItem "$origDir\*.jpg"
$origList = @()
foreach ($f in $origFiles) {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $origList += [PSCustomObject]@{
        Name = $f.Name
        FullName = $f.FullName
        Width = $img.Width
        Height = $img.Height
        Aspect = [math]::Round($img.Width / $img.Height, 3)
    }
    $img.Dispose()
}

function Get-ThumbnailHash($path) {
    $img = [System.Drawing.Image]::FromFile($path)
    $bmp = New-Object System.Drawing.Bitmap(32, 32)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, 32, 32)
    $g.Dispose()
    $img.Dispose()

    $bytes = New-Object byte[] 1024
    $idx = 0
    for ($y = 0; $y -lt 32; $y++) {
        for ($x = 0; $x -lt 32; $x++) {
            $c = $bmp.GetPixel($x, $y)
            $bytes[$idx++] = [byte](0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B)
        }
    }
    $bmp.Dispose()
    return $bytes
}

$origHashes = @{}
foreach ($o in $origList) {
    $origHashes[$o.Name] = Get-ThumbnailHash $o.FullName
}

1..14 | ForEach-Object {
    $mName = "moment_$_.jpg"
    $mPath = Join-Path $galleryDir $mName
    if (Test-Path $mPath) {
        $mImg = [System.Drawing.Image]::FromFile((Resolve-Path $mPath))
        $mAspect = [math]::Round($mImg.Width / $mImg.Height, 3)
        $mImg.Dispose()

        $mHash = Get-ThumbnailHash (Resolve-Path $mPath)
        
        # Sort candidates by hash difference
        $scores = @()
        foreach ($o in $origList) {
            $diff = 0
            $oH = $origHashes[$o.Name]
            for ($i = 0; $i -lt 1024; $i++) {
                $diff += [math]::Abs([int]$mHash[$i] - [int]$oH[$i])
            }
            $scores += [PSCustomObject]@{
                Orig = $o.Name
                Diff = $diff
                OAspect = $o.Aspect
                MAspect = $mAspect
            }
        }
        $best = ($scores | Sort-Object Diff)[0]
        $second = ($scores | Sort-Object Diff)[1]
        Write-Host "$mName (asp: $mAspect) -> BEST: $($best.Orig) (diff: $($best.Diff), asp: $($best.OAspect)) | 2nd: $($second.Orig) (diff: $($second.Diff))"
    }
}

foreach ($couplePhoto in @("public\images\ashish_groom.jpg", "public\images\preeti_bride.jpg")) {
    $mHash = Get-ThumbnailHash (Resolve-Path $couplePhoto)
    $scores = @()
    foreach ($o in $origList) {
        $diff = 0
        $oH = $origHashes[$o.Name]
        for ($i = 0; $i -lt 1024; $i++) {
            $diff += [math]::Abs([int]$mHash[$i] - [int]$oH[$i])
        }
        $scores += [PSCustomObject]@{
            Orig = $o.Name
            Diff = $diff
        }
    }
    $best = ($scores | Sort-Object Diff)[0]
    Write-Host "$couplePhoto -> BEST: $($best.Orig) (diff: $($best.Diff))"
}
