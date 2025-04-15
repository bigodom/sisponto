import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import '../../styles.css';

const CreateFuncionario = () => {
  const [nome, setNome] = useState('');
  const [chapa, setChapa] = useState<number | ''>('');
  const [coligada, setColigada] = useState<number | ''>('');
  const [departamento, setDepartamento] = useState('');
  const [funcao, setFuncao] = useState('');
  const [desligado, setDesligado] = useState(false);
  const navigate = useNavigate();

  const handleNewFuncionario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      nome,
      chapa: Number(chapa),
      coligada: Number(coligada),
      departamento,
      funcao,
      desligado
    };

    try {
      await api.post('/funcionario', data);
      alert('Funcionário cadastrado com sucesso!');
      navigate('/funcionario');
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 409) {
        alert('Chapa já está em uso.');
      } else {
        alert('Erro ao cadastrar o funcionário!');
      }
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row g-3 mt-3 border rounded p-4 m-0">
        <h1 className="text-center m-0">Cadastro de Funcionário</h1>
        <form onSubmit={handleNewFuncionario} className="mt-4">
          <div className="col-sm-6 mb-3">
            <label htmlFor="nome" className="form-label">Nome:</label>
            <input 
              type="text" 
              id="nome" 
              className="form-control"
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              required 
            />
          </div>
          <div className="col-sm-3 mb-3">
            <label htmlFor="chapa" className="form-label">Chapa:</label>
            <input 
              type="number" 
              id="chapa" 
              className="form-control"
              value={chapa} 
              onChange={e => setChapa(Number(e.target.value))} 
              required 
            />
          </div>
          <div className="col-sm-3 mb-3">
            <label htmlFor="coligada" className="form-label">Coligada:</label>
            <input 
              type="number" 
              id="coligada" 
              className="form-control"
              value={coligada} 
              onChange={e => setColigada(Number(e.target.value))} 
              required 
            />
          </div>
          <div className="col-sm-6 mb-3">
            <label htmlFor="departamento" className="form-label">Departamento:</label>
            <input 
              type="text" 
              id="departamento" 
              className="form-control"
              value={departamento} 
              onChange={e => setDepartamento(e.target.value)} 
              required 
            />
          </div>
          <div className="col-sm-6 mb-3">
            <label htmlFor="funcao" className="form-label">Função:</label>
            <input 
              type="text" 
              id="funcao" 
              className="form-control"
              value={funcao} 
              onChange={e => setFuncao(e.target.value)} 
              required 
            />
          </div>
          <div className="col-sm-12 mb-3">
            <div className="form-check">
              <input 
                type="checkbox" 
                id="desligado" 
                className="form-check-input"
                checked={desligado} 
                onChange={e => setDesligado(e.target.checked)} 
              />
              <label htmlFor="desligado" className="form-check-label">Desligado</label>
            </div>
          </div>
          <div className="col-sm-12 d-flex gap-3">
            <button type="submit" className="btn btn-primary">Cadastrar</button>
            <button type="reset" className="btn btn-secondary">Limpar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFuncionario;
