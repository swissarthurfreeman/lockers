import { expect } from "chai";
import { describe, it } from "mocha";
import request from "supertest";
import { Locker } from "../../src/domain/model/Locker";
import { Location } from "../../src/domain/model/Location";
import { main, app } from "../../src";

describe("Contract Service Tests", () => {
    before(async () => {
        await main();
        const locDestr = await Location.destroy({where: {}, force: true});
        const lockDestr = await Locker.destroy({where: {}, force: true});
    });

    describe("Contract Endpoint user Creates Contract use-case", async () => {
        let lockerId: number;
        let locationId: number;
        
        it("Should Post a Locker", async () => {
            const lockerRes = await request(app)
                .post('/lockers')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "number": 14, 
                    "verticalPosition": "En hauteur",
                    "lock": true,
                    "locationId": locationId
                });
            
            expect(lockerRes.status).equal(201);
            expect(lockerRes.body.number).equal(14);
            expect(lockerRes.body.lock).equal(true);
            lockerId = lockerRes.body.lockerId;
        });

        it("Should Post a Contract", async () => {
            const contractRes = await request(app)
                .post('/contracts')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "lockerId": lockerId
                });
            
            expect(contractRes.statusCode).equal(201);
            expect(contractRes.body.status).equal("Occupied");
        });  
    });
});