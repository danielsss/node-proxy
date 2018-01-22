# Node-Proxy
A reverse proxy build on Node.js

# Dependancies
Node Version >= v8.\*.\*

# Download & Installation
- Using source code
```git clone https://github.com/danielsss/node-proxy.git```

- Install dependancies
```cd ./node-proxy && npm install```

# Testing Application
- mocha
```javascript

  Proxy
    ✓ It should be an query and returns an Object{url, method, status, headers} (45ms)


  1 passing (67ms)

```

# How to run it ? that would be very simple.
```js
const Proxy = require("node-proxy");
const opts = {
    port: 8080, host: "127.0.0.1",//Proxy server info
    backends: [ //backend servers
        {port: 8081, host: "127.0.0.1"},
        {port: 8082, host: "127.0.0.1"},
        {port: 8083, host: "127.0.0.1"}
    ]
};
const app = new Proxy(opts);
app.start();
```

# You can set&remove the headers of Request&Response on proxy stage.
```js
//Set up request-header for backend servers
app.request.setHeader("request-ts", Date.now());
app.request.delHeader("request-ts");

//Set up response-header for client
app.response.setHeader("server-ts", Date.now());
app.response.delHeader("server-ts");
```