import express from 'express';
import multer from 'multer';
import path from 'path';
import { converterExcelParaPDF } from '../controllers/conversorController.js';

const router = express.Router();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'folha_ponto.xlsx');
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos Excel (.xlsx) são permitidos!'), false);
        }
    }
});

// Rota para converter Excel para PDF
router.post('/excel-to-pdf', upload.single('file'), converterExcelParaPDF);

export default router; 