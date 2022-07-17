import { expect } from "chai";
import { describe, it } from "mocha";
import { Contract } from "../../src/domain/model/Contract";
import { ContractService } from "../../src/domain/service/ContractService";
import { config } from "../../Config"

describe("Contract Service Tests", () => {
    describe("Test getExpirationDate() function", async () => {
        it("Should return the correct expiration date", () => {
            expect(ContractService.getExpirationDate(new Date('2020-01-10')).toString())    // creating a contract in January 2020 yields
                .equal(new Date('2020' + config.contractExpirationDate).toString());        // expiration date at the next year
            
            expect(ContractService.getExpirationDate(new Date('2020-10-10')).toString())    // creating a contract in November 2020 yields    
                .equal(new Date('2021' + config.contractExpirationDate).toString())         // expiration date at the next year

            expect(ContractService.getExpirationDate(new Date('2020-06-20')).toString())    // creating a contract the 20th of June yields    
                .equal(new Date('2021' + config.contractExpirationDate).toString())         // an expiration date at next year.
        });
    });

    describe("Test status(contract) function", async () => {
        const oldContract = Contract.build({
            lockerId: "7b055b22-3023-4739-a640-21d50f9df44c",
            firstname: "Ste",
            lastname: "Ven",
            email: "john.doe@gmail.com",
            expiration: new Date('2020'+config.contractExpirationDate)
        });
        
        const validContract = Contract.build({
            lockerId: "7b055b23-3023-4739-a640-21d50f9df44c",
            firstname: "Am",
            lastname: "En",
            email: "john.doe@amen.com",
            expiration: ContractService.getExpirationDate()
        });

        const expirationYear: string = oldContract.expiration.getFullYear().toString();

        it("Should return Occupied Status", () => {
            expect(ContractService.status(validContract)).equal("Occupied");
            expect(ContractService.status(oldContract, new Date(expirationYear+'-01-05'))).equal("Occupied");
        });

        it("Should return NonRenewed Status", () => {
            expect(ContractService.status(oldContract, new Date(expirationYear+'-05-16'))).equal("NonRenewed");
            expect(ContractService.status(oldContract, new Date(expirationYear+'-06-20'))).equal("NonRenewed");   // contract status in renewal window is NonRenewed.
            expect(ContractService.status(oldContract, new Date(expirationYear+'-06-29'))).equal("NonRenewed");
        });

        it("Should return Breached Status", () => {
            expect(ContractService.status(oldContract, new Date(expirationYear+'-07-13'))).equal("Breached");     // contract status outside renewal window is Breached.
            expect(ContractService.status(oldContract, new Date(expirationYear+'-12-25'))).equal("Breached");
        });
    });
});