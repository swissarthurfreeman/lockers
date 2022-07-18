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
            const sciencesIIILockers: any = await request(app)
                .get('/lockers?site=Sciences&name=Sciences-III')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")

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

        describe("/lockers/:id endpoint test", () => {
            it("PUT /lockers/:id Should update lockers properties correctly", async () => {
                const bagendLocker: any = await request(app)
                    .get('/lockers?name=Bag-End')
                    .set("Content-Type", "application/json; charset=utf-8")
                    .set("Accept", "application/json; charset=utf-8")
                    .expect("Content-Type", "application/json; charset=utf-8")

                const updatedBagendLocker: any = await request(app)
                    .put('/lockers/' + bagendLocker.body[0].lockerId)
                    .set("Content-Type", "application/json; charset=utf-8")
                    .set("Accept", "application/json; charset=utf-8")
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .send({
                        lock: true,                 // bilbo got weary and decided to put his locker out of reach
                        verticalPosition: "Hidden" 
                    });

                expect(updatedBagendLocker.status).equal(200);
                expect(updatedBagendLocker.body.verticalPosition).equal("Hidden");
                expect(updatedBagendLocker.body.lock).equal(true);

                const mordorMove: any = await request(app)
                    .put('/lockers/' + bagendLocker.body[0].lockerId)
                    .set("Content-Type", "application/json; charset=utf-8")
                    .set("Accept", "application/json; charset=utf-8")
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .send({
                        locationId: 4                 // bilbo got very weary and decided to move his locker to mordor 
                    });
                
                expect(mordorMove.status).equal(200);
                
                const movedToMorderLocker: any = await request(app)
                    .get('/lockers/' + mordorMove.body.lockerId)
                    .set("Content-Type", "application/json; charset=utf-8")
                    .set("Accept", "application/json; charset=utf-8")
                    .expect("Content-Type", "application/json; charset=utf-8");
                
                expect(movedToMorderLocker.status).equal(200);
                expect(movedToMorderLocker.body.location.name).equal("TowerOfFire");
                expect(movedToMorderLocker.body.lock).equal(true);
                expect(movedToMorderLocker.body.verticalPosition).equal("Hidden");
            });
            // to do add delete and get
        });
    });
});