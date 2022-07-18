import { expect } from "chai";
import request from "supertest";
import { describe, it } from "mocha";
import { app } from "../../src/index";
import { Locker } from "../../src/domain/model/Locker";
import {Location} from "../../src/domain/model/Location";

describe("Locker REST Resource Endpoints Tests", async () => {
    describe("/lockers endpoint test", () => {
        it("POST /lockers, Should POST a locker", async () => {
            console.log("Bouh");
        });

        it("GET /lockers, should return all lockers", async () => {
            console.log("Bouh");
        });

        it("GET /lockers?site=Sciences, should return all lockers at site", async () => {
            console.log("Bouh");
        });
    });
});