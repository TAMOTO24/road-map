import express from 'express';
import { getBoards } from './controller/boardController';

const routes = express.Router();

routes.get('/', getBoards);

export default routes;