import { Locker } from "../model/Locker";
import { Location } from "../model/Location";
import { LocationService } from "./LocationService";
import { sequelize } from "../../index";
import Sequelize from "sequelize/types/sequelize";

abstract class LockerService {

    public static getAll(): Promise<Locker[]> {
        return Locker.findAll();
    }

    public static getById(lockerId: string): Promise<Locker> {
        return Locker.findByPk(lockerId);
    }

    public static async create(locker: Locker) {
        // TODO : check location exists
        // TODO : wrap in transaction
        // the return value is wrapped in the promise returned by outer then (waits for resolution)
        const location = await LocationService.getById(locker.id);
        if(location != undefined) {
            const savedLocker = await sequelize.transaction(async (t) => {
                return await locker.save({transaction: t});
            });
            return savedLocker;
        } else {
            return "Specified Location Does Not Exist";
        }
    }
}

export { LockerService };