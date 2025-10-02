import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import '../../styles.css';

const UpdateFuncionario = () => {
  const [nome, setNome] = useState('');
  const [chapa, setChapa] = useState<number | ''>('');
  const [coligada, setColigada] = useState<number | ''>('');
  const [departamento, setDepartamento] = useState('');
  const [funcao, setFuncao] = useState('');
  const [desligado, setDesligado] = useState(false);
  const [loja, setLoja] = useState<number | ''>('');
  const [cpf, setCpf] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    api.get(`/funcionario/${id}`).then(response => {
      setNome(response.data.nome);
      setChapa(response.data.chapa);
      setColigada(response.data.coligada);
      setDepartamento(response.data.departamento);
      setFuncao(response.data.funcao);
      setDesligado(response.data.desligado);
      setLoja(response.data.loja);
      setCpf(response.data.cpf);
      setDataAdmissao(response.data.dataAdmissao);
    })
  }, [id]);

  const handleUpdateFuncionario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      id: parseInt(String(id)),
      nome,
      cpf,
      chapa: Number(chapa),
      coligada: Number(coligada),
      departamento,
      funcao,
      desligado,
      loja: Number(loja),
      dataAdmissao
    };
    try {
      await api.put(`/funcionario/${id}`, data);
      alert('Funcionário atualizado com sucesso!');
      navigate('/funcionario');
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 409) {
          alert('Chapa já está em uso.');
        } else {
          alert('Erro ao atualizar o funcionário!');
        }
      } else {
        alert('Erro ao atualizar o funcionário!');
      }
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div className="row g-3 mt-3 border rounded p-4 m-0">
        <h1 className="text-center m-0">Atualização de Funcionário</h1>
        <form onSubmit={handleUpdateFuncionario} className="mt-4">
          <div className="col-sm-6 mb-3">
            <label htmlFor="nome" className="form-label">Nome:</label>
            <input 
              type="text" 
              id="nome" 
              name="nome"
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
              name="chapa"
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
              name="coligada"
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
              name="departamento"
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
              name="funcao"
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
                name="desligado"
                className="form-check-input"
                checked={desligado} 
                onChange={e => setDesligado(e.target.checked)} 
              />
              <label htmlFor="desligado" className="form-check-label">Desligado</label>
            </div>
          </div>
          <div className="col-sm-3 mb-3">
            <label htmlFor="loja" className="form-label">Loja:</label>
            <input 
              type="number" 
              id="loja" 
              name="loja"
              className="form-control"
              value={loja} 
              onChange={e => setLoja(Number(e.target.value))} 
              required
            />
          </div>
          <div className="col-sm-12 d-flex gap-3">
            <button type="submit" className="btn btn-primary">Atualizar</button>
            <button type="reset" className="btn btn-secondary">Limpar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateFuncionario;
