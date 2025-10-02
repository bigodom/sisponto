import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import ExcelJS from "exceljs";
import IframePrint, { IframePrintHandle } from "../utils/iframe";
import "../../styles.css";

interface Ponto {
  id: number;
  usuario: string;
  dataInicio: string;
  dataFim: string;
  idFuncionario: number;
  impressoes: number;
}

interface Funcionario {
  id: number;
  nome: string;
  chapa: number;
  funcao: string;
  dataAdmissao: string;
  departamento: string;
  loja: number;
  coligada: number;
}

const PontoFuncionarioList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const iframeRef = useRef<IframePrintHandle>(null);

  useEffect(() => {
    api.get(`/funcionario/${id}`).then(res => setFuncionario(res.data));
    api.get(`/ponto/funcionario/${id}`).then(res => setPontos(res.data));
  }, [id]);

  const formatarData = (dataString: string) =>
    new Date(dataString).toLocaleDateString("pt-BR");

  const downloadFile = (data: string, filename: string, type: string) => {
    const link = document.createElement("a");
    link.href = data;
    link.download = filename;
    link.type = type;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const gerarExcel = async (ponto: Ponto) => {
    const templateResponse = await fetch("/folhaponto.xlsx");
    const arrayBuffer = await templateResponse.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.getWorksheet("HIPER");
    if (!worksheet) throw new Error("Planilha HIPER não encontrada");

    const dataInicio = new Date(ponto.dataInicio);
    const dataFim = new Date(ponto.dataFim);
    const dataInicialStr = formatarData(ponto.dataInicio);
    const dataFinalStr = formatarData(ponto.dataFim);
    const nomesDias = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

    worksheet.getCell("D4").value = funcionario?.nome;
    worksheet.getCell("D5").value = funcionario?.funcao;
    worksheet.getCell("D6").value = funcionario?.dataAdmissao;
    worksheet.getCell("G6").value = funcionario?.chapa;
    worksheet.getCell("D7").value = "44 horas semanais";
    worksheet.getCell("D8").value = `${dataInicialStr} a ${dataFinalStr}`;
    worksheet.getCell("D9").value = funcionario?.departamento;

    // Add store-specific information
    if (funcionario?.coligada === 1 && funcionario?.loja === 1) {
      worksheet.getCell("H4").value = "18.107.045/0001-25";
      worksheet.getCell("H5").value = "ORGANIZAÇAO DE CERAIS MONLEVADE LTDA";
      worksheet.getCell("H6").value = "AVENIDA GETULIO VARGAS 4164";
      worksheet.getCell("H7").value = "CARNEIRINHOS - 35930002";
    } else if (funcionario?.coligada === 1 && funcionario?.loja === 2) {
      worksheet.getCell("H4").value = "18.107.045/0002-06";
      worksheet.getCell("H5").value = "ORGANIZAÇAO DE CERAIS MONLEVADE LTDA";
      worksheet.getCell("H6").value = "AVENIDA GENTIL BICALHO 340";
      worksheet.getCell("H7").value = "CARNEIRINHOS - 35930478";
    } else if (funcionario?.coligada === 1 && funcionario?.loja === 3) {
      worksheet.getCell("H4").value = "18.107.045/0003-97";
      worksheet.getCell("H5").value = "ORGANIZAÇAO DE CERAIS MONLEVADE";
      worksheet.getCell("H6").value = "AVENIDA WILSON ALVARENGA 700";
      worksheet.getCell("H7").value = "CARNEIRINHOS - 35930480";
    } else if (funcionario?.coligada === 3 && funcionario?.loja === 1) {
      worksheet.getCell("H4").value = "14.652.214/0001-57";
      worksheet.getCell("H5").value = "CORREIA LEITE IMOVEIS LTDA";
      worksheet.getCell("H6").value = "AVENIDA GETIL BICALHO 340 LOJA 05";
      worksheet.getCell("H7").value = "CARNEIRINHOS - 35930478";
    } else if (funcionario?.coligada === 4 && funcionario?.loja === 1) {
      worksheet.getCell("H4").value = "15.749.220/0001-90";
      worksheet.getCell("H5").value = "HEMA LOCAÇÃO LTDA-ME";
      worksheet.getCell("H6").value = "AVENIDA GENTIL BICALHO 340 LOJA 04";
      worksheet.getCell("H7").value = "CARNEIRINHOS - 35930478";
    } else if (funcionario?.coligada === 2 && funcionario?.loja === 2) {
      worksheet.getCell("H4").value = "07.550.586/0002-98";
      worksheet.getCell("H5").value = "HIPER LANCHES LTDA";
      worksheet.getCell("H6").value = "AVENIDA WILSON ALVARENGA 700 LOJA 01";
      worksheet.getCell("H7").value = "CARNEIRINHOS - 35930480";
    } else if (funcionario?.coligada === 2 && funcionario?.loja === 1) {
      worksheet.getCell("H4").value = "07.550.586/0001-07";
      worksheet.getCell("H5").value = "HIPERLANCHES LTDA";
      worksheet.getCell("H6").value = "AVENIDA GENTIL BICALHO 340 LJ01";
      worksheet.getCell("H7").value = "CARNEIRINHOS - 35930478";
    } else if (funcionario?.coligada === 10 && funcionario?.loja === 1) {
      worksheet.getCell("H4").value = "55.896.333/0001-32";
      worksheet.getCell("H5").value = "SANTA LTDA";
      worksheet.getCell("H6").value = "RUA LUCINDA SOARES DA FONSECA 47";
      worksheet.getCell("H7").value = "JK - 35930692";
    } else {
      worksheet.getCell("H4").value = "";
      worksheet.getCell("H5").value = "";
      worksheet.getCell("H6").value = "";
      worksheet.getCell("H7").value = "";
    }

    const modelRow = worksheet.getRow(13);
    const borderConfig: Record<number, Partial<Record<'top' | 'left' | 'bottom' | 'right', "thin">>> = {
      1: { top: 'thin', left: 'thin', bottom: 'thin' },     // A
      2: { bottom: 'thin', right: 'thin' },                  // B
      3: { bottom: 'thin', right: 'thin' },                  // C
      4: { bottom: 'thin', right: 'thin' },                  // D
      5: { bottom: 'thin', right: 'thin' },                  // E
      6: { bottom: 'thin', right: 'thin' },                  // F
      7: { bottom: 'thin', right: 'thin' },                  // G
      8: { bottom: 'thin' },                                 // H
      9: { bottom: 'thin' },                                 // I
      10: { bottom: 'thin' },                                 // J
      11: { bottom: 'thin', right: 'thin' }                   // K
    };

    let currentDate = new Date(dataInicio);
    let rowIndex = 13;

    while (currentDate <= dataFim && rowIndex <= 44) {
      const dia = currentDate.getDate();
      const nomeDia = nomesDias[currentDate.getDay()];
      const rowStr = `${rowIndex}`;

      // 1) Preenche a célula A#
      worksheet.getCell(`A${rowStr}`).value = `${dia} ${nomeDia}`;

      // 2) Para cada coluna em borderConfig, copie estilo + aplique borda
      for (const [colIdxStr, opts] of Object.entries(borderConfig)) {
        const colIdx = Number(colIdxStr);
        const modelCell = modelRow.getCell(colIdx);
        const cell = worksheet.getRow(rowIndex).getCell(colIdx);

        // Copia todo o estilo base (fonte, alinhamento, fill…)
        cell.style = { ...modelCell.style };

        // Constrói o objeto border clonando `opts`
        cell.border = {
          top: opts.top ? { style: opts.top } : undefined,
          left: opts.left ? { style: opts.left } : undefined,
          bottom: opts.bottom ? { style: opts.bottom } : undefined,
          right: opts.right ? { style: opts.right } : undefined,
        };
      }

      // 3) Avança para o próximo dia e linha
      currentDate.setDate(currentDate.getDate() + 1);
      rowIndex++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
  };

  const handleDownload = async (ponto: Ponto) => {
    try {
      const excelBlob = await gerarExcel(ponto);
      const dataInicial = formatarData(ponto.dataInicio);
      const excelUrl = URL.createObjectURL(excelBlob);
      downloadFile(excelUrl, `folha_ponto_${funcionario?.nome}_${dataInicial}.xlsx`, excelBlob.type);

      const res = await api.put(`/ponto/${ponto.id}/incrementar-impressoes`);
      setPontos(pontos.map(p => (p.id === ponto.id ? res.data : p)));
    } catch (err) {
      console.error("Erro ao gerar Excel:", err);
      alert("Erro ao gerar o Excel. Por favor, tente novamente.");
    }
  };

  const handlePrint = async (ponto: Ponto) => {
    try {
      const excelBlob = await gerarExcel(ponto);
      const dataInicial = formatarData(ponto.dataInicio);

      const formData = new FormData();
      formData.append("file", excelBlob, `folha_ponto_${funcionario?.nome}_${dataInicial}.xlsx`);

      const pdfResponse = await api.post("/excel-to-pdf", formData, { responseType: "blob" });

      const reader = new FileReader();
      reader.readAsDataURL(pdfResponse.data);

      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          setPdfBase64(base64);
          resolve();
        };
      });

      await new Promise(resolve => setTimeout(resolve, 100));
      iframeRef.current?.handlePrint();

      const res = await api.put(`/ponto/${ponto.id}/incrementar-impressoes`);
      setPontos(pontos.map(p => (p.id === ponto.id ? res.data : p)));
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao gerar o PDF. Por favor, tente novamente.");
    }
  };

  return (
    <div className="container">
      <IframePrint ref={iframeRef} base64Pdf={pdfBase64} />

      <div className="row g-3 mt-3 border rounded p-4 m-0">
        <h1 className="text-center m-0">
          Pontos do Funcionário: {funcionario?.nome} - {funcionario?.chapa}
        </h1>
        <div className="col-sm-2">
          <Link to="/funcionario" className="btn btn-secondary w-100">
            Voltar
          </Link>
        </div>
      </div>

      <div className="mt-3 border rounded p-3">
        <div style={{ height: "600px" }}>
          <div className="h-100 overflow-y-auto">
            <table className="table table-striped table-bordered table-hover m-0">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Data Início</th>
                  <th>Data Fim</th>
                  <th>Impressões</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pontos.map(ponto => (
                  <tr key={ponto.id} className="align-middle">
                    <td>{ponto.usuario}</td>
                    <td>{formatarData(ponto.dataInicio)}</td>
                    <td>{formatarData(ponto.dataFim)}</td>
                    <td>{ponto.impressoes}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button onClick={() => handleDownload(ponto)} className="btn btn-primary btn-sm">
                          Baixar Folha
                        </button>
                        <button onClick={() => handlePrint(ponto)} className="btn btn-secondary btn-sm ms-2">
                          Imprimir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PontoFuncionarioList;
