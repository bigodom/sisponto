import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const converterExcelParaPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
        }

        const excelPath = req.file.path;
        const pdfPath = path.join('uploads', 'folha_ponto.pdf');

        // Comando para converter usando LibreOffice
        const command = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf --outdir "${path.dirname(pdfPath)}" "${excelPath}"`;

        try {
            await execAsync(command);
            
            // Aguardar um momento para garantir que o arquivo foi criado
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verificar se o arquivo PDF foi criado
            if (!fs.existsSync(pdfPath)) {
                throw new Error('Arquivo PDF não foi gerado');
            }

            // Enviar o arquivo PDF como resposta
            res.download(pdfPath, 'folha_ponto.pdf', (err) => {
                if (err) {
                    console.error('Erro ao enviar arquivo:', err);
                }
                // Limpar arquivos temporários
                fs.unlinkSync(excelPath);
                fs.unlinkSync(pdfPath);
            });

        } catch (error) {
            console.error('Erro na conversão com LibreOffice:', error);
            throw error;
        }

    } catch (error) {
        console.error('Erro na conversão:', error);
        res.status(500).json({ error: 'Erro ao converter arquivo' });
    }
}; 