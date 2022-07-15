import express from "express";
import { Sequelize, DataTypes, Model } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    password: 'test',
    username: 'root',
    database: 'lockers',
    port: 3306
});

console.log("Hello World");
const app = express();
const port = 8080;

const User = sequelize.define('User', {
    firstName: {  // Model attributes are defined here
        type: DataTypes.STRING,
        allowNull: false // allowNull defaults to true
    },
    lastName: {
        type: DataTypes.STRING
    }
})

async function main() {
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");

    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}

app.get("/", async (req, res) => {
    const user = await User.create({"firstName": "Steve", "lastName": "Rody"});
    res.send(user);
});


main();

export { app };