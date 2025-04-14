import express from 'express';
import { getAllFuncionarios, createFuncionario, getFuncionarioById, updateFuncionario, deleteFuncionario } from '../controllers/funcionarioController.js';

const funcionarioRouter = express.Router();

funcionarioRouter.route('/funcionario')
    .get(getAllFuncionarios)
    .post(createFuncionario);

funcionarioRouter.route('/funcionario/:id')
    .get(getFuncionarioById)
    .put(updateFuncionario)
    .delete(deleteFuncionario);

export default funcionarioRouter;