import { expect } from "chai";
import request from "supertest";
import { describe, it } from "mocha";
import { main, app } from "../../src/index";

describe("Location REST Resource Endpoints Tests", () => {
    before(async () => {
        await main();
    });

    let MinasTirithGateLocationId: string;
    let MordorMountDoomLocationId: string;
    
    describe("/locations endpoint test", async () => {
        
        it("POST new /locations, should create a new Location", async function() {
            const locationRes = await request(app)
                .post('/locations')
                .send({
                    "site": "Mordor",
                    "name": "Mount-Doom"
                });
            expect(locationRes.statusCode).equal(201);
            expect(locationRes.body.site).equal("Mordor");
            expect(locationRes.body.name).equal("Mount-Doom");
            MordorMountDoomLocationId = locationRes.body.locationId;
        });

        it("POST new /locations at existing site should create a new Location", async function() {
            const locationRes = await request(app)
                .post('/locations')
                .send({
                    "site": "Mordor",
                    "name": "Porte d'entrée"
                });
            expect(locationRes.statusCode).equal(201);
            expect(locationRes.body.site).equal("Mordor");
            expect(locationRes.body.name).equal("Porte d'entrée");
        });
        
        it("POST /locations, of location with same name but different site than another should create the location", async () => {
            const dupLocationRes = await request(app)
                .post('/locations')
                .send({
                    "site": "Minas-Tirith",
                    "name": "Porte d'entrée"
                });
            
            expect(dupLocationRes.statusCode).equal(201);
        });

        it("POST duplicate /locations, should yield an error", async () => {
            const dupLocationRes = await request(app)
                .post('/locations')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "site": "Minas-Tirith",
                    "name": "Porte d'entrée"
                });
            
            expect(dupLocationRes.statusCode).equal(400);
        });
        
        it("GET /locations, should return all locations", async function() {
            const res = await request(app)
                .get('/locations')

            expect(res.statusCode).equal(200);
            
            const MinasTirithGate = (res.body as Array<any>).find(o => o.name == "Porte d'entrée" && o.site === "Minas-Tirith");
            MinasTirithGateLocationId = MinasTirithGate.locationId;
            expect(MinasTirithGate.site).equal("Minas-Tirith");
            expect(MinasTirithGate.name).equal("Porte d'entrée");
        }); 
        
        it("GET /locations/?site=Mordor, should return locations at Mordor", async function() {
            const res = await request(app)
                .get('/locations?site=Mordor')

            expect(res.status).equal(200);
            expect(res.body.length).equal(2);
        });
    });
    describe("/locations/:id endpoint test", () => {
        it("GET /locations/:id, should return specific location object by id", async function() {
            const res = await request(app)
                .get('/locations/' + MinasTirithGateLocationId)
                
            expect(res.status).equal(200);
            expect(res.body.site).equal("Minas-Tirith");
        });
    
        it("PUT /locations/:id, should update location properties", async function() {
            const res = await request(app)
                .put('/locations/' + MinasTirithGateLocationId)
                .send({
                    "name": "Gate"
                });
            
            expect(res.status).equal(200);
            expect(res.body.name).equal('Gate');
        });

        it("PUT /locations/:id, to a name that already exists at the site yields an error",  async function() {
            const res = await request(app)
                .put('/locations/' + MordorMountDoomLocationId)
                .send({
                    "name": "Porte d'entrée"
                });
            
            expect(res.status).equal(400);
        });
    
        it("DELETE /locations/:id, should delete location", async function() {
            const delRes = await request(app).delete('/locations/' + MordorMountDoomLocationId)
            expect(delRes.status).equal(204);
            const locationsAtMordor = await request(app).get('/locations?site=Mordor');     
            expect(locationsAtMordor.body.length).equal(1);
        });
    });    
});