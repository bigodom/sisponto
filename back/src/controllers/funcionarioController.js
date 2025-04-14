import prisma from "../services/databaseClient.js";

export const getAllFuncionarios = async (req, res) => {
    /*  #swagger.tags = ['Funcionário']
    #swagger.description = 'Endpoint to get all funcionarios.' */
    try {
        const funcionarios = await prisma.funcionario.findMany();
        res.json(funcionarios);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const createFuncionario = async (req, res) => {
    /*  #swagger.tags = ['Funcionário']
    #swagger.description = 'Endpoint to create funcionario.' */
    const { chapa, nome, departamento, funcao, coligada } = req.body;

    try {
        // Criação do funcionário
        const funcionario = await prisma.funcionario.create({
            data: { chapa, nome, departamento, coligada, funcao, desligado: false },
        });

        res.status(201).json(funcionario);
    } catch (error) {
        // Tratamento de outros erros
        res.status(500).json({ error: error.message });
    }
}

export const getFuncionarioById = async (req, res) => {
    /*  #swagger.tags = ['Funcionário']
    #swagger.description = 'Endpoint to get funcionario by id.' */
    const { id } = req.params;
    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { id: Number(id) },
        });

        if (!funcionario) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        res.json(funcionario);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateFuncionario = async (req, res) => {
    /*  #swagger.tags = ['Funcionário']
    #swagger.description = 'Endpoint to update funcionario.' */
    const { id } = req.params;
    const { chapa, nome, departamento, cargo, coligada } = req.body;

    try {
        const funcionario = await prisma.funcionario.update({
            where: { id: Number(id) },
            data: { chapa, nome, departamento, cargo, coligada },
        });

        res.json(funcionario);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deleteFuncionario = async (req, res) => {
    /*  #swagger.tags = ['Funcionário']
    #swagger.description = 'Endpoint to delete funcionario.' */
    const { id } = req.params;
    try {
        await prisma.funcionario.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
