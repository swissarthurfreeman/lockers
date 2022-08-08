import express from "express";
import winston from "winston";
import { Sequelize } from "sequelize-typescript";
import { Contract } from "./domain/model/Contract";
import { Locker } from "./domain/model/Locker";
import { Location } from "./domain/model/Location";
import { LockerRouter } from "./api/rest/LockerRouter";
import { LocationRouter } from "./api/rest/LocationRouter";
import { ContractRouter } from "./api/rest/ContractRouter";
import { config } from "../Config";
import { ConfigureHeadersMiddleware } from "./middleware/ConfigureHeaders";
import { StopUserIllegalActions } from "./middleware/StopUserIllegalActions";
import cors from "cors";
import { uploadContracts, uploadLocations, uploadLockers } from "./utils/readCsv";

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: config.sqlConfig.host,
    password: config.sqlConfig.password,
    username: config.sqlConfig.user,
    database: config.sqlConfig.database,
    port: config.sqlConfig.port,
    models: [Contract, Location, Locker],
    logging: false
});

const app = express();
const port = 8080;

app.use(cors())
app.use(express.json());                        // tells express to parse bodies as json
app.use('*', ConfigureHeadersMiddleware);       // configure req.headers.group, email lastname...
app.use('*', StopUserIllegalActions);           // enforce the following rules on users :
app.use('/locations', LocationRouter);          // user can only get locations
app.use('/lockers', LockerRouter);              // user can only get lockers
app.use('/contracts', ContractRouter);          // user can only update expiration in renewal window

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/info.log', level: 'info' })
    ]
});

if(config.id === 'test'  || config.id === 'dev') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

if(config.id != 'test') {
    main();
}

async function main() {
    if(config.id === 'test' || config.id === 'dev') {
        await sequelize.sync({ alter: true }); 
    }
    if(config.id === 'production') {
        await sequelize.sync({ alter: true });    // try to alter, may crash if changes are too large
        
    }
    if(config.id === 'dev') {   // default data for development
        //uploadLocations('/home/gordon/Documents/Mandat Casiers/lockers/locations.csv');
        //uploadLockers('/home/gordon/Documents/Mandat Casiers/lockers/lockers.csv');
        uploadContracts('/home/gordon/Documents/Mandat Casiers/lockers/contracts.csv');
        /*Location.create({site: 'Sciences', name: 'EPA'});
        Location.create({site: 'Sciences', name: 'scIII'});
        Location.create({site: 'Battelle', name: 'Hall'});
        Locker.create({
            "number": 1, 
            "verticalPosition": "En haut",
            "lock": false,
            "locationId":1,
            "dimensions": "100/50/80"
        });
        Locker.create({
            "number": 5, 
            "verticalPosition": "En bas",
            "lock": true,
            "locationId":1,
            "dimensions": "100/50/80"
        });
        Locker.create({
            "number": 22, 
            "verticalPosition": "mi-hauteur",
            "lock": true,
            "locationId":1,
            "dimensions": "100/50/80"
        }).then((locker) => {
            Contract.create({
                lockerId: locker.lockerId,
                firstname: "Breach",
                lastname: "Wayne",
                email: "gordon@gotham.pd.us",
                expiration: '2022-05-15'
            });
        });
        Locker.create({
            "number": 30, 
            "verticalPosition": "mi-hauteur",
            "lock": true,
            "locationId":1,
            "dimensions": "100/50/80"
        }).then((locker) => {
            Contract.create({
                lockerId: locker.lockerId,
                firstname: "Mark",
                lastname: "Walter",
                email: "Walter.Mart@Marty.Who",
                expiration: ContractService.getExpirationDate()
            });
        });
        Locker.create({
            "number": 31, 
            "verticalPosition": "mi-hauteur",
            "lock": true,
            "locationId":1,
            "dimensions": "100/50/80"
        }).then((locker) => {
            Contract.create({
                lockerId: locker.lockerId,
                firstname: "John",
                lastname: "Doe",
                email: "John.Doe@Doe.co",
                expiration: ContractService.getExpirationDate()
            });
        });*/
    }
    logger.info("All models were synchronized successfully.");

    app.listen(port, () => {
        logger.info(`Server started at http://localhost:${port}`);
    });
}

export { main, app, sequelize, logger };