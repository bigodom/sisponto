import prisma from "../services/databaseClient.js";

export const getAllPontos = async (req, res) => {
    /*  #swagger.tags = ['Ponto']
    #swagger.description = 'Endpoint to get all pontos.' */
    try {
        const pontos = await prisma.ponto.findMany();
        res.json(pontos);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const createPonto = async (req, res) => {
    /*  #swagger.tags = ['Ponto']
    #swagger.description = 'Endpoint to create ponto.' */
    const { funcionarioId, data, entrada, saida } = req.body;

    try {
        // Verificação se o funcionário existe
        const funcionario = await prisma.funcionario.findUnique({
            where: { id: funcionarioId },
        });

        if (!funcionario) {
            return res.status(400).json({ error: 'Funcionário não encontrado' });
        }

        // Criação do ponto
        const ponto = await prisma.ponto.create({
            data: { funcionarioId, data, entrada, saida },
        });

        res.status(201).json(ponto);
    } catch (error) {
        // Tratamento de outros erros
        res.status(500).json({ error: 'Erro no servidor' });
    }
}

export const getPontoById = async (req, res) => {
    /*  #swagger.tags = ['Ponto']
    #swagger.description = 'Endpoint to get ponto by id.' */
    const { id } = req.params;
    try {
        const ponto = await prisma.ponto.findUnique({
            where: { id: Number(id) },
        });

        if (!ponto) {
            return res.status(404).json({ error: 'Ponto não encontrado' });
        }

        res.json(ponto);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updatePonto = async (req, res) => {
    /*  #swagger.tags = ['Ponto']
    #swagger.description = 'Endpoint to update ponto.' */
    const { id } = req.params;
    const { funcionarioId, data, entrada, saida } = req.body;

    try {
        // Verificação se o ponto existe
        const ponto = await prisma.ponto.findUnique({
            where: { id: Number(id) },
        });

        if (!ponto) {
            return res.status(404).json({ error: 'Ponto não encontrado' });
        }

        // Atualização do ponto
        const updatedPonto = await prisma.ponto.update({
            where: { id: Number(id) },
            data: { funcionarioId, data, entrada, saida },
        });

        res.json(updatedPonto);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deletePonto = async (req, res) => {
    /*  #swagger.tags = ['Ponto']
    #swagger.description = 'Endpoint to delete ponto.' */
    const { id } = req.params;

    try {
        // Verificação se o ponto existe
        const ponto = await prisma.ponto.findUnique({
            where: { id: Number(id) },
        });

        if (!ponto) {
            return res.status(404).json({ error: 'Ponto não encontrado' });
        }

        // Exclusão do ponto
        await prisma.ponto.delete({
            where: { id: Number(id) },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getPontoByFuncionarioId = async (req, res) => {
    /*  #swagger.tags = ['Ponto']
    #swagger.description = 'Endpoint to get ponto by funcionarioId.' */
    const { funcionarioId } = req.params;
    try {
        const pontos = await prisma.ponto.findMany({
            where: { funcionarioId: Number(funcionarioId) },
        });

        if (!pontos) {
            return res.status(404).json({ error: 'Pontos não encontrados' });
        }

        res.json(pontos);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}