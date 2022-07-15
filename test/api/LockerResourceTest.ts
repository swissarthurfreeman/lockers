import { expect } from "chai";
import request from "supertest";
import { describe, it } from "mocha";
import { app } from "../../src/index";

describe("GET /", () => {
    it("queries root endpoint", async function() {
        const res = await request(app).get('/');
        expect(res.status).to.equal(200);
        console.log(res);
        expect(res.text).to.equal('Hello World');
        console.log("Successfuly ran GET /");
    });
});