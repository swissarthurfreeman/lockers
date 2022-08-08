
import { Locker } from "../domain/model/Locker";
import { LockerService } from "../domain/service/LockerService";
import { Location } from "../domain/model/Location";
import { LocationService } from "../domain/service/LocationService";
import { Contract } from "../domain/model/Contract";
import { ContractService } from "../domain/service/ContractService";

const fs = require('fs');
const csv = require('csv-parser');

function uploadLocations(locationsPath: string) {
    fs.createReadStream(locationsPath)
        .pipe(csv())
        .on('data', (loca: any) => {
            const builtLoca: Location = Location.build(loca);
            console.log(builtLoca);
            LocationService.create(builtLoca)
            .then((loca) => { console.log("Saved location to db"); })
            .catch((err) => { console.log("Error saving location", err ); });
        });
}

function uploadLockers(lockersPath: string) {
    fs.createReadStream(lockersPath)
        .pipe(csv())
        .on('data', (locker: any) => {
            const builtLocker: Locker = Locker.build(locker);
            LockerService.create(builtLocker)
            .then((loc) => {})
            .catch((err) => { console.log("Error saving locker", err ); });
        });

}
function uploadContracts(contractsPath: string) {
    fs.createReadStream(contractsPath)
        .pipe(csv())
        .on('data', (contr: any) => {
            const builtContr: Contract = Contract.build(contr);
            ContractService.create(builtContr)
            .then((loc) => {})
            .catch((err) => { 
                try {
                    if(err.errors[0].type != 'unique violation') {
                        console.log(err.errors);
                    }
                } catch(a) {
                    console.log(err);
                }
                
            });
        });
}

export { uploadLocations, uploadLockers, uploadContracts };
