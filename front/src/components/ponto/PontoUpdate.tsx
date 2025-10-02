import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import '../../styles.css';

interface Funcionario {
  id: number;
  nome: string;
  chapa: string;
}

const UpdatePonto = () => {
  const [usuario, setUsuario] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [idFuncionario, setIdFuncionario] = useState<number | ''>('');
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/funcionario').then(response => setFuncionarios(response.data));
    api.get(`/ponto/${id}`).then(response => {
      const p = response.data;
      setDataInicio(p.dataInicio.substring(0, 16));
      setDataFim(p.dataFim.substring(0, 16));
      setIdFuncionario(p.idFuncionario);
    });
  }, [id]);

  const handleUpdatePonto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      id: Number(id),
      usuario,
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
      idFuncionario: Number(idFuncionario)
    };

    try {
      await api.put(`/ponto/${id}`, data);
      alert('Ponto atualizado com sucesso!');
      navigate('/ponto');
    } catch (error) {
      alert('Erro ao atualizar ponto!');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row g-3 mt-3 border rounded p-4 m-0">
        <h1 className="text-center m-0">Atualizar Registro de Ponto</h1>
        <form onSubmit={handleUpdatePonto} aria-label="Formulário de atualização de ponto" className="mt-4">
          <div className="col-sm-6 mb-3">
            <label htmlFor="dataInicio" className="form-label">Data Início:</label>
            <input 
              type="datetime-local" 
              id="dataInicio" 
              className="form-control"
              value={dataInicio} 
              onChange={e => setDataInicio(e.target.value)} 
              required 
            />
          </div>
          <div className="col-sm-6 mb-3">
            <label htmlFor="dataFim" className="form-label">Data Fim:</label>
            <input 
              type="datetime-local" 
              id="dataFim" 
              className="form-control"
              value={dataFim} 
              onChange={e => setDataFim(e.target.value)} 
              required 
            />
          </div>
          <div className="col-sm-12 d-flex gap-3">
            <button type="submit" className="btn btn-primary">Atualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePonto;
