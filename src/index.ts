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

async function main() {
    await sequelize.sync({force: true});
    console.log("All models were synchronized successfully.");

    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}

export { main, app, sequelize };