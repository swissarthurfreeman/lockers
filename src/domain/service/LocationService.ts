import { sequelize } from "../../index";
import { Location } from "../model/Location";

abstract class LocationService {
    public static async create(location: Location) {
        try {
            return await sequelize.transaction(async (t) => {
                const createdLocation = await location.save({transaction: t});
                console.log("Created Location =", createdLocation);
                return createdLocation;
            });
        } catch(err) {
            console.log(err);
            return err.message; // To Do : configure error codes, messages etc...
        }
    }
}

export { LocationService };