Add-Type -AssemblyName System.Drawing

function MakeTransparent($srcPath, $outPath, $tolerance = 240) {
    $bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
    $w = $bmp.Width
    $h = $bmp.Height
    $outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $bmp.GetPixel($x, $y)
            # If color is near white, make it transparent
            if ($c.R -ge $tolerance -and $c.G -ge $tolerance -and $c.B -ge $tolerance) {
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
            } else {
                $outBmp.SetPixel($x, $y, $c)
            }
        }
    }
    $bmp.Dispose()
    $outBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $outBmp.Dispose()
    Write-Host "Created transparent image: $outPath"
}

# Favicon: The circular food bag has black background in the outer corners (x,y where outer circle is black).
# Let's make the black outer corners of the favicon transparent!
function MakeFaviconTransparent($srcPath, $outPath) {
    $bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
    $w = $bmp.Width
    $h = $bmp.Height
    $cx = $w / 2.0
    $cy = $h / 2.0
    $radius = ($w / 2.0) * 0.96 # circle radius

    $outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $dx = $x - $cx
            $dy = $y - $cy
            $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
            
            if ($dist -gt $radius) {
                # Outside circle -> make fully transparent
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                $c = $bmp.GetPixel($x, $y)
                # Anti-aliasing edge softening
                if ($dist -gt ($radius - 3)) {
                    $alpha = [int](255.0 * (($radius - $dist) / 3.0))
                    if ($alpha -lt 0) { $alpha = 0 }
                    if ($alpha -gt 255) { $alpha = 255 }
                    $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
                } else {
                    $outBmp.SetPixel($x, $y, $c)
                }
            }
        }
    }
    $bmp.Dispose()
    $outBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $outBmp.Dispose()
    Write-Host "Favicon circular mask with transparency created: $outPath"
}

$clientPublic = "C:\Users\varun\OneDrive\Desktop\ShareBite\client\public"
$clientAssets = "C:\Users\varun\OneDrive\Desktop\ShareBite\client\src\assets"
$favPath = "C:\Users\varun\.gemini\antigravity\brain\4ccaf03e-f883-447d-a353-df50594549db\.user_uploaded\media_1787984952143.jpg"

MakeFaviconTransparent $favPath "$clientPublic\favicon.png"
MakeFaviconTransparent $favPath "$clientAssets\favicon.png"

# Also create favicon.ico / icons
MakeTransparent "$clientPublic\logo-horizontal.png" "$clientPublic\logo-horizontal-transparent.png" 248
MakeTransparent "$clientPublic\logo-horizontal.png" "$clientAssets\logo-horizontal-transparent.png" 248

MakeTransparent "$clientPublic\logo-badge.png" "$clientPublic\logo-badge-transparent.png" 248
MakeTransparent "$clientPublic\logo-badge.png" "$clientAssets\logo-badge-transparent.png" 248

Write-Host "Transparency processing completed!"
