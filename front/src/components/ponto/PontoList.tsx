import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link, useParams } from "react-router-dom";
import '../../styles.css';

interface PontoInterface {
  id: number;
  usuario: string;
  dataInicio: string;
  dataFim: string;
  funcionario: {
    id: number;
    nome: string;
  };
}

const ListPonto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pontos, setPontos] = useState<PontoInterface[]>([]);
  const [searchFuncionario, setSearchFuncionario] = useState<string>('');
  const [searchUsuario, setSearchUsuario] = useState<string>('');
  const [sortField, setSortField] = useState<keyof PontoInterface | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [funcionarioNome, setFuncionarioNome] = useState<string>('');
  const [usuarioLogado, setUsuarioLogado] = useState<string>('');

  useEffect(() => {
    // Buscar usuário logado do localStorage
    const nome = localStorage.getItem('name');
    if (nome) {
      setUsuarioLogado(nome);
    }

    if (id) {
      // Se tiver ID, busca pontos do funcionário específico
      api.get<PontoInterface[]>(`/ponto/funcionario/${id}`).then(response => {
        setPontos(response.data);
        if (response.data.length > 0) {
          setFuncionarioNome(response.data[0].funcionario.nome);
        }
      });
    } else {
      // Se não tiver ID, busca todos os pontos
      api.get<PontoInterface[]>('/ponto').then(response => {
        setPontos(response.data);
      });
    }
  }, [id]);

  const handleDeletePonto = async (ponto: PontoInterface) => {
    if (!usuarioLogado) {
      alert('Usuário não encontrado. Por favor, faça login novamente.');
      return;
    }

    if (ponto.usuario !== usuarioLogado) {
      alert('Você não tem permissão para excluir este ponto. Apenas o usuário que criou pode excluí-lo.');
      return;
    }

    if (!window.confirm("Deseja excluir este ponto?")) return;
    
    try {
      await api.delete(`/ponto/${ponto.id}`);
      setPontos(p => p.filter(x => x.id !== ponto.id));
    } catch (error) {
      alert('Erro ao excluir ponto!');
      console.error(error);
    }
  };

  const handleSort = (field: keyof PontoInterface) => {
    const order = (field === sortField && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const filtered = pontos.filter(p => {
    const funcionarioMatch = p.funcionario.nome.toLowerCase().includes(searchFuncionario.toLowerCase());
    const usuarioMatch = p.usuario.toLowerCase().includes(searchUsuario.toLowerCase());
    return funcionarioMatch && usuarioMatch;
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
        <h1 className="text-center m-0">
          {id ? `Pontos do Funcionário: ${funcionarioNome}` : 'Lista de Pontos'}
        </h1>

        <div className="col-sm-12">
          <div className="row">
            <div className="col-sm-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por funcionário"
                value={searchFuncionario}
                onChange={(e) => setSearchFuncionario(e.target.value)}
              />
            </div>
            <div className="col-sm-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por usuário"
                value={searchUsuario}
                onChange={(e) => setSearchUsuario(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="col-sm-12 d-flex justify-content-end gap-3">
          {!id && (
            <Link to="/ponto/create" className="btn btn-success">
              Inserir
            </Link>
          )}
          <Link to={id ? "/funcionario" : "/"} className="btn btn-secondary">
            Voltar
          </Link>
        </div>
      </div>

      <div id="example">
        
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
                  <td>{new Date(p.dataInicio).toLocaleDateString()}</td>
                  <td>{new Date(p.dataFim).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/ponto/update/${p.id}`} className="btn btn-primary me-2">
                      Atualizar
                    </Link>
                    <button 
                      onClick={() => handleDeletePonto(p)} 
                      className="btn btn-danger"
                      disabled={p.usuario !== usuarioLogado}
                      title={p.usuario !== usuarioLogado ? "Apenas o usuário que criou pode excluir" : "Excluir ponto"}
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
  );
}

export default ListPonto;
