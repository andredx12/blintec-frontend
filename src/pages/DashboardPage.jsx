import { useState, useEffect } from 'react';
import api from '../services/api';
import Badge from '../components/Badge';
import './DashboardPage.css';

const LABEL_STATUS = {
  AGUARDANDO_PROGRAMACAO: 'Aguardando programação',
  PROGRAMADO: 'Programado',
  EM_CORTE: 'Em corte',
  EM_COSTURA: 'Em costura',
  EM_ARREMATACAO: 'Em arrematação',
  EM_EXPEDICAO: 'Em expedição',
  ENTREGUE: 'Entregue',
};

function DashboardPage() {
  const [resumo, setResumo] = useState(null);
  const [atrasados, setAtrasados] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/resumo'),
      api.get('/dashboard/atrasados'),
      api.get('/dashboard/estoque'),
    ])
      .then(([resResumo, resAtrasados, resEstoque]) => {
        setResumo(resResumo.data);
        setAtrasados(resAtrasados.data);
        setEstoque(resEstoque.data);
      })
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return <p className="page-vazio">Carregando...</p>;
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="cards-grid">
        <div className="card">
          <span className="card-label">Total de pedidos</span>
          <span className="card-valor">{resumo.totalPedidos}</span>
        </div>

        {Object.entries(resumo.contagemPorStatus).map(([status, quantidade]) => (
          <div className="card" key={status}>
            <span className="card-label">{LABEL_STATUS[status] ?? status}</span>
            <span className="card-valor">{quantidade}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-secao">
        <h2>Pedidos atrasados ou próximos do vencimento</h2>
        {atrasados.length === 0 ? (
          <p className="page-vazio">Nenhum pedido em atraso ou próximo do vencimento</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Número</th>
                <th>Entrega</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {atrasados.map((pedido) => (
                <tr key={pedido.pedidoId}>
                  <td>{pedido.numeroPedido}</td>
                  <td>{pedido.dataEntrega}</td>
                  <td>
                    {pedido.atrasado ? (
                      <span className="tag-atrasado">Atrasado</span>
                    ) : (
                      <span className="tag-vencimento">Próximo do vencimento</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-secao">
        <h2>Estoque por tipo de tecido</h2>
        <table className="tabela">
          <thead>
            <tr>
              <th>Tipo de tecido</th>
              <th>Saldo total</th>
              <th>Estoque mínimo</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {estoque.map((item) => (
              <tr key={item.tipoTecidoId}>
                <td>{item.nomeTipoTecido}</td>
                <td>{item.saldoTotal} m</td>
                <td>{item.estoqueMinimo} m</td>
                <td>
                  {item.abaixoDoMinimo ? (
                    <span className="tag-atrasado">Abaixo do mínimo</span>
                  ) : (
                    <span className="tag-ok">Normal</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardPage;