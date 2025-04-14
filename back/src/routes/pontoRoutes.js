import express from 'express';
import { getAllPontos, createPonto, getPontoById, updatePonto, deletePonto, getPontoByFuncionarioId } from '../controllers/pontoController.js';

const pontoRouter = express.Router();

pontoRouter.route('/ponto')
    .get(getAllPontos)
    .post(createPonto)

pontoRouter.route('/ponto/:id')
    .get(getPontoById)
    .put(updatePonto)
    .delete(deletePonto)
    .get(getPontoByFuncionarioId)

export default pontoRouter;
