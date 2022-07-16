import express from "express";
import { Sequelize } from "sequelize-typescript";
import { Contract } from "./domain/model/Contract";
import { Locker } from "./domain/model/Locker";
import { User } from "./domain/model/User";
import { Location } from "./domain/model/Location";
import { LockerRouter } from "./api/rest/LockerRouter";
import { LocationRouter } from "./api/rest/LocationRouter";

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    password: 'test',
    username: 'root',
    database: 'lockers',
    port: 3306,
    models: [User, Contract, Location, Locker]
});

const app = express();
const port = 8080;

app.use(express.json());    // tells express to parse bodies as json
app.use('/lockers', LockerRouter);
app.use('/locations', LocationRouter);

async function main() {
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");

    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}

app.get("/", async (req, res) => {
    const users = await User.findAll();
    res.send(users);
});

main();

export { app, sequelize };