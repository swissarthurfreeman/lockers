import express from "express";
import { Sequelize } from "sequelize-typescript";
import { Contract } from "./domain/model/Contract";
import { Locker } from "./domain/model/Locker";
import { Location } from "./domain/model/Location";
import { LockerRouter } from "./api/rest/LockerRouter";
import { LocationRouter } from "./api/rest/LocationRouter";
import { ContractRouter } from "./api/rest/ContractRouter";
import { config } from "../Config";
import { ConfigureHeadersMiddleware } from "./middleware/ConfigureHeaders";
import winston from "winston";

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

app.use(express.json());    // tells express to parse bodies as json
app.use('*', ConfigureHeadersMiddleware);
app.use('/lockers', LockerRouter);
app.use('/locations', LocationRouter);
app.use('/contracts', ContractRouter);

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/info.log', level: 'info' })
    ]
});

if(config.id == 'test'  || config.id == 'dev') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

if(config.id != 'test') {
    main();
}

async function main() {
    await sequelize.sync({force: true});
    logger.info("All models were synchronized successfully.");

    app.listen(port, () => {
        logger.info(`Server started at http://localhost:${port}`);
    });
}

export { main, app, sequelize, logger };