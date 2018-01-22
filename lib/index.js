"use strict";

const debug = require("debug")("Proxy:Application");
const http = require("http");

const Request = require("./request");
const Response = require("./response");
const Proxy = require("./proxy");

const PRIVITE = {
    ON_HTTP_EVENT: Symbol("onHttpEvent"),
};

const EVENTS = {
    HTTP_LISTENING: "listening",
    HTTP_ERROR: "error",
    HTTP_CLOSE: "close",
    HTTP_CONNECTION: "connection"
};


/**
 * @description Proxy Server
 * @default Address-127.0.0.1:80
 * @param {Number} opts.port
 * @param {Array} opts.backends 
 */
class Application {
    constructor(opts={}){
        if(!opts.backends){
            throw new Error("opts.backends are required");
        }
        this.backends = opts.backends || null;
        this.request = new Request(this);
        this.response = new Response(this);
        this.proxy = new Proxy(this);
        
        this._serverInfo = [opts.port || 80, opts.host || "127.0.0.1"];
        this._httpServer = null;
    }

    start(){
        this._httpServer = http.createServer(this.proxy.requestHandler.bind(this.proxy));
        this[PRIVITE.ON_HTTP_EVENT]().listen(...this._serverInfo);
    }

    [PRIVITE.ON_HTTP_EVENT](){
        const _onListening = function(){
            let addr = this._httpServer.address();
            debug("Listening on %s:%s", addr.address, addr.port);
        };

        const _onError = function(err){
            debug("http.createServer error\n%j", err);
        };

        this._httpServer.on(EVENTS.HTTP_LISTENING, _onListening.bind(this));
        this._httpServer.on(EVENTS.HTTP_ERROR, _onError.bind(this));
        return this._httpServer;
    }
    
}

module.exports = Application;