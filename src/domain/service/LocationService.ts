import { sequelize } from "../../index";
import { Location } from "../model/Location";

abstract class LocationService {
    public static async create(location: Location) {
        return await sequelize.transaction(async (t) => {
            const createdLocation = await location.save({transaction: t});
            return createdLocation;
        });
    }
}

export { LocationService };