import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Badge from '../components/Badge';
import './PedidosPage.css';

function PedidosPage() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarPedidos();
  }, []);

  function carregarPedidos() {
    setCarregando(true);
    api.get('/pedidos')
      .then((response) => setPedidos(response.data))
      .catch(() => setErro('Não foi possível carregar os pedidos'))
      .finally(() => setCarregando(false));
  }

  function navegarParaDetalhe(id) {
    navigate(`/pedidos/${id}`);
  }

  return (
    <div className="pedidos-page">
      <div className="page-header">
        <h1>Pedidos</h1>
        <Link to="/pedidos/novo" className="botao-primario">Novo pedido</Link>
      </div>

      {erro && <p className="page-erro">{erro}</p>}

      {carregando ? (
        <p className="page-vazio">Carregando...</p>
      ) : pedidos.length === 0 ? (
        <p className="page-vazio">Nenhum pedido cadastrado</p>
      ) : (
        <table className="tabela">
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Modelo</th>
              <th>Cor</th>
              <th>Entrega</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} onClick={() => navegarParaDetalhe(pedido.id)} className="tabela-linha-clicavel">
                <td><span className="tabela-link">{pedido.numeroPedido}</span></td>
                <td>{pedido.cliente?.nome}</td>
                <td>{pedido.modelo?.nome}</td>
                <td>{pedido.cor}</td>
                <td>{pedido.dataEntrega}</td>
                <td><Badge status={pedido.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PedidosPage;