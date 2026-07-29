import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './EstoquePage.css';

function EstoquePage() {
  const [rolos, setRolos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarRolos();
  }, []);

  function carregarRolos() {
    setCarregando(true);
    api.get('/rolos')
      .then((response) => setRolos(response.data))
      .catch(() => setErro('Não foi possível carregar os rolos'))
      .finally(() => setCarregando(false));
  }

  return (
    <div className="estoque-page">
      <div className="page-header">
        <h1>Estoque de rolos</h1>
        <Link to="/estoque/novo" className="botao-primario">Novo rolo</Link>
      </div>

      {erro && <p className="page-erro">{erro}</p>}

      {carregando ? (
        <p className="page-vazio">Carregando...</p>
      ) : rolos.length === 0 ? (
        <p className="page-vazio">Nenhum rolo cadastrado</p>
      ) : (
        <table className="tabela">
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo de tecido</th>
              <th>Cor</th>
              <th>Metragem inicial</th>
              <th>Saldo atual</th>
            </tr>
          </thead>
          <tbody>
            {rolos.map((rolo) => {
              const saldoBaixo = rolo.saldoAtual < rolo.tipoTecido?.estoqueMinimo;
              return (
                <tr key={rolo.id}>
                  <td>{rolo.codigo}</td>
                  <td>{rolo.tipoTecido?.nome}</td>
                  <td>{rolo.cor}</td>
                  <td>{rolo.metragemInicial} m</td>
                  <td className={saldoBaixo ? 'saldo-baixo' : ''}>
                    {rolo.saldoAtual} m
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EstoquePage;