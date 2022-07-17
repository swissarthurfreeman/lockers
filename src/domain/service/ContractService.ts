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
        const contractExpirationDate = of.expiration;
        const contractRenewalDeadline = new Date(contractExpirationDate.getFullYear().toString() + config.contractRenewalDeadline);

        if(now <= contractExpirationDate) {
            return "Occupied";
        } else if (contractExpirationDate < now 
            && now < contractRenewalDeadline) {    // if we're in renewal window
            return "NonRenewed"
        } else { // if we're outside contract renewal window or not before that, it's a breach.
            return "Breached";
        }
    }

    /**
     * Get the expiration date for a new contract created now.
     * @returns the resolved expiration date. 
     */
    public static getExpirationDate(now: Date = new Date()): Date {
        const contractExpirationDate = new Date((now.getFullYear()).toString() + config.contractExpirationDate);
        const contractRenewalDeadline = new Date((now.getFullYear()).toString() + config.contractRenewalDeadline);
        
        if(contractRenewalDeadline <= now || 
            (contractExpirationDate <= now && now <= contractRenewalDeadline)) {
            const nextYear = now.getFullYear() + 1;
            return new Date(nextYear.toString() + config.contractExpirationDate);
        } else if(now < contractExpirationDate) {
            const currYear = now.getFullYear();
            return new Date(currYear.toString() + config.contractExpirationDate);
        }
    }
}

export { ContractService };