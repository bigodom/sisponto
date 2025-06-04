import prisma from "../services/databaseClient.js";

export const getAllPontos = async (req, res) => {
    /*  #swagger.tags = ['Ponto']
    #swagger.description = 'Endpoint to get all pontos.' */
    try {
        const pontos = await prisma.ponto.findMany({
            include: {
              funcionario: true,
            },
          });
          
        res.json(pontos);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const createPonto = async (req, res) => {
    /*  #swagger.tags = ['Ponto']
    #swagger.description = 'Endpoint to create ponto.' */
    const { usuario, dataInicio, dataFim, idFuncionario } = req.body;

    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { id: idFuncionario },
        });

        if (!funcionario) {
            return res.status(400).json({ error: 'Funcionário não encontrado' });
        }

        const ponto = await prisma.ponto.create({
            data: {
                usuario,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim),
                idFuncionario,
                impressoes: 0, // Inicializa com 0 impressões
            },
        });

        res.status(201).json(ponto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
};

export const incrementarImpressoes = async (req, res) => {
    /*  #swagger.tags = ['Ponto']
    #swagger.description = 'Endpoint to increment impressoes count.' */
    const { id } = req.params;

    try {
        const ponto = await prisma.ponto.findUnique({
            where: { id: Number(id) },
        });

        if (!ponto) {
            return res.status(404).json({ error: 'Ponto não encontrado' });
        }

        const updatedPonto = await prisma.ponto.update({
            where: { id: Number(id) },
            data: {
                impressoes: ponto.impressoes + 1
            },
        });

        res.json(updatedPonto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
};

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
    const { usuario, dataInicio, dataFim, idFuncionario, impressoes } = req.body;

    try {
        const ponto = await prisma.ponto.findUnique({
            where: { id: Number(id) },
        });

        if (!ponto) {
            return res.status(404).json({ error: 'Ponto não encontrado' });
        }

        const updatedPonto = await prisma.ponto.update({
            where: { id: Number(id) },
            data: {
                usuario,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim),
                idFuncionario,
                impressoes: impressoes !== undefined ? impressoes : ponto.impressoes,
            },
        });

        res.json(updatedPonto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
};

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
    const { id } = req.params;
    try {
        const pontos = await prisma.ponto.findMany({
            where: { idFuncionario: Number(id) },
            include: {
                funcionario: true
            }
        });

        if (!pontos || pontos.length === 0) {
            return res.status(404).json({ error: 'Pontos não encontrados' });
        }

        res.json(pontos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}