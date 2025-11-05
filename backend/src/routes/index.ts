import express from "express";
import BoardRoute from "./board";
import CardRoute from "./cards";

const routes = express.Router();

routes.use("/boards", BoardRoute);
routes.use("/cards", CardRoute);

export default routes;