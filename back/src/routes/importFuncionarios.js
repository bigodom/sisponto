import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import fs from 'fs';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();
const importRouter = Router();
const upload = multer({ dest: 'uploads/' });

const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
const formatExcelDateToDDMMYYYY = (value) => {
  if (value == null) return '';
  if (typeof value === 'number') {
    const parsed = XLSX.SSF && XLSX.SSF.parse_date_code ? XLSX.SSF.parse_date_code(value) : null;
    if (parsed && parsed.y && parsed.m && parsed.d) {
      return `${pad2(parsed.d)}/${pad2(parsed.m)}/${parsed.y}`;
    }
    // Fallback using epoch from 1899-12-30
    const base = new Date(Date.UTC(1899, 11, 30));
    const d = new Date(base.getTime() + Math.round(value) * 24 * 60 * 60 * 1000);
    return `${pad2(d.getUTCDate())}/${pad2(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
  }
  if (value instanceof Date) {
    return `${pad2(value.getUTCDate())}/${pad2(value.getUTCMonth() + 1)}/${value.getUTCFullYear()}`;
  }
  const str = String(value).trim();
  // Normalize common variants like yyyy-mm-dd to dd/mm/yyyy
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-');
    return `${d}/${m}/${y}`;
  }
  return str;
};

importRouter.post('/import-funcionarios', upload.single('file'), async (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ error: 'Arquivo XLS não enviado' });
  }

  const funcionariosPlanilha = [];

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];

    // Convert to JSON preserving raw values; we'll map columns manually
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

    // Ignore first row (header). Columns mapping per spec:
    // coligada: A (0) | chapa: C (2) | dataAdmissao: J (9)
    // nome: M (12) | funcao: AR (43) | departamento: T (19)
    // cpf: AC (28) | loja: Z (25)
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i] || [];
      const coligada = Number(r[0]);
      const chapa = Number(r[2]);
      const dataAdmissao = formatExcelDateToDDMMYYYY(r[9]);
      const nome = (r[12] ?? '').toString();
      const funcao = (r[43] ?? '').toString();
      const departamento = (r[19] ?? '').toString();
      const cpf = (r[28] ?? '').toString();
      const loja = Number(r[25]);

      if (!cpf) continue; // require CPF as key

      funcionariosPlanilha.push({
        cpf,
        chapa,
        coligada,
        loja,
        nome,
        departamento,
        funcao,
        dataAdmissao,
      });
    }

    const cpfsCsv = funcionariosPlanilha.map(f => f.cpf);

    const funcionariosExistentes = await prisma.funcionario.findMany();
    const mapExistentes = new Map(funcionariosExistentes.map(f => [f.cpf, f]));

    for (const f of funcionariosPlanilha) {
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
            dataAdmissao: f.dataAdmissao,
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
            dataAdmissao: f.dataAdmissao,
          },
        });
      }
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'Importação XLS concluída com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar a planilha XLS' });
  }
});

export default importRouter;
