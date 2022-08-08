
import { Locker } from "../domain/model/Locker";
import { LockerService } from "../domain/service/LockerService";
import { Location } from "../domain/model/Location";
import { LocationService } from "../domain/service/LocationService";
import { Contract } from "../domain/model/Contract";
import { ContractService } from "../domain/service/ContractService";
import { faker } from "@faker-js/faker";
import { ReadStream } from "fs";

const fs = require('fs');
const csv = require('csv-parser');

function uploadLocations(locationsPath: string): ReadStream {
    return fs.createReadStream(locationsPath)
        .pipe(csv())
        .on('data', (loca: any) => {
            const builtLoca: Location = Location.build(loca);
            LocationService.create(builtLoca)
            .catch((err) => { 
                if(err.name != 'SequelizeUniqueConstraintError') {
                    console.log("Error saving location", err );
                }
            });
        });
}

function uploadLockers(lockersPath: string): ReadStream {
    return fs.createReadStream(lockersPath)
        .pipe(csv())
        .on('data', (locker: any) => {
            const builtLocker: Locker = Locker.build(locker);
            LockerService.create(builtLocker)
            .catch((err) => { 
                if(err.name != 'SequelizeUniqueConstraintError') {
                    console.log("Error saving locker", err ); 
                }
            });
        });

}

function uploadContracts(contractsPath: string): ReadStream {
    return fs.createReadStream(contractsPath)
        .pipe(csv())
        .on('data', (contr: any) => {
            const builtContr: Contract = Contract.build(contr);
            ContractService.create(builtContr)
            .catch((err) => {
                if(err.name != 'SequelizeUniqueConstraintError' && err.message != 'Locker does not exist') {
                    console.log("Error saving contract", err );
                }
            });
        });
}


function uploadAnonContracts(contractsPath: string): ReadStream {
    return fs.createReadStream(contractsPath)
        .pipe(csv())
        .on('data', (contr: any) => {
            contr.firstname = faker.name.firstName();
            contr.lastname = faker.name.lastName();
            contr.email = faker.internet.email();
            contr.phone_number = faker.phone.number('+41 ## ### ## ##');
            const builtContr: Contract = Contract.build(contr);
            ContractService.create(builtContr)
            .catch((err) => { 
                if(err.name != 'SequelizeUniqueConstraintError' && err.message != 'Locker does not exist') {
                    console.log(err);
                    console.log("Error saving contract", err );
                }
            });
        });
}

function populateProdDb(locationsPath: string, lockersPath: string, contractsPath: string) {
    uploadLocations(locationsPath)
    .on('end', () => {
        console.log('Uploading Locations done, uploading lockers...');
        uploadLockers(lockersPath)
        .on('end', () => {
            console.log('Uploading Lockers done, uploading contracts...');
            uploadContracts(contractsPath)
            .on('end', () => {
                console.log('Uploading Contracts done');    
            })
        })
    })
}

export { populateProdDb, uploadAnonContracts, uploadLocations, uploadLockers };
