import express from "express";
import router from "./src/routes/routes.js";


const server = express();
server.set('view engine', 'ejs');

server.get('/', (req, res) => {
    res.send("Welcome to polling API");
})


server.listen(3000, () => {
    console.log("Server is listening on port 3000");
})


