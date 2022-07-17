import { expect } from "chai";
import { describe, it } from "mocha";
import request from "supertest";
import { Locker } from "../../src/domain/model/Locker";
import { Location } from "../../src/domain/model/Location";
import { Contract } from "../../src/domain/model/Contract";
import { ContractService } from "../../src/domain/service/ContractService";
import { main, app, sequelize } from "../../src";

describe("Contract Service Tests", () => {
    before(async () => {
        await main();
        const locDestr = await Location.destroy({where: {}, force: true});
        const lockDestr = await Locker.destroy({where: {}, force: true});
    });

    describe("Contract Status Scenarios Tests", async () => {
        let locationId: number;
        let lockerId: number;
        it("Should Post A Location", async () => {
            const locationRes = await request(app)
                .post('/locations')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    "site": "Sciences",
                    "name": "Sciences III"
                });
            
            expect(locationRes.statusCode).equal(201);
            expect(locationRes.body.site).equal("Sciences");
            expect(locationRes.body.name).equal("Sciences III");
            locationId = locationRes.body.locationId;
        });

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