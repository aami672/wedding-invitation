Add-Type -AssemblyName System.Drawing

$projectDir = "$HOME\.gemini\antigravity\scratch\wishlys-free"
$origDir = "$HOME\Downloads\Wedding\bride"
$galleryDir = "$projectDir\public\images\gallery"

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" } | Select-Object -First 1
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)

$mapping = [ordered]@{
    "moment_1.jpg"  = "F4 (63).JPG"
    "moment_2.jpg"  = "f5 (60).JPG"
    "moment_3.jpg"  = "F4 (141).JPG"
    "moment_4.jpg"  = "F4 (17).JPG"
    "moment_5.jpg"  = "f5 (58).JPG"
    "moment_6.jpg"  = "F2 (71).JPG"
    "moment_7.jpg"  = "F3 (92).JPG"
    "moment_8.jpg"  = "F4 (118).JPG"
    "moment_9.jpg"  = "f5 (125).JPG"
    "moment_10.jpg" = "F1 (65).JPG"
    "moment_11.jpg" = "f5 (100).JPG"
    "moment_12.jpg" = "F3 (116).JPG"
    "moment_13.jpg" = "F4 (106).JPG"
    "moment_14.jpg" = "F1 (65).JPG"
}

function Crop-And-Save($origPath, $momentPath, $outPath, $targetMaxDim = 1600) {
    if (-not (Test-Path $momentPath)) {
        Write-Warning "Moment path not found: $momentPath"
        return
    }
    if (-not (Test-Path $origPath)) {
        Write-Warning "Orig path not found: $origPath"
        return
    }

    $momentBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $momentPath))
    $momentStream = New-Object System.IO.MemoryStream(,$momentBytes)
    $moment = [System.Drawing.Image]::FromStream($momentStream)

    $origBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $origPath))
    $origStream = New-Object System.IO.MemoryStream(,$origBytes)
    $orig = [System.Drawing.Image]::FromStream($origStream)

    $aspect = [double]$moment.Width / [double]$moment.Height

    # Fast downscale for matching
    $matchW = 60
    $matchH = [math]::Max(20, [int][math]::Round(60.0 / $aspect))

    $mBmp = New-Object System.Drawing.Bitmap $matchW, $matchH
    $mg = [System.Drawing.Graphics]::FromImage($mBmp)
    $mg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::Bilinear
    $mg.DrawImage($moment, 0, 0, $matchW, $matchH)
    $mg.Dispose()

    $oSmallW = 120
    $oSmallH = [int][math]::Round([double]$orig.Height * 120.0 / [double]$orig.Width)
    $oBmp = New-Object System.Drawing.Bitmap $oSmallW, $oSmallH
    $og = [System.Drawing.Graphics]::FromImage($oBmp)
    $og.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::Bilinear
    $og.DrawImage($orig, 0, 0, $oSmallW, $oSmallH)
    $og.Dispose()

    $bestDiff = [double]::MaxValue
    $bestX = 0
    $bestY = 0
    $bestW = 0
    $bestH = 0

    for ($scale = 0.4; $scale -le 1.01; $scale += 0.08) {
        $curW = [int][math]::Round($oSmallW * $scale)
        $curH = [int][math]::Round([double]$curW / $aspect)
        if ($curW -gt $oSmallW -or $curH -gt $oSmallH -or $curW -lt 20 -or $curH -lt 20) { continue }

        $step = [math]::Max(3, [int][math]::Round($curW / 12.0))
        for ($x = 0; $x -le ($oSmallW - $curW); $x += $step) {
            for ($y = 0; $y -le ($oSmallH - $curH); $y += $step) {
                $diff = 0
                for ($sy = 0; $sy -lt 6; $sy++) {
                    for ($sx = 0; $sx -lt 6; $sx++) {
                        $mx = [int]($sx * ($matchW - 1) / 5)
                        $my = [int]($sy * ($matchH - 1) / 5)
                        $mc = $mBmp.GetPixel($mx, $my)

                        $ox = [int]($x + $sx * ($curW - 1) / 5)
                        $oy = [int]($y + $sy * ($curH - 1) / 5)
                        $oc = $oBmp.GetPixel($ox, $oy)

                        $diff += [math]::Abs([int]$mc.R - [int]$oc.R) + [math]::Abs([int]$mc.G - [int]$oc.G) + [math]::Abs([int]$mc.B - [int]$oc.B)
                    }
                }
                if ($diff -lt $bestDiff) {
                    $bestDiff = $diff
                    $bestX = $x
                    $bestY = $y
                    $bestW = $curW
                    $bestH = $curH
                }
            }
        }
    }

    $mBmp.Dispose()
    $oBmp.Dispose()

    # If match found, scale back to full coords; otherwise center-crop
    if ($bestW -gt 0 -and $bestH -gt 0) {
        $fullFactor = [double]$orig.Width / 120.0
        $cropX = [int][math]::Max(0, [math]::Round($bestX * $fullFactor))
        $cropY = [int][math]::Max(0, [math]::Round($bestY * $fullFactor))
        $cropW = [int][math]::Min($orig.Width - $cropX, [math]::Round($bestW * $fullFactor))
        $cropH = [int][math]::Min($orig.Height - $cropY, [math]::Round($bestH * $fullFactor))
    } else {
        $origAspect = [double]$orig.Width / [double]$orig.Height
        if ($aspect -gt $origAspect) {
            $cropW = $orig.Width
            $cropH = [int][math]::Round([double]$cropW / $aspect)
            $cropX = 0
            $cropY = [int][math]::Round(([double]$orig.Height - $cropH) / 2.0)
        } else {
            $cropH = $orig.Height
            $cropW = [int][math]::Round([double]$cropH * $aspect)
            $cropY = 0
            $cropX = [int][math]::Round(([double]$orig.Width - $cropW) / 2.0)
        }
    }

    if ($cropW -le 0) { $cropW = $orig.Width; $cropX = 0 }
    if ($cropH -le 0) { $cropH = $orig.Height; $cropY = 0 }

    $outW = $cropW
    $outH = $cropH
    if ($outW -gt $targetMaxDim -or $outH -gt $targetMaxDim) {
        if ($outW -gt $outH) {
            $outH = [int][math]::Round([double]$outH * $targetMaxDim / [double]$outW)
            $outW = $targetMaxDim
        } else {
            $outW = [int][math]::Round([double]$outW * $targetMaxDim / [double]$outH)
            $outH = $targetMaxDim
        }
    }

    $outW = [int][math]::Max(10, $outW)
    $outH = [int][math]::Max(10, $outH)

    $destBmp = New-Object System.Drawing.Bitmap $outW, $outH
    $destG = [System.Drawing.Graphics]::FromImage($destBmp)
    $destG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $destG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $destG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $destG.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
    $destRect = New-Object System.Drawing.Rectangle 0, 0, $outW, $outH
    $destG.DrawImage($orig, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $destG.Dispose()

    $moment.Dispose()
    $momentStream.Dispose()
    $orig.Dispose()
    $origStream.Dispose()

    $tempOut = "$outPath.tmp.jpg"
    $destBmp.Save($tempOut, $encoder, $encParams)
    $destBmp.Dispose()

    Move-Item -Force $tempOut $outPath

    $fi = Get-Item $outPath
    $origFileName = Split-Path -Leaf $origPath
    Write-Host "Maximized $(Split-Path -Leaf $outPath) from $origFileName -> ${outW}x${outH} ($([math]::Round($fi.Length/1024)) KB)"
}

# Process each moment
foreach ($mFile in $mapping.Keys) {
    $mPath = Join-Path $galleryDir $mFile
    $candName = $mapping[$mFile]
    $origPath = Join-Path $origDir $candName
    Crop-And-Save $origPath $mPath $mPath 1600
}

# Process Groom & Bride
Crop-And-Save "$origDir\F4 (91).JPG" "$projectDir\public\images\ashish_groom.jpg" "$projectDir\public\images\ashish_groom.jpg" 1200
Crop-And-Save "$origDir\F2 (71).JPG" "$projectDir\public\images\preeti_bride.jpg" "$projectDir\public\images\preeti_bride.jpg" 1200

Write-Host "ALL PHOTOS MAXIMIZED TO HIGH DEFINITION!"
