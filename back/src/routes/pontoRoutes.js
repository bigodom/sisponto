import express from 'express';
import { getAllPontos, createPonto, getPontoById, updatePonto, deletePonto, getPontoByFuncionarioId, incrementarImpressoes } from '../controllers/pontoController.js';

const pontoRouter = express.Router();

pontoRouter.route('/ponto')
    .get(getAllPontos)
    .post(createPonto)

pontoRouter.route('/ponto/:id')
    .get(getPontoById)
    .put(updatePonto)
    .delete(deletePonto)

pontoRouter.route('/ponto/funcionario/:id')
    .get(getPontoByFuncionarioId)

pontoRouter.route('/ponto/:id/incrementar-impressoes')
    .put(incrementarImpressoes)

export default pontoRouter;
