import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import '../../styles.css';

interface Funcionario {
  id: number;
  nome: string;
  chapa: string;
}

const CreatePonto = () => {
  const [usuario, setUsuario] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [idFuncionario, setIdFuncionario] = useState<number | ''>('');
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/funcionario').then(response => {
      setFuncionarios(response.data);
    });
  }, []);

  const handleNewPonto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      usuario,
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
      idFuncionario: Number(idFuncionario)
    };

    try {
      await api.post('/ponto', data);
      alert('Ponto registrado com sucesso!');
      navigate('/ponto');
    } catch (error) {
      alert('Erro ao registrar ponto!');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row g-3 mt-3 border rounded p-4 m-0">
        <h1 className="text-center m-0">Registro de Ponto</h1>
        <form onSubmit={handleNewPonto} aria-label="Formulário de registro de ponto" className="mt-4">
          <div className="col-sm-6 mb-3">
            <label htmlFor="usuario" className="form-label">Usuário:</label>
            <input 
              type="text" 
              id="usuario" 
              className="form-control"
              value={usuario} 
              onChange={e => setUsuario(e.target.value)} 
              required 
              placeholder="Digite o nome de usuário" 
            />
          </div>
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
          <div className="col-sm-6 mb-3">
            <label htmlFor="idFuncionario" className="form-label">Funcionário:</label>
            <select 
              id="idFuncionario" 
              className="form-select"
              value={idFuncionario} 
              onChange={e => setIdFuncionario(Number(e.target.value))} 
              required
            >
              <option value="">Selecione</option>
              {funcionarios.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome} - {f.chapa}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-12 d-flex gap-3">
            <button type="submit" className="btn btn-primary">Registrar</button>
            <button type="reset" className="btn btn-secondary">Limpar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePonto;
