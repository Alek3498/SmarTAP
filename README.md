# SmarTAP
### Traffic collector probe for remote harsh environments 

<img src="https://github.com/Alek3498/SmarTAP/blob/main/Despliegue-General.png" width="60%" height="60%">

Keywords: Networking / scripting / Visibility

Traffic collector probe with the following functions:

1- Collection of traffic from Span ports or TAPs

2- Ability to filter by L2, L3 and L4 layers

3- Ingestion of traffic trought bond ports

4- Two output ports:

    4.1- Management port (if required, tunnel port as well)
    
    4.2- Tunnel port
    
5- Traffic tunneled into a L2GRE tunnel

6- CLI with custom commands

7- Run on CentOS

#### Note:

1- The endpoint of the tunnel could be any device capable of decapsulating a L2GRE tunnel.
