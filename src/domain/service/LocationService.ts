import { sequelize } from "../../index";
import { Location } from "../model/Location";
import { Locker } from "../model/Locker";

abstract class LocationService {
    public static async create(location: Location): Promise<Location> {
        return sequelize.transaction(async (t) => {
            const createdLocation = await location.save({transaction: t});
            return createdLocation;
        });
    }

    public static async update(locationId: string, to: any): Promise<Location> {
        return sequelize.transaction(async (t) => {
            const loc = await Location.findByPk(locationId, {transaction: t});
            if(loc == null) {
                throw new Error("Specified Location does not exist");
            } else {
                const updatedLoc = await loc.update(to);
                return updatedLoc;
            }
        });
    }

    public static async delete(locationId: string): Promise<void> {
        return sequelize.transaction(async (t) => {
            const location = await Location.findByPk(locationId, {transaction: t});
            if(location == null) {
                return;
            } else {
                const locker = await Locker.findOne({where: {locationId: locationId}, transaction:t});
                if(locker == null) {
                    return location.destroy({transaction: t});
                } else {
                    throw new Error("Location specified still has lockers");
                }
            }
        });
    }
}

export { LocationService };