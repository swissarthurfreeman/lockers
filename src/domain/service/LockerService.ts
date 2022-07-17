import { Locker } from "../model/Locker";
import { Location } from "../model/Location";
import { sequelize } from "./../../index";

abstract class LockerService {
    public static async create(locker: Locker) {
        try {
            // returns last return value of nested callback.
            return await sequelize.transaction(async (t) => {
                const location = await Location.findByPk(locker.locationId);
                if(location == null) {
                    return "Specified Location Does Not Exist";
                } else {
                    const createdLocker = await locker.save({transaction: t});
                    return createdLocker;
                }
            });
        } catch(err) {
            console.log(err);   // TODO : yield more verbose errors via DUP_ENTRY sql code.
            return err.message;
        }
    }
}

export { LockerService };