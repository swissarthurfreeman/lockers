import { expect } from "chai";
import request from "supertest";
import { describe, it } from "mocha";
import { app } from "../../src/index";
import { Locker } from "../../src/domain/model/Locker";
import {Location} from "../../src/domain/model/Location";

describe("Locker REST Resource Endpoints Tests", () => {
    before(async () => {
        const loc = await Location.create({
            "site": "Sciences",
            "name": "Sciences-III"
        });
        console.log("Created location is ", loc);

        const locker1 = await Locker.create({
            "number": 1, 
            "verticalPosition": "En hauteur",
            "lock": true,
            "locationId": 1
        });
        console.log("Created locker is ", locker1);

        const locker2 = await Locker.create({
            "number": 14, 
            "verticalPosition": "En bas",
            "lock": false,
            "locationId": 1
        });
        console.log("Created location is ", locker2);
    });
    
    describe("/lockers endpoint test", () => {
        it("GET /lockers", async function() {
            const res = await request(app).get('/lockers');
            expect(res.status).to.equal(200);
            console.log(res);
            console.log("Successfuly ran GET /");
        });

        it("POST /lockers", async function() {
            console.log("Bouh");
        });
    });

    describe("/lockers:id endpoint test", () => {
        it("GET /lockers:id", async function() {
            console.log("Bouh");
        });
        it("PUT /lockers:id", async function() {
            console.log("Bouh");
        });
        it("DELETE /lockers:id", async function() {
            console.log("Bouh");
        });
    });
});