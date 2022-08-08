import { expect } from "chai";
import { describe, it } from "mocha";
import request from "supertest";
import { Contract } from "../../src/domain/model/Contract";
import { Locker } from "../../src/domain/model/Locker";
import { Location } from "../../src/domain/model/Location";
import { main, app } from "../../src/index";

describe("Locker REST Resource Endpoints Tests", async () => {

    let MinasTirith: Location;
    let NinasTirithLocker: Locker;

    let MordorLocation: Location;
    before(async () => {
        MinasTirith = (await request(app).get('/locations?site=Minas-Tirith&name=Gate')).body[0];
        MordorLocation = (await request(app).get('/locations?site=Mordor')).body[0];
    });
    
    describe("/lockers endpoint test", () => {
        it("POST /lockers, Should POST a locker", async () => {
            const res = await request(app)  // db is conserved sequentially
                .post('/lockers')
                .set('oidc_claim_ismemberof', 'admin')
                .send({
                    number: 10,
                    verticalPosition: "En haut",
                    lock: false,
                    locationId: MinasTirith.locationId
                })
            
            expect(res.status).equal(201);
            expect(res.body.number).equal(10);
            expect(res.body.verticalPosition).equal("En haut");
            expect(res.body.lock).equal(false);

            const MordorRes = await request(app)  // db is conserved sequentially
                .post('/lockers')
                .set('oidc_claim_ismemberof', 'admin')
                .send({
                    number: 13,
                    verticalPosition: "En haut",
                    lock: false,
                    locationId: MordorLocation.locationId
                })
            
            expect(MordorRes.status).equal(201);
            expect(MordorRes.body.number).equal(13);

            await request(app)  // db is conserved sequentially
                .post('/lockers')
                .set('oidc_claim_ismemberof', 'admin')
                .send({
                    number: 1812,
                    verticalPosition: "En bas",
                    lock: true,
                    locationId: MordorLocation.locationId
                })
        });

        it("POST /lockers, with a number already at that location should yield an error", async () => {
            const res = await request(app)  // db is conserved sequentially
                .post('/lockers')
                .set('oidc_claim_ismemberof', 'admin')
                .send({
                    number: 10,
                    verticalPosition: "En bas",
                    lock: false,
                    locationId: MinasTirith.locationId
                })
            
            expect(res.status).equal(400);
        });

        it("GET /lockers, should return all free lockers", async () => {
            const lockers = await request(app).get('/lockers')
            expect(lockers.body.length).greaterThan(0);
        });

        it("GET /lockers?site=Minas-Tirith&name=Gate, should return all lockers at Minas-Tirith Gate", async () => {
            const MinasTirithLocker = (await request(app).get('/lockers?site=Minas-Tirith&name=Gate')).body[0];
            expect(MinasTirithLocker.location.site).equal('Minas-Tirith');
            expect(MinasTirithLocker.location.name).equal('Gate');
            NinasTirithLocker = MinasTirithLocker;
        });

        it("GET /lockers?site=Moon&name=Prussians, should return a not found", async () => {
            const nowhereLockers = await request(app).get('/lockers?site=moon&name=prussians');
            expect(nowhereLockers.status).equal(404);
        });
    });

    describe("/lockers/:id endpoint test", () => {
        it("PUT /lockers/:id, Should update lockers properties correctly", async () => {
            const UpdatedNinasTirithLockerRes = await request(app)
                .put('/lockers/' + NinasTirithLocker.lockerId)
                .set('oidc_claim_ismemberof', 'admin')
                .send({
                    lock: true,                 
                    verticalPosition: "Hidden" 
                });

            expect(UpdatedNinasTirithLockerRes.status).equal(200);
            expect(UpdatedNinasTirithLockerRes.body.verticalPosition).equal("Hidden");
            expect(UpdatedNinasTirithLockerRes.body.lock).equal(true);
            NinasTirithLocker = UpdatedNinasTirithLockerRes.body;
        });

        it("PUT /lockers/:id, Should work when moving the locker to another location", async () => {
            const MordorMoveRes: any = await request(app)
                .put('/lockers/' + NinasTirithLocker.lockerId)
                .set('oidc_claim_ismemberof', 'admin')
                .send({
                    locationId: MordorLocation.locationId   // bilbo got very weary and decided to move his locker to mordor 
                });
            
            expect(MordorMoveRes.status).equal(200);
            expect(MordorMoveRes.body.locationId).equal(MordorLocation.locationId); // put response doesn't aggregate associations
        });

        it("DELETE /lockers/sakksdjgksdg should tell you locker doesn't exist", async () => {
            const res = await request(app)
                .delete('/lockers/sakksdjgksdg')
                .set('oidc_claim_ismemberof', 'admin');

            expect(res.status).equal(400);
            expect(res.body.message).equal("Locker does not exist");
        });

        it("DELETE /lockers/:id, Shouldn't delete a locker if a contract is attached to it", async () => {
            
            const PostContractRes = await request(app)
                .post('/contracts') // user creates contract for himself
                .send({
                    "lockerId": NinasTirithLocker.lockerId
                });

            expect(PostContractRes.status).equal(201);

            // cannot delete a locker with a contract attached
            const DeleteLockerRes = await request(app)
                .delete('/lockers/' + NinasTirithLocker.lockerId)
                .set('oidc_claim_ismemberof', 'admin')
                
            expect(DeleteLockerRes.status).equal(400);
            expect(DeleteLockerRes.body.message).equal("Locker has a contract attached, delete the contract first");
        });

        it("DELETE /lockers/:id, Should delete a locker if it no longer has a contract attached to it", async () => {
            
            const DeleteContractRes = await request(app)
                .delete('/contracts/' + NinasTirithLocker.lockerId)
                .set('oidc_claim_ismemberof', 'admin')

            expect(DeleteContractRes.status).equal(204);

            // cannot delete a locker with a contract attached
            const DeleteLockerRes = await request(app)
                .delete('/lockers/' + NinasTirithLocker.lockerId)
                .set('oidc_claim_ismemberof', 'admin')
                
            expect(DeleteLockerRes.status).equal(204);
        });
    });
});