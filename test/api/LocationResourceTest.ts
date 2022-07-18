import { expect } from "chai";
import request from "supertest";
import { describe, it } from "mocha";
import { main, app } from "../../src/index";

describe("Location REST Resource Endpoints Tests", () => {
    
    describe("/locations endpoint test", async () => {
        before(async () => {
            await main();
        });

        it("POST /locations, should create a new Location", async function() {
            const locationRes = await request(app)
                .post('/locations')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "site": "Sciences",
                    "name": "Sciences-II"
                });
            console.log(locationRes.text);
            expect(locationRes.statusCode).equal(201);
            expect(locationRes.body.site).equal("Sciences");
            expect(locationRes.body.name).equal("Sciences-II");

            /*const dupLocationRes = await request(app)
                .post('/locations')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "site": "Sciences",
                    "name": "Sciences-II"
                });
            
            expect(dupLocationRes.statusCode).equal(400);*/
        });

        it("GET /locations, should", async function() {
            console.log("Bouh");
        }); 
        
        it("GET /locations/:id?site=Sciences, should return locations of site", async function() {
            console.log("Bouh");
        });
    });

    describe("/locations/:id endpoint test", () => {
        it("GET /locations/:id, should return specific location", async function() {
            console.log("Bouh");
        });

        it("PUT /locations/:id, should update location properties", async function() {
            console.log("Bouh");
        });

        it("DELETE /locations/:id, should delete location", async function() {
            console.log("Bouh");
        });
    });    
});