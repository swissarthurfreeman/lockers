import express from "express";

console.log("Hello World");
const app = express();
const port = 8081;

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

export { app };