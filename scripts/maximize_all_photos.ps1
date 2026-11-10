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

function Find-And-Crop($momentPath, $outPath, $candidateFiles, $targetMaxDim = 1600) {
    if (-not (Test-Path $momentPath)) { return }
    $moment = [System.Drawing.Image]::FromFile((Resolve-Path $momentPath))
    $aspect = $moment.Width / $moment.Height

    # 1. Downscale moment for fast matching
    $matchWidth = 80
    $matchHeight = [math]::Max(20, [math]::Round(80 * $moment.Height / $moment.Width))

    $mBmp = New-Object System.Drawing.Bitmap($matchWidth, $matchHeight)
    $mg = [System.Drawing.Graphics]::FromImage($mBmp)
    $mg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::Bilinear
    $mg.DrawImage($moment, 0, 0, $matchWidth, $matchHeight)
    $mg.Dispose()

    $overallBestDiff = [double]::MaxValue
    $overallBestOrig = $null
    $overallBestX = 0
    $overallBestY = 0
    $overallBestW = 0
    $overallBestH = 0

    foreach ($candName in $candidateFiles) {
        $cand = $origList | Where-Object { $_.Name -eq $candName }
        if (-not $cand) { continue }

        $orig = [System.Drawing.Image]::FromFile($cand.FullName)
        $oSmallW = 160
        $oSmallH = [math]::Round($orig.Height * 160 / $orig.Width)

        $oBmp = New-Object System.Drawing.Bitmap($oSmallW, $oSmallH)
        $og = [System.Drawing.Graphics]::FromImage($oBmp)
        $og.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::Bilinear
        $og.DrawImage($orig, 0, 0, $oSmallW, $oSmallH)
        $og.Dispose()

        for ($scale = 0.35; $scale -le 1.01; $scale += 0.05) {
            $curW = [math]::Round($oSmallW * $scale)
            $curH = [math]::Round($curW / $aspect)
            if ($curW -gt $oSmallW -or $curH -gt $oSmallH -or $curW -lt 25 -or $curH -lt 25) { continue }

            $step = [math]::Max(2, [math]::Round($curW / 20))
            for ($x = 0; $x -le ($oSmallW - $curW); $x += $step) {
                for ($y = 0; $y -le ($oSmallH - $curH); $y += $step) {
                    $diff = 0
                    for ($sy = 0; $sy -lt 8; $sy++) {
                        for ($sx = 0; $sx -lt 8; $sx++) {
                            $mx = [int]($sx * ($matchWidth - 1) / 7)
                            $my = [int]($sy * ($matchHeight - 1) / 7)
                            $mc = $mBmp.GetPixel($mx, $my)

                            $ox = [int]($x + $sx * ($curW - 1) / 7)
                            $oy = [int]($y + $sy * ($curH - 1) / 7)
                            $oc = $oBmp.GetPixel($ox, $oy)

                            $diff += [math]::Abs([int]$mc.R - [int]$oc.R) + [math]::Abs([int]$mc.G - [int]$oc.G) + [math]::Abs([int]$mc.B - [int]$oc.B)
                        }
                    }
                    if ($diff -lt $overallBestDiff) {
                        $overallBestDiff = $diff
                        $overallBestOrig = $cand
                        $overallBestX = $x
                        $overallBestY = $y
                        $overallBestW = $curW
                        $overallBestH = $curH
                    }
                }
            }
        }

        $oBmp.Dispose()
        $orig.Dispose()
    }

    $mBmp.Dispose()

    if ($null -eq $overallBestOrig) {
        Write-Warning "Could not find match for $momentPath"
        $moment.Dispose()
        return
    }

    # Open full original and perform high-quality crop
    $fullOrig = [System.Drawing.Image]::FromFile($overallBestOrig.FullName)
    $fullFactor = $fullOrig.Width / 160.0
    $cropX = [int][math]::Max(0, [math]::Round($overallBestX * $fullFactor))
    $cropY = [int][math]::Max(0, [math]::Round($overallBestY * $fullFactor))
    $cropW = [int][math]::Min($fullOrig.Width - $cropX, [math]::Round($overallBestW * $fullFactor))
    $cropH = [int][math]::Min($fullOrig.Height - $cropY, [math]::Round($overallBestH * $fullFactor))

    $outW = $cropW
    $outH = $cropH
    if ($outW -gt $targetMaxDim -or $outH -gt $targetMaxDim) {
        if ($outW -gt $outH) {
            $outH = [math]::Round($outH * $targetMaxDim / $outW)
            $outW = $targetMaxDim
        } else {
            $outW = [math]::Round($outW * $targetMaxDim / $outH)
            $outH = $targetMaxDim
        }
    }

    $destBmp = New-Object System.Drawing.Bitmap($outW, $outH)
    $destG = [System.Drawing.Graphics]::FromImage($destBmp)
    $destG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $destG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $destG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $destG.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $outW, $outH)
    $destG.DrawImage($fullOrig, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $destG.Dispose()
    $fullOrig.Dispose()
    $moment.Dispose()

    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)

    $destBmp.Save($outPath, $encoder, $encParams)
    $destBmp.Dispose()

    $fi = Get-Item $outPath
    Write-Host "Maximized ${outPath} from $($overallBestOrig.Name) -> ${outW}x${outH} ($([math]::Round($fi.Length/1024)) KB, diff=$overallBestDiff)"
}

# 1. Moments Mapping
$allOrigNames = $origList | ForEach-Object { $_.Name }

1..14 | ForEach-Object {
    $mName = "moment_$_.jpg"
    $mPath = Join-Path $galleryDir $mName
    Find-And-Crop $mPath $mPath $allOrigNames 1600
}

# 2. Groom & Bride Portraits
Find-And-Crop "public\images\ashish_groom.jpg" "public\images\ashish_groom.jpg" $allOrigNames 1200
Find-And-Crop "public\images\preeti_bride.jpg" "public\images\preeti_bride.jpg" $allOrigNames 1200

Write-Host "Completed maximizing all photos!"
