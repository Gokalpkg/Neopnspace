Add-Type @'
using System;
using System.Net;
using System.Runtime.InteropServices;

public class TcpKiller {
    [StructLayout(LayoutKind.Sequential)]
    public struct MIB_TCPROW {
        public uint dwState;
        public uint dwLocalAddr;
        public uint dwLocalPort;
        public uint dwRemoteAddr;
        public uint dwRemotePort;
    }

    [DllImport("iphlpapi.dll", SetLastError = true)]
    public static extern uint SetTcpEntry(ref MIB_TCPROW pTcpRow);

    public static uint CloseConnection(string localIp, int localPort, string remoteIp, int remotePort) {
        MIB_TCPROW row = new MIB_TCPROW();
        row.dwState = 12; // MIB_TCP_STATE_DELETE_TCB
        row.dwLocalAddr = BitConverter.ToUInt32(IPAddress.Parse(localIp).GetAddressBytes(), 0);
        row.dwLocalPort = (uint)IPAddress.HostToNetworkOrder((short)localPort) & 0xFFFF;
        row.dwRemoteAddr = BitConverter.ToUInt32(IPAddress.Parse(remoteIp).GetAddressBytes(), 0);
        row.dwRemotePort = (uint)IPAddress.HostToNetworkOrder((short)remotePort) & 0xFFFF;
        return SetTcpEntry(ref row);
    }
}
'@

$conn = Get-NetTCPConnection -RemotePort 57337 -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -eq 25248 }
if ($conn) {
    Write-Output "Found connection: $($conn.LocalPort) -> $($conn.RemotePort)"
    $res = [TcpKiller]::CloseConnection($conn.LocalAddress, $conn.LocalPort, $conn.RemoteAddress, $conn.RemotePort)
    Write-Output "SetTcpEntry result code: $res"
} else {
    Write-Output "No connection found from PID 25248 to 57337"
}
