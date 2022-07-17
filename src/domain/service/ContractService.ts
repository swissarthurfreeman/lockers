import { Locker } from "../model/Locker";
import { Contract } from "../model/Contract";
import { sequelize } from "./../../index";

abstract class ContractService {
    public static async create(contract: Contract) {
        // returns last return value of nested callback, if rejected throws an error.
        return await sequelize.transaction(async (t) => {
            return contract.save({transaction: t});
        }).then((createdContract) => {
            return Contract.findByPk(createdContract.lockerId, { include: Locker });
        });
    }
}

export { ContractService };