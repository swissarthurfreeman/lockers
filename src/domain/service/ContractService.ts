import { Locker } from "../model/Locker";
import { Contract } from "../model/Contract";
import { sequelize } from "./../../index";
import { config } from "../../../Config";

abstract class ContractService {
    public static async create(contract: Contract) {
        // returns last return value of nested callback, if rejected throws an error.
        return await sequelize.transaction(async (t) => {
            return contract.save({transaction: t});
        }).then((createdContract) => {
            return Contract.findByPk(createdContract.lockerId, { include: Locker });
        });
    }

    /**
     * Get the status of a contract based on it's expiration.
     */
    public static status(of: Contract, now: Date = new Date()): string {
        const contractExpirationDate = ContractService.getExpirationDate();
        const contractRenewalDeadline = new Date(contractExpirationDate.getFullYear().toString() + config.contractRenewalDeadline);
        console.log("\n\n\n RESOLVING STATUS \n\n\n");
        if(now <= contractExpirationDate) {      // if this year's renewal window hasn't passed

            if(of.expiration.getFullYear() < contractExpirationDate.getFullYear())
                return "Breached";
            else
                return "Occupied";

        } else if (contractExpirationDate < now 
            && now < contractRenewalDeadline) {    // if we're in renewal window
        
            if(of.expiration.getFullYear() == contractExpirationDate.getFullYear())
                return "NonRenewed"
            
            else if(of.expiration.getFullYear() > contractExpirationDate.getFullYear())
                return "Occupied";
            
            else 
                return "Breached";
        
        } else { // if we're outside this year's renewal window
            if(of.expiration.getFullYear() <= now.getFullYear())
                return "Breached";
            else
                return "Occupied";
        }
    }

    /**
     * Get the expiration date for a new contract created now.
     * @returns the resolved expiration date. 
     */
    public static getExpirationDate(now: Date = new Date()): Date {
        const contractExpirationDate = new Date((new Date().getFullYear()).toString() + config.contractExpirationDate);
        const contractRenewalDeadline = new Date((new Date().getFullYear()).toString() + config.contractRenewalDeadline);
        
        if(contractRenewalDeadline <= now || 
            (contractExpirationDate <= now && now <= contractRenewalDeadline)) {
            const nextYear = new Date().getFullYear() + 1;
            return new Date(nextYear.toString() + config.contractExpirationDate);
        } else if(now < contractExpirationDate) {
            const currYear = new Date().getFullYear();
            return new Date(currYear.toString() + config.contractExpirationDate);
        }
    }
}

export { ContractService };