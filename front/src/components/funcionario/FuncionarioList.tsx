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
}

const ListFuncionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<FuncionarioInterface[]>([]);
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<keyof FuncionarioInterface | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
    const combined = `
      ${f.id}
      ${f.nome}
      ${f.chapa}
      ${f.coligada}
      ${f.departamento}
      ${f.funcao}
      ${f.desligado ? 'Sim' : 'Não'}
    `.toLowerCase();
    return combined.includes(search.toLowerCase());
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
        <h1 className="text-center m-0">Lista de Funcionários</h1>
        <div className="col-sm-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-sm-2">
          <Link to="/funcionario/create" className="btn btn-success w-100">
            Inserir
          </Link>
        </div>
        <div className="col-sm-2">
          <Link to="/" className="btn btn-secondary w-100">
            Voltar
          </Link>
        </div>
      </div>

      <div className="mt-3 border rounded p-3">
        <div style={{ height: '600px' }}>
          <div className="h-100 overflow-y-auto">
            <table className="table table-striped table-bordered table-hover m-0">
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")} className="sortable">
                    Id {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
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
                  <th onClick={() => handleSort("desligado")} className="sortable">
                    Desligado {sortField === 'desligado' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Atualizar</th>
                  <th>Excluir</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(f => (
                  <tr key={f.id} className="align-middle">
                    <td>{f.id}</td>
                    <td>{f.nome}</td>
                    <td>{f.chapa}</td>
                    <td>{f.coligada}</td>
                    <td>{f.departamento}</td>
                    <td>{f.funcao}</td>
                    <td>{f.desligado ? 'Sim' : 'Não'}</td>
                    <td>
                      <Link
                        to={`/funcionario/update/${f.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Atualizar
                      </Link>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteFuncionario(f.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Excluir
                      </button>
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
}

export default ListFuncionarios;
