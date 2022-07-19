import { expect } from "chai";
import request from "supertest";
import { describe, it } from "mocha";
import { main, app } from "../../src/index";

describe("Location REST Resource Endpoints Tests", () => {
    let sciencesLoc1: number;
    let sciencesLoc2: number;
    describe("/locations endpoint test", async () => {
        before(async () => {
            await main();
        });

        it("POST new /locations, should create a new Location", async function() {
            const locationRes = await request(app)
                .post('/locations')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "site": "Sciences",
                    "name": "Sciences-II"
                });
            expect(locationRes.statusCode).equal(201);
            expect(locationRes.body.site).equal("Sciences");
            expect(locationRes.body.name).equal("Sciences-II");

            const otherLocation = await request(app)
                .post('/locations')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "site": "Shire",
                    "name": "Bag-End"
                });
            expect(otherLocation.statusCode).equal(201);
            expect(otherLocation.body.site).equal("Shire");
            expect(otherLocation.body.name).equal("Bag-End");

            const otherSciencesLocation = await request(app)
                .post('/locations')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "site": "Sciences",
                    "name": "EPA"
                });
            expect(otherSciencesLocation.statusCode).equal(201);
            sciencesLoc2 = otherSciencesLocation.body.locationId;

            const mordorRes = await request(app)
                .post('/locations')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "site": "Mordor",
                    "name": "TowerOfFire"
                });
            expect(mordorRes.statusCode).equal(201);
        });

        it("POST duplicate /locations, should yield an error", async () => {
            const dupLocationRes = await request(app)
                .post('/locations')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "site": "Sciences",
                    "name": "Sciences-II"
                });
            
            expect(dupLocationRes.statusCode).equal(400);
        });

        it("GET /locations, should return all locations", async function() {
            const res = await request(app)
                .get('/locations')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")

            expect(res.statusCode).equal(200);
            expect(res.body.length).equal(4);

            const sciII = (res.body as Array<any>).find(o => o.name == 'Sciences-II');
            
            expect(sciII.site).equal("Sciences");
            expect(sciII.name).equal("Sciences-II");
            
            const shire = (res.body as Array<any>).find(o => o.site == 'Shire');
            expect(shire.site).equal("Shire");
            expect(shire.name).equal("Bag-End");

            sciencesLoc1 = sciII.locationId;
        }); 

        it("GET /locations/?site=Sciences, should return locations of site", async function() {
            const res = await request(app)
                .get('/locations?site=Sciences')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
            
            expect(res.status).equal(200);
            expect(res.body.length).equal(2);
        });
    });

    describe("/locations/:id endpoint test", () => {
        it("GET /locations/:id, should return specific location object by id", async function() {
            const res = await request(app)
                .get('/locations/'+sciencesLoc1)
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
            
            expect(res.status).equal(200);
            expect(res.body.site).equal("Sciences");
        });

        it("PUT /locations/:id, should update location properties", async function() {
            const res = await request(app)
                .put('/locations/'+sciencesLoc1)
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "name": "Sciences-III"
                });
            
            expect(res.status).equal(200);
            expect(res.body.name).equal('Sciences-III');
            
            const dupUpdate = await request(app)    // updating to another Sciences-III at Sciences yields an error.
                .put('/locations/'+sciencesLoc2)
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "name": "Sciences-III"
                });
            
            expect(dupUpdate.status).equal(400);
            expect(dupUpdate.body).to.haveOwnProperty("message");
        });

        it("DELETE /locations/:id, should delete location", async function() {
            const delRes = await request(app)
                .delete('/locations/'+sciencesLoc2)
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                
            expect(delRes.status).equal(204);
            
            const locationsAtSciences = await request(app)
                .get('/locations?site=Sciences')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
            
            expect(locationsAtSciences.body.length).equal(1);
        });
    });    
});