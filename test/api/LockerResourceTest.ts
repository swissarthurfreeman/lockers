import { expect } from "chai";
import request from "supertest";
import { describe, it } from "mocha";
import { app } from "../../src/index";

describe("Locker REST Resource Endpoints Tests", async () => {
    describe("/lockers endpoint test", () => {
        let toDeleteLockerId: string;
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

            const toDeleteLocker = await request(app)  // db is conserved sequentially
                .post('/lockers')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
                .send({
                    number: 10,
                    verticalPosition: "En bas",
                    lock: false,
                    locationId: bagend.locationId
                });
        
            expect(toDeleteLocker.status).equal(201);
            toDeleteLockerId = toDeleteLocker.body.lockerId;
        });

        it("GET /lockers, should return all lockers", async () => {
            const lockers = await request(app)  // db is conserved sequentially
                .get('/lockers')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
            
            expect(lockers.body.length).equal(3);
        });

        it("GET /lockers?site=SITE&name=NAME, should return all lockers at site", async () => {
            const sciencesIIILockers = await request(app)
                .get('/lockers?site=Sciences&name=Sciences-III')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")

            expect(sciencesIIILockers.body[0].location.site).equal('Sciences');
            expect(sciencesIIILockers.body[0].location.name).equal('Sciences-III');

            const bagendLockers = await request(app)
                .get('/lockers?site=Shire&name=Bag-End')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
            
            expect(bagendLockers.body[0].location.site).equal('Shire');
            expect(bagendLockers.body[0].location.name).equal('Bag-End');

            const nowhereLockers = await request(app)
                .get('/lockers?site=neptune&name=nebulae')
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Accept", "application/json; charset=utf-8")
                .expect("Content-Type", "application/json; charset=utf-8")
            
            expect(nowhereLockers.status).equal(404);
        });

        let bilbosLockerId: number;
        describe("/lockers/:id endpoint test", () => {
            it("PUT /lockers/:id Should update lockers properties correctly", async () => {
                const bagendLocker = await request(app)
                    .get('/lockers?name=Bag-End')
                    .set("Content-Type", "application/json; charset=utf-8")
                    .set("Accept", "application/json; charset=utf-8")
                    .expect("Content-Type", "application/json; charset=utf-8")

                const updatedBagendLocker = await request(app)
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
                
                const movedToMordorLocker = await request(app)
                    .get('/lockers/' + mordorMove.body.lockerId)
                    .set("Content-Type", "application/json; charset=utf-8")
                    .set("Accept", "application/json; charset=utf-8")
                    .expect("Content-Type", "application/json; charset=utf-8");
                
                expect(movedToMordorLocker.status).equal(200);
                expect(movedToMordorLocker.body.location.site).equal("Mordor");
                expect(movedToMordorLocker.body.location.name).equal("TowerOfFire");
                expect(movedToMordorLocker.body.lock).equal(true);
                expect(movedToMordorLocker.body.verticalPosition).equal("Hidden");

                bilbosLockerId = movedToMordorLocker.body.lockerId;
            });

            it("DELETE /lockers/:id, Should delete the locker if id is valid and no contract is attached, nothing if not", async () => {
                const deleteResponse = await request(app)
                    .delete('/lockers/' + toDeleteLockerId)
                    .set("Content-Type", "application/json; charset=utf-8")
                    .set("Accept", "application/json; charset=utf-8")
                    .expect("Content-Type", "application/json; charset=utf-8");
                
                expect(deleteResponse.status).equal(200);
                expect(deleteResponse.body.message).equal("Locker successfully removed");

                await request(app)
                    .post('/contracts')
                    .set("Content-Type", "application/json; charset=utf-8")
                    .set("Accept", "application/json; charset=utf-8")
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .send({
                        "lockerId": bilbosLockerId
                    });

                const bilboDeleteResponse = await request(app)  // cannot delete a locker with a contract attached
                    .delete('/lockers/' + bilbosLockerId)
                    .set("Content-Type", "application/json; charset=utf-8")
                    .set("Accept", "application/json; charset=utf-8")
                    .expect("Content-Type", "application/json; charset=utf-8");
                
                expect(bilboDeleteResponse.status).equal(400);

                const bilbosLockerStillExistsRes = await request(app)
                    .get('/lockers/' + bilbosLockerId)
                    .set("Content-Type", "application/json; charset=utf-8")
                    .set("Accept", "application/json; charset=utf-8")
                    .expect("Content-Type", "application/json; charset=utf-8");

                expect(bilbosLockerStillExistsRes.body.location.name).equal("TowerOfFire");
            });

            it("DELETE /lockers/sakksdjgksdg should tell you locker doesn't exist", async () => {
                const randomDelete = await request(app)
                    .delete('/lockers/sakksdjgksdg')
                    .set("Content-Type", "application/json; charset=utf-8")
                    .set("Accept", "application/json; charset=utf-8")
                    .expect("Content-Type", "application/json; charset=utf-8");
                
                expect(randomDelete.status).equal(400);
                expect(randomDelete.body.message).equal("Locker does not exist");
            });
        });
    });
});