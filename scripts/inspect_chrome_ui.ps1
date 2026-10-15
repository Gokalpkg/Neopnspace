Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes

$chromeProc = Get-Process chrome | Where-Object { $_.MainWindowTitle -like "*Neon Space*" -or $_.MainWindowTitle -like "*Play Console*" -or $_.MainWindowTitle -like "*Prepare release*" } | Select-Object -First 1

if (-not $chromeProc) {
    Write-Output "Looking for all Chrome processes with main windows..."
    $allWithTitle = Get-Process chrome | Where-Object { $_.MainWindowTitle.Length -gt 0 }
    foreach ($p in $allWithTitle) {
        Write-Output "PID: $($p.Id) Title: $($p.MainWindowTitle)"
    }
} else {
    Write-Output "Found Chrome window: PID $($chromeProc.Id) - $($chromeProc.MainWindowTitle)"
}
