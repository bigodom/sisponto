import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import '../../styles.css';

interface PontoInterface {
  id: number;
  usuario: string;
  dataInicio: string;
  dataFim: string;
  funcionario: {
    nome: string;
  };
}

const ListPonto: React.FC = () => {
  const [pontos, setPontos] = useState<PontoInterface[]>([]);
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<keyof PontoInterface | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    api.get<PontoInterface[]>('/ponto').then(response => {
      setPontos(response.data);
    });
  }, []);

  const handleDeletePonto = async (id: number) => {
    if (!window.confirm("Deseja excluir este ponto?")) return;
    await api.delete(`/ponto/${id}`);
    setPontos(p => p.filter(x => x.id !== id));
  };

  const handleSort = (field: keyof PontoInterface) => {
    const order = (field === sortField && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const filtered = pontos.filter(p => {
    const combined = `
      ${p.id}
      ${p.usuario}
      ${p.funcionario.nome}
      ${new Date(p.dataInicio).toLocaleString()}
      ${new Date(p.dataFim).toLocaleString()}
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
        <h1 className="text-center m-0">Lista de Pontos</h1>

        <div className="col-sm-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por usuário"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-sm-8 d-flex justify-content-end gap-3">
          <Link to="/ponto/create" className="btn btn-success">
            Inserir
          </Link>
          <Link to="/" className="btn btn-secondary">
            Voltar
          </Link>
        </div>
      </div>

      <div className="mt-4" style={{ height: '600px' }}>
        <div className="h-100 overflow-y-auto border rounded">
          <table className="table table-striped table-bordered table-hover m-0">
            <thead className="table-dark">
              <tr>
                <th onClick={() => handleSort("id")} style={{ cursor: 'pointer' }}>
                  ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort("usuario")} style={{ cursor: 'pointer' }}>
                  Usuário {sortField === 'usuario' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Funcionário</th>
                <th onClick={() => handleSort("dataInicio")} style={{ cursor: 'pointer' }}>
                  Início {sortField === 'dataInicio' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort("dataFim")} style={{ cursor: 'pointer' }}>
                  Fim {sortField === 'dataFim' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} className="align-middle">
                  <td>{p.id}</td>
                  <td>{p.usuario}</td>
                  <td>{p.funcionario.nome}</td>
                  <td>{new Date(p.dataInicio).toLocaleString()}</td>
                  <td>{new Date(p.dataFim).toLocaleString()}</td>
                  <td>
                    <Link to={`/ponto/update/${p.id}`} className="btn btn-primary me-2">
                      Atualizar
                    </Link>
                    <button onClick={() => handleDeletePonto(p.id)} className="btn btn-danger">
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
  );
}

export default ListPonto;
