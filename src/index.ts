import express from "express";
import { Sequelize } from "sequelize-typescript";
import { Contract } from "./domain/model/Contract";
import { Locker } from "./domain/model/Locker";
import { User } from "./domain/model/User";
import { Location } from "./domain/model/Location";

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    password: 'test',
    username: 'root',
    database: 'lockers',
    port: 3306,
    models: [User, Contract, Location, Locker]
});


console.log("Hello World");
const app = express();
const port = 8080;

async function main() {
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
    await User.create({"firstname": "Stéfave", "lastname": "Rody", "email": "lol@gmail.com"});
    await User.create({"firstname": "Jean", "lastname": "Pittet", "email": "test@uge.com"});
    const loc = await Location.create({
        site: "Sciences",
        name: "Sciences-III"
    });
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