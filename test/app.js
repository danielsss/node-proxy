const App = require("../lib");
const http = require("http");
const debug = require("debug")("mocha:runner");

const options = {
    port: 8080, host: "127.0.0.1",
    backends: [
        {port: 8081, host: "127.0.0.1"},
        {port: 8082, host: "127.0.0.1"},
        {port: 8083, host: "127.0.0.1"}
    ]
};
const app = new App(options);
app.start();


function startBackendServers(port, hostname){
    let server = http.createServer((req, res)=>{
        let info = {status: "ok"};
        res.writeHead(200, {"Content-type": "application/json"});
        res.end(JSON.stringify(info));
    });
    server.listen(port, hostname);
    server.on("listening", function(){
        let s = server.address();
        debug("Listen on %s:%s", s.address, s.port);
    });
}
startBackendServers(8081, "127.0.0.1");
startBackendServers(8082, "127.0.0.1");
startBackendServers(8083, "127.0.0.1");