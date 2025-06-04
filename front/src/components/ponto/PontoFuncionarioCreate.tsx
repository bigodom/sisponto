import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import '../../styles.css';

interface Funcionario {
  id: number;
  nome: string;
  chapa: number;
}

const PontoFuncionarioCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/funcionario/${id}`).then(response => {
      setFuncionario(response.data);
    });
  }, [id]);

  const validateDateRange = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return true;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Verifica se a data fim é maior que a data início
    if (end < start) {
      setError('A data fim não pode ser menor que a data início');
      return false;
    }
    
    // Calcula a diferença em dias
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 31) {
      setError('A diferença entre as datas não pode ser maior que 31 dias');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleDataInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDataInicio = e.target.value;
    setDataInicio(newDataInicio);
    validateDateRange(newDataInicio, dataFim);
  };

  const handleDataFimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDataFim = e.target.value;
    setDataFim(newDataFim);
    validateDateRange(dataInicio, newDataFim);
  };

  const handleNewPonto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateDateRange(dataInicio, dataFim)) {
      return;
    }

    const usuario = localStorage.getItem('name');
    if (!usuario) {
      alert('Usuário não encontrado. Por favor, faça login novamente.');
      navigate('/login');
      return;
    }

    const data = {
      usuario,
      dataInicio: new Date(dataInicio + 'T00:00:00'),
      dataFim: new Date(dataFim + 'T23:59:59'),
      idFuncionario: Number(id)
    };

    try {
      await api.post('/ponto', data);
      alert('Ponto registrado com sucesso!');
      navigate(`/ponto/funcionario/${id}`);
    } catch (error) {
      alert('Erro ao registrar ponto!');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row g-3 mt-3 border rounded p-4 m-0">
        <h1 className="text-center m-0">
          Nova Folha de Ponto - {funcionario?.nome} - {funcionario?.chapa}
        </h1>
        <form onSubmit={handleNewPonto} className="mt-4">
          <div className="col-sm-6 mb-3">
            <label htmlFor="dataInicio" className="form-label">Data Início:</label>
            <input 
              type="date" 
              id="dataInicio" 
              className="form-control"
              value={dataInicio} 
              onChange={handleDataInicioChange}
              required 
            />
          </div>
          <div className="col-sm-6 mb-3">
            <label htmlFor="dataFim" className="form-label">Data Fim:</label>
            <input 
              type="date" 
              id="dataFim" 
              className="form-control"
              value={dataFim} 
              onChange={handleDataFimChange}
              required 
            />
          </div>
          {error && (
            <div className="col-sm-12 mb-3">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          )}
          <div className="col-sm-12 d-flex gap-3">
            <button type="submit" className="btn btn-primary">Registrar</button>
            <Link to={`/ponto/funcionario/${id}`} className="btn btn-secondary">
              Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PontoFuncionarioCreate; 