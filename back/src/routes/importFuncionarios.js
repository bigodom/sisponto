import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { parse } from 'csv-parse';
import fs from 'fs';

const prisma = new PrismaClient();
const importRouter = Router();
const upload = multer({ dest: 'uploads/' });

importRouter.post('/import-funcionarios', upload.single('file'), async (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ error: 'Arquivo CSV não enviado' });
  }

  const funcionariosCsv = [];

  try {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const parser = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ';',
      encoding: 'utf-8'
    });

    for await (const record of parser) {
      funcionariosCsv.push({
        cpf: record.cpf,
        chapa: Number(record.chapa),
        coligada: Number(record.coligada),
        loja: Number(record.loja),
        nome: record.nome,
        departamento: record.departamento,
        funcao: record.funcao,
      });
    }

    const cpfsCsv = funcionariosCsv.map(f => f.cpf);

    const funcionariosExistentes = await prisma.funcionario.findMany();
    const mapExistentes = new Map(funcionariosExistentes.map(f => [f.cpf, f]));

    for (const f of funcionariosCsv) {
      const existente = mapExistentes.get(f.cpf);

      if (existente) {
        await prisma.funcionario.update({
          where: { cpf: f.cpf },
          data: {
            nome: f.nome,
            chapa: f.chapa,
            coligada: f.coligada,
            loja: f.loja,
            departamento: f.departamento,
            funcao: f.funcao,
            desligado: false,
          },
        });
      } else {
        await prisma.funcionario.create({
          data: {
            cpf: f.cpf,
            nome: f.nome,
            chapa: f.chapa,
            coligada: f.coligada,
            loja: f.loja,
            departamento: f.departamento,
            funcao: f.funcao,
            desligado: false,
          },
        });
      }
    }

    const funcionariosDesligar = funcionariosExistentes.filter(f => !cpfsCsv.includes(f.cpf));
    for (const f of funcionariosDesligar) {
      await prisma.funcionario.update({
        where: { id: f.id },
        data: { desligado: true },
      });
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'Importação concluída com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar o CSV' });
  }
});

export default importRouter;
