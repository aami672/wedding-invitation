Add-Type -AssemblyName System.Drawing

function Find-BestCrop($origPath, $momentPath, $outPath, $targetMaxDim = 1600) {
    $orig = [System.Drawing.Image]::FromFile($origPath)
    $moment = [System.Drawing.Image]::FromFile($momentPath)

    # 1. Downscale both for fast template matching
    $matchWidth = 100
    $matchHeight = [math]::Round(100 * $moment.Height / $moment.Width)

    $mBmp = New-Object System.Drawing.Bitmap($matchWidth, $matchHeight)
    $mg = [System.Drawing.Graphics]::FromImage($mBmp)
    $mg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::Bilinear
    $mg.DrawImage($moment, 0, 0, $matchWidth, $matchHeight)
    $mg.Dispose()

    # Downscale orig to match scale (e.g. height 150 or width 200)
    $oScale = 200 / $orig.Width
    $oSmallW = 200
    $oSmallH = [math]::Round($orig.Height * $oScale)

    $oBmp = New-Object System.Drawing.Bitmap($oSmallW, $oSmallH)
    $og = [System.Drawing.Graphics]::FromImage($oBmp)
    $og.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::Bilinear
    $og.DrawImage($orig, 0, 0, $oSmallW, $oSmallH)
    $og.Dispose()

    # Search for best (x, y, scale)
    $bestDiff = [double]::MaxValue
    $bestX = 0
    $bestY = 0
    $bestW = $oSmallW
    $bestH = $oSmallH

    # Test scale factors around the aspect ratio
    $aspect = $moment.Width / $moment.Height
    
    # Try scales from 0.4 to 1.0 of the small orig
    for ($scale = 0.4; $scale -le 1.01; $scale += 0.05) {
        $curW = [math]::Round($oSmallW * $scale)
        $curH = [math]::Round($curW / $aspect)
        if ($curW -gt $oSmallW -or $curH -gt $oSmallH -or $curW -lt 30 -or $curH -lt 30) { continue }

        $step = 3
        for ($x = 0; $x -le ($oSmallW - $curW); $x += $step) {
            for ($y = 0; $y -le ($oSmallH - $curH); $y += $step) {
                # Compare sample of 10x10 points
                $diff = 0
                for ($sy = 0; $sy -lt 10; $sy++) {
                    for ($sx = 0; $sx -lt 10; $sx++) {
                        $mx = [int]($sx * ($matchWidth - 1) / 9)
                        $my = [int]($sy * ($matchHeight - 1) / 9)
                        $mc = $mBmp.GetPixel($mx, $my)

                        $ox = [int]($x + $sx * ($curW - 1) / 9)
                        $oy = [int]($y + $sy * ($curH - 1) / 9)
                        $oc = $oBmp.GetPixel($ox, $oy)

                        $d = [math]::Abs([int]$mc.R - [int]$oc.R) + [math]::Abs([int]$mc.G - [int]$oc.G) + [math]::Abs([int]$mc.B - [int]$oc.B)
                        $diff += $d
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

    # Map best (x, y, w, h) back to original full coordinates
    $fullFactor = $orig.Width / $oSmallW
    $cropX = [int][math]::Max(0, [math]::Round($bestX * $fullFactor))
    $cropY = [int][math]::Max(0, [math]::Round($bestY * $fullFactor))
    $cropW = [int][math]::Min($orig.Width - $cropX, [math]::Round($bestW * $fullFactor))
    $cropH = [int][math]::Min($orig.Height - $cropY, [math]::Round($bestH * $fullFactor))

    Write-Host "Matched with diff $bestDiff. Crop in orig: X=$cropX, Y=$cropY, W=$cropW, H=$cropH (Orig: $($orig.Width)x$($orig.Height))"

    # Destination dimensions: max $targetMaxDim
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
    $destG.DrawImage($orig, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $destG.Dispose()
    $orig.Dispose()
    $moment.Dispose()

    # Save as high-quality JPEG (92%)
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)

    $destBmp.Save($outPath, $encoder, $encParams)
    $destBmp.Dispose()

    $finalItem = Get-Item $outPath
    Write-Host "Saved high-res ${outPath}: ${outW} x ${outH} ($([math]::Round($finalItem.Length/1024)) KB)"
}

$origDir = "$HOME\Downloads\Wedding\bride"
Find-BestCrop "$origDir\F4 (141).JPG" "public\images\gallery\moment_3.jpg" "public\images\gallery\moment_3_hd.jpg" 1600
