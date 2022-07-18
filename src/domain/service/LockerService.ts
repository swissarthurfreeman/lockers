import { Locker } from "../model/Locker";
import { Location } from "../model/Location";
import { sequelize } from "./../../index";
import { Contract } from "../model/Contract";

abstract class LockerService {
    public static async create(locker: Locker) {
        // returns last return value of nested callback.
        return await sequelize.transaction(async (t) => {
            const location = await Location.findByPk(locker.locationId);
            if(location == null) {
                throw new Error("Specified Location does not exist");
            } else {
                const createdLocker = await locker.save({transaction: t});
                return createdLocker;
            }
        });
    }
    
    public static async update(lockerId: string, to: any) {
        return await sequelize.transaction(async (t) => {
            const lockerToUpdate = await Locker.findByPk(lockerId);
            if(lockerToUpdate == null) {
                throw new Error("Specified Locker does not exist");
            } else {
                lockerToUpdate.set(to);
                const updatedLocker = await lockerToUpdate.save({transaction: t});
                return updatedLocker;
            }
        });
    }

    public static async destroy(lockerId: string) {
        return await sequelize.transaction(async (t) => {
            const lockerToDestroy = await Locker.findByPk(lockerId);
            if(lockerToDestroy == null) {
                throw new Error("Locker does not exist");
            } else {
                const contract = await Contract.findByPk(lockerId);
                if(contract == null) {
                    await lockerToDestroy.destroy();
                } else {
                    throw new Error("Locker has a contract attached, delete the contract first");
                }
            }
        });
    };
}

export { LockerService };