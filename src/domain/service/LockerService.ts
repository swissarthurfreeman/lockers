import { Locker } from "../model/Locker";
import { Location } from "../model/Location";
import { sequelize } from "./../../index";

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
}

export { LockerService };