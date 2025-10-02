import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import '../../styles.css';

export interface FuncionarioInterface {
  id: number;
  chapa: number;
  coligada: number;
  nome: string;
  departamento: string;
  funcao: string;
  desligado: boolean;
  loja: number;
  dataAdmissao: string;
}

// Mapping loja names by coligada and loja
const LOJAS_BY_COLIGADA: { [coligada: number]: { [loja: number]: string } } = {
  1: {
    1: 'MATRIZ',
    2: 'HIPER',
    3: 'SUPER',
  },
  2: {
    1: 'HIPERLANCHES MATRIZ',
    2: 'HIPERLANCHES FILIAL',
  },
  3: {
    1: 'CORREIA LEITE',
  },
  4: {
    1: 'HEMA LOCAÇÃO',
  },
  10: {
    1: 'SANTA LIMPEZA',
  }
};

const getLojaNome = (coligada: number, loja: number): string => {
  const byColigada = LOJAS_BY_COLIGADA[coligada];
  if (!byColigada) return 'Loja não encontrada';
  return byColigada[loja] || 'Loja não encontrada';
};

const ListFuncionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<FuncionarioInterface[]>([]);
  const [nomeFilter, setNomeFilter] = useState<string>('');
  const [chapaFilter, setChapaFilter] = useState<string>('');
  const [coligadaFilter, setColigadaFilter] = useState<number | ''>('');
  const [departamentoFilter, setDepartamentoFilter] = useState<string>('');
  const [funcaoFilter, setFuncaoFilter] = useState<string>('');
  const [desligadoFilter, setDesligadoFilter] = useState<boolean>(false);
  const [lojaFilter, setLojaFilter] = useState<number | ''>('');
  const [sortField, setSortField] = useState<keyof FuncionarioInterface | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Get unique values for autocomplete
  const uniqueDepartamentos = [...new Set(funcionarios.map(f => f.departamento))];
  const uniqueFuncoes = [...new Set(funcionarios.map(f => f.funcao))];

  useEffect(() => {
    api.get<FuncionarioInterface[]>('/funcionario').then(response => {
      setFuncionarios(response.data);
    });
  }, []);

  const handleDeleteFuncionario = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este funcionário?")) return;
    await api.delete(`/funcionario/${id}`);
    setFuncionarios(f => f.filter(x => x.id !== id));
  };

  const handleSort = (field: keyof FuncionarioInterface) => {
    const order = (field === sortField && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const filtered = funcionarios.filter(f => {
    const nomeMatch = f.nome.includes(nomeFilter);
    const chapaMatch = chapaFilter ? f.chapa.toString().includes(chapaFilter) : true;
    const coligadaMatch = coligadaFilter ? f.coligada === coligadaFilter : true;
    const departamentoMatch = f.departamento.includes(departamentoFilter);
    const funcaoMatch = f.funcao.includes(funcaoFilter);
    const desligadoMatch = desligadoFilter ? f.desligado : !f.desligado;
    const lojaMatch = lojaFilter ? f.loja === lojaFilter : true;

    return nomeMatch && chapaMatch && coligadaMatch && departamentoMatch && funcaoMatch && desligadoMatch && lojaMatch;
  });

  const sorted = sortField
    ? [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc'
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    })
    : filtered;

  return (
    <div className="container">
      <div className="row g-3 mt-3 border rounded p-4 m-0">
        <h1 className="text-center m-0">Filtros</h1>
        <div className="row g-3">
          <div className="col-sm-4">
            <label htmlFor="nomeFilter" className="form-label">Nome:</label>
            <input
              type="text"
              id="nomeFilter"
              className="form-control"
              value={nomeFilter}
              onChange={e => setNomeFilter(e.target.value.toUpperCase())}
              placeholder="Filtrar por nome"
            />
          </div>
          <div className="col-sm-2">
            <label htmlFor="chapaFilter" className="form-label">Chapa:</label>
            <input
              type="text"
              id="chapaFilter"
              className="form-control"
              value={chapaFilter}
              onChange={e => setChapaFilter(e.target.value)}
              placeholder="Filtrar por chapa"
            />
          </div>
          <div className="col-sm-2">
            <label htmlFor="coligadaFilter" className="form-label">Coligada:</label>
            <select
              id="coligadaFilter"
              className="form-select"
              value={coligadaFilter}
              onChange={e => setColigadaFilter(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Todas</option>
              <option value="1">ORGANIZAÇÃO</option>
              <option value="2">HIPERLANCHES</option>
              <option value="3">CORREIA LEITE</option>
              <option value="4">HEMA LOCAÇÃO</option>
              <option value="10">SANTA LIMPEZA</option>
            </select>
          </div>
          <div className="col-sm-2">
            <label htmlFor="departamentoFilter" className="form-label">Departamento:</label>
            <input
              type="text"
              id="departamentoFilter"
              className="form-control"
              value={departamentoFilter}
              onChange={e => setDepartamentoFilter(e.target.value.toUpperCase())}
              placeholder="Filtrar por departamento"
              list="departamentosList"
            />
            <datalist id="departamentosList">
              {uniqueDepartamentos.map((dep, index) => (
                <option key={index} value={dep} />
              ))}
            </datalist>
          </div>
          <div className="col-sm-2">
            <label htmlFor="funcaoFilter" className="form-label">Função:</label>
            <input
              type="text"
              id="funcaoFilter"
              className="form-control"
              value={funcaoFilter}
              onChange={e => setFuncaoFilter(e.target.value.toUpperCase())}
              placeholder="Filtrar por função"
              list="funcoesList"
            />
            <datalist id="funcoesList">
              {uniqueFuncoes.map((func, index) => (
                <option key={index} value={func} />
              ))}
            </datalist>
          </div>
          <div className="col-sm-2">
            <label htmlFor="lojaFilter" className="form-label">Loja:</label>
            <select
              id="lojaFilter"
              className="form-select"
              value={lojaFilter}
              onChange={e => setLojaFilter(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Todas</option>
              {coligadaFilter && LOJAS_BY_COLIGADA[Number(coligadaFilter)]
                ? Object.entries(LOJAS_BY_COLIGADA[Number(coligadaFilter)]).map(([id, nome]) => (
                  <option key={id} value={id}>{id} - {nome}</option>
                ))
                : Array.from(
                  new Set(
                    Object.values(LOJAS_BY_COLIGADA)
                      .flatMap(m => Object.keys(m))
                  )
                ).sort((a, b) => Number(a) - Number(b)).map(id => (
                  <option key={id} value={id}>{id}</option>
                ))
              }
            </select>
          </div>
          <div className="col-sm-4 align-content-end mb-2 ms-1">
            <div className="form-check">
              <label htmlFor="desligadoFilter" className="form-check-label">
                Exibir Desligados
              </label>
              <input
                type="checkbox"
                id="desligadoFilter"
                className="form-check-input me-2"
                checked={desligadoFilter}
                onChange={e => setDesligadoFilter(e.target.checked)}
              />

            </div>
          </div>

        </div>
        <div className="d-flex align-items-center border p-3 mt-3">
          <div className="me-3">Criar novo funcionario:</div>
          <Link to="/funcionario/create" className="btn btn-success m-0">
            Inserir
          </Link>
        </div>

      </div>
      <div className="row g-3 mt-4 p-4 m-0">

        <h1 className="text-center m-0">Lista de Funcionários</h1>
      </div>
      <div className="mt-3 border rounded p-3">
        <div style={{ height: '600px' }}>
          <div className="h-100 overflow-y-auto">
            <table className="table table-striped table-bordered table-hover m-0">
              <thead>
                <tr>
                  <th onClick={() => handleSort("nome")} className="sortable">
                    Nome {sortField === 'nome' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort("chapa")} className="sortable">
                    Chapa {sortField === 'chapa' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort("coligada")} className="sortable">
                    Coligada {sortField === 'coligada' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort("departamento")} className="sortable">
                    Departamento {sortField === 'departamento' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort("funcao")} className="sortable">
                    Função {sortField === 'funcao' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort("loja")} className="sortable">
                    Loja {sortField === 'loja' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Nova Folha</th>
                  <th>Atualizar</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(f => (
                  <tr key={f.id} className={`align-middle ${f.desligado ? 'table-danger' : ''}`}>
                    <td>
                      <Link to={`/ponto/funcionario/${f.id}`} className="text-decoration-none">
                        {f.nome}
                      </Link>
                    </td>
                    <td>{f.chapa}</td>
                    <td>{f.coligada}</td>
                    <td>{f.departamento}</td>
                    <td>{f.funcao}</td>
                    <td>{f.loja} - {getLojaNome(f.coligada, f.loja)}</td>
                    <td>
                      <Link
                        to={`/ponto/create/funcionario/${f.id}`}
                        className="btn btn-success btn-sm"
                      >
                        Nova Folha
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/funcionario/update/${f.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Atualizar
                      </Link>
                    </td>
                    <td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-3 border rounded p-3">
        <h3 className="mb-3">Importar Funcionários via XLS ou XLSX</h3>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="csvFile" className="form-label">Selecione o arquivo XLS ou XLSX:</label>
              <input
                type="file"
                className="form-control"
                id="csvFile"
                accept=".xls,.xlsx"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append('file', file);

                  try {
                    const response = await api.post('/import-funcionarios', formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                        'Accept-Charset': 'utf-8'
                      },
                    });
                    alert(response.data.message);
                    // Refresh the funcionarios list
                    const updatedFuncionarios = await api.get<FuncionarioInterface[]>('/funcionario');
                    setFuncionarios(updatedFuncionarios.data);
                  } catch (error) {
                    alert('Erro ao importar planilha');
                    console.error(error);
                  }
                }}
              />
            </div>
            <div className="alert alert-info">
              <small>
                A planilha deve conter as colunas nas posições: A(coligada); C(chapa); J(dataAdmissao); M(nome); T(departamento); Z(loja); AC(cpf); AR(funcao). Ignore a primeira linha (cabeçalho). Separador ';'.
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 border rounded p-3 mb-3">
        <div className="row">
          <div className="col-md-6">
            <div className="alert alert-info mb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Total de Funcionários:</strong> {funcionarios.length}
                </div>
                <div>
                  <strong>Funcionários Filtrados:</strong> {filtered.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListFuncionarios;