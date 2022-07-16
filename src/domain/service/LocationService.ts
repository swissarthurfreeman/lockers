import { Location } from "../model/Location";


abstract class LocationService {

    public static getAll(): Promise<Location[]> {
        return Location.findAll();
    }

    public static getById(locationId: string): Promise<Location> {
        return Location.findByPk(locationId);
    }

    public static create(location: Location): Promise<Location> {
        // TODO : check location exists
        // TODO : wrap in transaction
        const newLocker = location.save();    
        return newLocker;
    }
}

export { LocationService };