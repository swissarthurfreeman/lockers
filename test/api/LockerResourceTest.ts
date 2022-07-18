import { expect } from "chai";
import request from "supertest";
import { describe, it } from "mocha";
import { app } from "../../src/index";

describe("Locker REST Resource Endpoints Tests", async () => {
    describe("/lockers endpoint test", () => {
        it("POST /lockers, Should POST a locker", async () => {
            const locationRes = await request(app)  // db is conserved sequentially
                .get('/locations')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")

            const sciII = (locationRes.body as Array<any>).find(o => o.site == 'Sciences');
            expect(sciII.site).equal("Sciences");

            const lockerRes = await request(app)  // db is conserved sequentially
                .post('/lockers')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    number: 10,
                    verticalPosition: "En haut",
                    lock: true,
                    locationId: sciII.locationId
                })
            
            expect(lockerRes.body.number).equal(10);
            expect(lockerRes.body.verticalPosition).equal("En haut");
            expect(lockerRes.body.lock).equal(true);

            const bagend = (locationRes.body as Array<any>).find(o => o.site == 'Shire');
            expect(bagend.name).equal("Bag-End");

            const bilbosLockerRes = await request(app)  // db is conserved sequentially
                .post('/lockers')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    number: 1,
                    verticalPosition: "En bas",
                    lock: false,
                    locationId: bagend.locationId
                })
            
            expect(bilbosLockerRes.body.number).equal(1);
            expect(bilbosLockerRes.body.verticalPosition).equal("En bas");
            expect(bilbosLockerRes.body.lock).equal(false);
        });

        it("GET /lockers, should return all lockers", async () => {
            const lockers = await request(app)  // db is conserved sequentially
                .get('/lockers')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
            
            expect(lockers.body.length).equal(2);
        });

        it("GET /lockers?site=SITE&name=NAME, should return all lockers at site", async () => {
            console.log("GET /lockers?site=SITE&name=NAME, should return all lockers at site");
            const sciencesIIILockers: any = await request(app)
                .get('/lockers?site=Sciences&name=Sciences-III')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")

            console.log(sciencesIIILockers.body);
            expect(sciencesIIILockers.body[0].location.site).equal('Sciences');
            expect(sciencesIIILockers.body[0].location.name).equal('Sciences-III');

            const bagendLockers: any = await request(app)
                .get('/lockers?site=Shire&name=Bag-End')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
            
            expect(bagendLockers.body[0].location.site).equal('Shire');
            expect(bagendLockers.body[0].location.name).equal('Bag-End');

            const nowhereLockers: any = await request(app)
                .get('/lockers?site=neptune&name=nebulae')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
            
            expect(nowhereLockers.status).equal(404);
        });
    });
});