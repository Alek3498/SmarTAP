# SmarTAP
Traffic collector probe with the following functions:

1- Collection of traffic from Span ports or TAPs

2- Capability of filtering by L2, L3 and L4

3- Ingestion of traffic trought bond ports

4- Two output ports:

    4.1- Management port (if required, tunnel port as well)
    
    4.2- Tunnel port
    
5- Traffic tunneled into a L2GRE tunnel

6- CLI with custom commands

7- Optional GUI. (I didn't do it)

8- Run on CentOS

Note:
1- the endpoint of the tunnel could be any device capable of decapsulate a L2GRE tunnel.
