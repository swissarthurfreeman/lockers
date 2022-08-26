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
import { populateProdDb, uploadAnonContracts, uploadLocations, uploadLockers } from "./utils/readCsv";

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

app.use(cors({origin: true}))
app.use(express.json());                        // tells express to parse bodies as json
app.use('*', ConfigureHeadersMiddleware);       // configure req.headers.group, email lastname...
app.use('*', StopUserIllegalActions);           // enforce the following rules on users :
app.use('/locations', LocationRouter);          // user can only get locations
app.use('/lockers', LockerRouter);              // user can only get lockers
app.use('/contracts', ContractRouter);          // user can only update expiration in renewal window

app.get('/whoami', (req, res) => {
    res.send({ 
        'group': req.headers.group || 'user', 
        'lastname': req.headers.lastname, 
        'firstname': req.headers.firstname,
        'email': req.headers.email
    })
})

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/info.log', level: 'info' })
    ]
});

if(config.id === 'dev') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

if(config.id != 'test') {
    main();
}

async function main() {

    if(config.id === 'test' || config.id === 'dev') {
        await sequelize.sync({ force: true });  // to reset for tests/dev
        logger.info("All models were synchronized successfully.");

        uploadLocations(config.sqlConfig.locationsCsvPath)
            .on('end', () => {
                logger.info('Uploading Locations done, uploading lockers...');
                uploadLockers(config.sqlConfig.lockersCsvPath)
                .on('end', () => {
                    logger.info('Uploading Lockers done, uploading Anonymised contracts...');
                    uploadAnonContracts(config.sqlConfig.contractsCsvPath)
                    .on('end', () => {
                        logger.info("Database successfully uploaded.");
                        app.listen(port, () => {
                            logger.info(`Server started at http://localhost:${port}`);
                        });
                    });
                });
            });
    }

    if(config.id === 'production') {
        await sequelize.sync({ alter: true });
        
        app.listen(port, () => {
            logger.info(`Server started at http://localhost:${port}`);
        });
    }
}

export { main, app, sequelize, logger };