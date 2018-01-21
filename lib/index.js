"use strict";

const http = require("http");
const Proxy = require("./proxy");
const debug = require("debug")("Proxy:Application");

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
 * @param {Number} opts.port
 * @param {Array} opts.backends 
 */
class Application {
    constructor(opts={}){
        if(!opts.backends){
            throw new Error("opts.backends are required");
        }
        this._backends = opts.backends || null;
        this._serverInfo = [opts.port || 80, opts.host || "127.0.0.1"];
        this._proxy = new Proxy(opts);
        this._httpServer = null;
    }

    start(){
        this._httpServer = http.createServer(this._proxy.requestHandler.bind(this._proxy));
        this[PRIVITE.ON_HTTP_EVENT]();
        this._httpServer.listen(...this._serverInfo);
    }

    [PRIVITE.ON_HTTP_EVENT](){
        //debug("onHttpEvent");
        const _onListening = function(){
            let addr = this._httpServer.address();
            debug("Listening on %s:%s", addr.address, addr.port);
        };
        this._httpServer.on(EVENTS.HTTP_LISTENING, _onListening.bind(this));

        const _onError = function(err){
            debug("http.createServer error\n%j", err);
        };
        this._httpServer.on(EVENTS.HTTP_ERROR, _onError.bind(this));
    }
    
}

module.exports = Application;