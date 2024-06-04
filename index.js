import bodyParser from "body-parser";
import express from "express";
import router from "./src/routes/routes.js";
import multer from "multer";

const server = express();
server.set('view engine', 'ejs');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const upload = multer();
server.use(upload.any());

server.use('/', router);

server.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
