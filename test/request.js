
/* global describe, it*/

const request = require("request-promise");
const should = require("should");
const app = {baseUrl: "http://localhost:8080"};

describe("Proxy", function(){
    //const app = require("./app");
    it("It should be an query and returns ok", async () => {
        //console.info(app.baseUrl);
        await request(app.baseUrl).then((resolved)=>{
            if(typeof resolved === "string") {
                resolved = JSON.parse(resolved);
            }
            should(resolved).have.property("status", "ok");
        });
        await request(app.baseUrl).then((resolved)=>{
            if(typeof resolved === "string") {
                resolved = JSON.parse(resolved);
            }
            should(resolved).have.property("status", "ok");
        });
        await request(app.baseUrl).then((resolved)=>{
            if(typeof resolved === "string") {
                resolved = JSON.parse(resolved);
            }
            should(resolved).have.property("status", "ok");
        });
    });
});