import { expect } from "chai";
import { describe, it } from "mocha";
import request from "supertest";
import { app } from "../../src";

describe("Contract Resource Tests", () => {
    describe("Contract Endpoint user Creates Contract use-case", async () => {
        let lockerId: string;
        it("Should Post a valid Contract", async () => {
            const lockerRes = await request(app)
                .get('/lockers?site=Sciences')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
            
            const locker = lockerRes.body[0];

            const contractRes = await request(app)
                .post('/contracts')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "lockerId": locker.lockerId
                });
            
            expect(contractRes.statusCode).equal(201);
            expect(contractRes.body.status).equal("Occupied");
            lockerId = locker.lockerId;
        });

        it("Should not create two contracts at a same locker", async () => {
            const contractRes = await request(app)
                .post('/contracts')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "lockerId": lockerId
                });
            
            console.log(contractRes.body.message); // TODO : check validation error and display more information
            expect(contractRes.statusCode).equal(400);
        });

        it("Should not create a contract when locker does not exist", async () => {
            const contractRes = await request(app)
                .post('/contracts')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "lockerId": "akjsnfaskjgioaskdgjo"
                });
            
            expect(contractRes.statusCode).equal(400);
            expect(contractRes.body.message).equal("Locker does not exist");
        });  
    });
});