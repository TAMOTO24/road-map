import express from "express";
import BoardRoute from "./board";
import CardRoute from "./cards";

const routes = express.Router();

routes.use(BoardRoute);
routes.use(CardRoute);

export default routes;
