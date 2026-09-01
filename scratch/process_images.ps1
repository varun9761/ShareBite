Add-Type -AssemblyName System.Drawing

$favPath = "C:\Users\varun\.gemini\antigravity\brain\4ccaf03e-f883-447d-a353-df50594549db\.user_uploaded\media_1787984952143.jpg"
$logoPath = "C:\Users\varun\.gemini\antigravity\brain\4ccaf03e-f883-447d-a353-df50594549db\.user_uploaded\media_1787985001568.png"

$fav = [System.Drawing.Bitmap]::FromFile($favPath)
Write-Host "Favicon dimensions: $($fav.Width) x $($fav.Height)"

# Save full favicon as PNG in client/public and client/src/assets
$clientPublic = "C:\Users\varun\OneDrive\Desktop\ShareBite\client\public"
$clientAssets = "C:\Users\varun\OneDrive\Desktop\ShareBite\client\src\assets"

if (!(Test-Path $clientPublic)) { New-Item -ItemType Directory -Path $clientPublic -Force }
if (!(Test-Path $clientAssets)) { New-Item -ItemType Directory -Path $clientAssets -Force }

# Make a clean circular favicon or high-res icon
$fav.Save("$clientPublic\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav.Save("$clientAssets\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav.Dispose()

$logoSheet = [System.Drawing.Bitmap]::FromFile($logoPath)
Write-Host "Logo sheet dimensions: $($logoSheet.Width) x $($logoSheet.Height)"

# Let's crop individual logos:
# Logo 1: Top-Left Badge (x: 20, y: 20, w: 260, h: 300)
# Logo 2: Top-Middle Horizontal (x: 290, y: 35, w: 440, h: 260)
# Logo 3: Bottom-Middle Typographic (x: 310, y: 360, w: 400, h: 280)
# Logo 4: Bottom-Left App Icon (x: 25, y: 350, w: 255, h: 300)

function CropAndSave($bmp, $rect, $outPath) {
    $cropBmp = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
    $g = [System.Drawing.Graphics]::FromImage($cropBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $srcRect = New-Object System.Drawing.Rectangle($rect.X, $rect.Y, $rect.Width, $rect.Height)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $rect.Width, $rect.Height)
    $g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $cropBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropBmp.Dispose()
}

CropAndSave $logoSheet (New-Object System.Drawing.Rectangle(290, 40, 440, 240)) "$clientPublic\logo-horizontal.png"
CropAndSave $logoSheet (New-Object System.Drawing.Rectangle(290, 40, 440, 240)) "$clientAssets\logo-horizontal.png"

CropAndSave $logoSheet (New-Object System.Drawing.Rectangle(25, 20, 250, 290)) "$clientPublic\logo-badge.png"
CropAndSave $logoSheet (New-Object System.Drawing.Rectangle(25, 20, 250, 290)) "$clientAssets\logo-badge.png"

CropAndSave $logoSheet (New-Object System.Drawing.Rectangle(310, 360, 400, 260)) "$clientPublic\logo-cursive.png"
CropAndSave $logoSheet (New-Object System.Drawing.Rectangle(310, 360, 400, 260)) "$clientAssets\logo-cursive.png"

CropAndSave $logoSheet (New-Object System.Drawing.Rectangle(25, 345, 255, 290)) "$clientPublic\logo-icon.png"
CropAndSave $logoSheet (New-Object System.Drawing.Rectangle(25, 345, 255, 290)) "$clientAssets\logo-icon.png"

$logoSheet.Dispose()
Write-Host "All logo variations cropped and saved successfully!"
