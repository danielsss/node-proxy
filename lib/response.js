"use strict";

class Response {
    constructor(app){
        this._app = app || null;
        this.headers = {};
    }

    /**
     * @description Set response header
     * @param {*} key 
     * @param {*} value 
     */
    setHeader(key, value){
        if(!key || !value) return new Error("request header must be key/value");
        this.headers[key] = value;
    }
    /**
     * @description delete customized header
     * @param {*} key 
     */
    delHeader(key){
        if(!key) return new Error("The key is required");
        if(!this.headers.hasOwnProperty(key)) return false;
        delete this.headers[key];
    }
}

module.exports = Response;