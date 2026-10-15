Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes

$root = [System.Windows.Automation.AutomationElement]::RootElement
$condition = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Window)
$windows = $root.FindAll([System.Windows.Automation.TreeScope]::Children, $condition)

foreach ($win in $windows) {
    $name = $win.Current.Name
    $pId = $win.Current.ProcessId
    if ($name -like '*Chrome*' -or $name -like '*Play Console*' -or $name -like '*Neon Space*' -or $name -like '*Prepare release*') {
        Write-Output "Window: PID=$pId Name='$name'"
    }
}
