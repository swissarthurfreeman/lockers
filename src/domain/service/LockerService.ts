import { Locker } from "../model/Locker";
import { Location } from "../model/Location";
import { sequelize } from "./../../index";
import { Contract } from "../model/Contract";

abstract class LockerService {
    public static async create(locker: Locker): Promise<Locker> {
        // returns last return value of nested callback.
        return sequelize.transaction(async (t) => {
            const location = await Location.findByPk(locker.locationId);
            if(location == null) {
                throw new Error("Specified Location does not exist");
            } else { 
                return locker.save({transaction: t});
            }
        });
    }
    
    public static async update(lockerId: string, to: any): Promise<Locker> {
        return sequelize.transaction(async (t) => {
            const lockerToUpdate = await Locker.findByPk(lockerId);
            if(lockerToUpdate == null) {
                throw new Error("Specified Locker does not exist");
            } else {
                lockerToUpdate.set(to);
                return lockerToUpdate.save({transaction: t});
            }
        });
    }

    public static async destroy(lockerId: string): Promise<void> {
        return sequelize.transaction(async (t) => {
            const lockerToDestroy = await Locker.findByPk(lockerId);
            if(lockerToDestroy == null) {
                throw new Error("Locker does not exist");
            } else {
                const contract = await Contract.findByPk(lockerId);
                if(contract == null) {
                    return lockerToDestroy.destroy();
                } else {
                    throw new Error("Locker has a contract attached, delete the contract first");
                }
            }
        });
    }
}

export { LockerService };