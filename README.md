# nmp-proxy


### This guide for Linux

### Do this to start:

1. Download the vanilla server minecraft 1.8.+  https://minecraft.net/download
2. Configure the server:
   - motd=Server 1
   - online-mode=false
   - enable-rcon=true
   - rcon.password=you rcon password for this server (such as 1234)
   - rcon.port=rcon port for this server (such as 25575)
   - server-port=server port for this server (such as 25565)
3. Make a copy of the configured server and reconfigure it:
   - motd=Server 2
   - online-mode=false
   - enable-rcon=true
   - rcon.password=you rcon password for this server (such as 1234)
   - rcon.port=rcon port for this server (such as 25574)
   - server-port=server port for this server (such as 25564)
4. Open the console and enter the following commands:
   - wget https://github.com/lastuniverse/nmp-proxy/archive/master.zip
   - cd nmp-proxy-master
   - npm install
   - cp lib/servers/serverlist.json.sample lib/servers/serverlist.json
5. Then edit file lib/servers/serverlist.json halyard so that it matches the server settings that you did above.
6. Run both your vanilla server. wait for them to complete the load.
7. Run nmp-proxy (start.sh in nmp-proxy-master folder)


If done correctly, you will see:
```
nmp-proxy> ./start.sh
test Users 1
test Users 2
rcon Authed! [server_1]
rcon Authed! [server_2]
```



### the nmp-proxy server shows the following features:
   - realization of the group of commands /warp
   - realization of command /spawn
   - implementation of the protection of the territory. the whole territory located within 50 blocks from the spawn protected
   - implementation of the transition between the servers. When crossing the border X = -100 you move from one server to another.
   
   
### do not criticize the code:) 
nmp-proxy is built from the night practices. it's just a demonstration of the possibilities of the node-minecraft-protocol proxy server.
