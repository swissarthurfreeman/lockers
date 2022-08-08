import { expect } from "chai";
import { describe, it } from "mocha";
import request from "supertest";
import { app } from "../../src";
import { Contract } from "../../src/domain/model/Contract";
import { Locker } from "../../src/domain/model/Locker";

describe("Contract Resource Tests", () => {
    describe("/contracts endpoint test", async () => {
        let MordarLockers: Locker[];
        it("POST /contracts, Should Post a valid Contract for Bilbo Baggins", async () => {
            const MordorLockers: Locker[] = (await request(app).get('/lockers?site=Mordor')).body;

            const contractRes = await request(app)
                .post('/contracts')
                .set('oidc_claim_given_name', 'Bilbo')
                .set('oidc_claim_family_name', 'Baggins')
                .set('oidc_claim_email', 'Bilgo.Baggins@shire.me')
                .send({
                    "lockerId": MordorLockers[0].lockerId
                });
            
            expect(contractRes.statusCode).equal(201);
            expect(contractRes.body.status).equal("Occupied");
            MordarLockers = MordorLockers;
        });

        it("POST /contracts, By greedy Bilbo should yield an error, a user can only create one", async () => {
            
            const contractRes = await request(app)
                .post('/contracts')
                .set('oidc_claim_given_name', 'Bilbo')
                .set('oidc_claim_family_name', 'Baggins')
                .set('oidc_claim_email', 'Bilgo.Baggins@shire.me')
                .send({
                    "lockerId": MordarLockers[0].lockerId
                });
            
            expect(contractRes.statusCode).equal(403);
        });

        it("POST /contracts, By admin for user that already has a contract should work", async () => {
            
            const contractRes = await request(app)
                .post('/contracts')
                .set('oidc_claim_ismemberof', 'admin')
                .send({
                    "firstname": 'Bilbo',
                    "lastname": 'Baggins',
                    "email": 'Bilgo.Baggins@shire.me',
                    "lockerId": MordarLockers[1].lockerId
                });
            
            expect(contractRes.statusCode).equal(201);
        });

        it("GET /contracts, By Bilbo should return all his contracts", async () => {
            const BilboContracts: Contract[] = (await request(app)
                .get('/contracts')
                .set('oidc_claim_given_name', 'Bilbo')
                .set('oidc_claim_family_name', 'Baggins')
                .set('oidc_claim_email', 'Bilgo.Baggins@shire.me')).body;
           
            expect(BilboContracts.length).equal(2);
        });

        it("POST /contracts, By admin on locker that already has a contract should not work", async () => {

            const contractRes = await request(app)
                .post('/contracts')
                .set('oidc_claim_ismemberof', 'admin')
                .send({
                    "firstname": 'Frodo',
                    "lastname": 'Baggins',
                    "email": 'Frodo.Baggins@shire.me',
                    "lockerId": MordarLockers[1].lockerId
                });
            
            expect(contractRes.statusCode).equal(400);
        });

        
        it("Should not create a contract when locker does not exist", async () => {
            const res = await request(app)
                .post('/contracts')
                .set('oidc_claim_ismemberof', 'admin')
                .send({
                    "lockerId": "akjsnfaskjgioaskdgjo"
                });
            
            expect(res.statusCode).equal(400);
            expect(res.body.message).equal("Locker does not exist");
        });
    });
    // TODO : add test cases for /contracts/:id with PUT, DELETE, GET and all possible scenarios
});