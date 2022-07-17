import { Locker } from "../model/Locker";
import { Contract } from "../model/Contract";
import { sequelize } from "./../../index";

abstract class ContractService {
    public static async create(contract: Contract) {
        try {
            // returns last return value of nested callback.
            return await sequelize.transaction(async (t) => {
                const createdContract = await contract.save({transaction: t});
                console.log("Created Contract =", createdContract);
                return createdContract;
                
            });
        } catch(err) {
            console.log(err);   // TODO : yield more verbose errors via DUP_ENTRY sql code.
            return err.message;
        }
    }
}

export { ContractService };