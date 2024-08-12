$ErrorActionPreference = "Stop"

$filePath = "node_modules\@mui\material\Box\Box.js"
$line1 = "const defaultTheme = createTheme();"
$line2 = "defaultTheme,"

if (Test-Path $filePath) {
    $content = Get-Content $filePath
    $updatedContent = @()
    $updated = $false

    foreach ($line in $content) {
        if ($line.Trim() -eq $line1 -and $line.TrimStart() -notlike "//*") {
            $updatedContent += "// $line"
            Write-Host "Commented line: $line1"
            $updated = $true
        } elseif ($line.Trim() -eq $line2 -and $line.TrimStart() -notlike "//*") {
            $updatedContent += "// $line"
            Write-Host "Commented line: $line2"
            $updated = $true
        } else {
            $updatedContent += $line
        }
    }

    if ($updated) {
        $updatedContent | Set-Content -Path $filePath -Force
    } else {
        Write-Host "No changes made."
    }
} else {
    Write-Error "File $filePath does not exist."
    exit 1
}

