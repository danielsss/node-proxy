"use strict";
const debug = require("debug")("Proxy:handler");
const {request} = require("http");

const PRIVATE = {
    NEXT: Symbol("getNextBackendServer"),
    REQUEST: Symbol("request"),
    ON_ERROR: Symbol("onError"),

    ATTRS: {
        OFFSET: Symbol("offset"),
    }
};

/**
 * @class Proxy
 * @description Proxy middleware
 * @param {Array} opts backend servers
 */
class Proxy {
    constructor(opts={}){
        this._opts = opts;
        this._backends = opts.backends;
        this[PRIVATE.ATTRS.OFFSET] = 0;

        this._req = null;
        this._res = null;

        this.info = undefined;
    }

    /**
     * @description requestHandler for http.createServer()
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse} response
     */
    requestHandler(req, res){
        this._req = req, this._res = res;
        debug("headers: %j", req.headers);
        this[PRIVATE.REQUEST]();
    }

    /**
     * @description Round-Robin machianism
     */
    [PRIVATE.NEXT](){
        return this._backends[
            this[PRIVATE.ATTRS.OFFSET]++ % this._backends.length
        ];
    }

    /**
     * @description Send request to backend server
     */
    [PRIVATE.REQUEST](){
        let server = this[PRIVATE.NEXT]();
        let options = {
            port: server.port,
            host: server.host,
            headers: this._req.headers,
            path: this._req.url,
            method: this._req.method
        };
        
        this.info = `${this._req.method} ${this._req.url} => ${server.host}:${server.port}`;
        debug("[%s] proxy request", this.info);
        const onRequest = function(res){
            res.on("error", this[PRIVATE.ON_ERROR]);
            this._res.writeHead(res.statusCode, res.headers);
            res.pipe(this._res);
        };
        let backendRequest = request(options, onRequest.bind(this));
        backendRequest.on("error", this[PRIVATE.ON_ERROR]);
        this._req.pipe(backendRequest);
    }


    /** 
    *@description Error handler
    *@param {Error} err
    */
    [PRIVATE.ON_ERROR](err){
        const msg = String(err.stack || err);
        debug("[%s] encountered an error: %s", this.info, msg);
        if (!this._res.headersSent) {
            this._res.writeHead(500, { "content-type": "text/plain" });
        }
        this._res.end(msg);
    }
}

module.exports = Proxy;