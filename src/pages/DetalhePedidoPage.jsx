import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Badge from '../components/Badge';
import './DetalhePedidoPage.css';

function DetalhePedidoPage() {
  const { id } = useParams();

  const [pedido, setPedido] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [sugestao, setSugestao] = useState(null);
  const [selecoes, setSelecoes] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [avancando, setAvancando] = useState(false);
  const [confirmandoEnfesto, setConfirmandoEnfesto] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [id]);

  function carregarDados() {
    setCarregando(true);
    Promise.all([
      api.get(`/pedidos/${id}`),
      api.get(`/pedidos/${id}/historico`),
    ])
      .then(([resPedido, resHistorico]) => {
        setPedido(resPedido.data);
        setHistorico(resHistorico.data);

        if (resPedido.data.status === 'AGUARDANDO_PROGRAMACAO') {
          return api.get(`/pedidos/${id}/enfesto/sugestao`).then((resSugestao) => {
            setSugestao(resSugestao.data);
          });
        }
      })
      .catch(() => setErro('Não foi possível carregar o pedido'))
      .finally(() => setCarregando(false));
  }

  async function avancarEtapa() {
    setAvancando(true);
    setErro('');
    try {
      await api.patch(`/pedidos/${id}/avancar-etapa`);
      await carregarDados();
    } catch (err) {
      setErro(err.response?.data?.erro ?? 'Não foi possível avançar a etapa');
    } finally {
      setAvancando(false);
    }
  }

  function atualizarSelecao(roloId, valor) {
    setSelecoes({ ...selecoes, [roloId]: valor });
  }

  async function confirmarEnfesto() {
    setConfirmandoEnfesto(true);
    setErro('');

    const corpo = {};
    Object.entries(selecoes).forEach(([roloId, quantidade]) => {
      if (quantidade && Number(quantidade) > 0) {
        corpo[roloId] = Number(quantidade);
      }
    });

    try {
      await api.post(`/pedidos/${id}/enfesto`, corpo);
      setSelecoes({});
      await carregarDados();
    } catch (err) {
      setErro(err.response?.data?.erro ?? 'Não foi possível confirmar a programação');
    } finally {
      setConfirmandoEnfesto(false);
    }
  }

  if (carregando) {
    return <p className="page-vazio">Carregando...</p>;
  }

  if (!pedido) {
    return <p className="page-vazio">Pedido não encontrado</p>;
  }

  return (
    <div className="detalhe-pedido-page">
      <div className="page-header">
        <div>
          <Link to="/" className="link-voltar">Pedidos</Link>
          <h1>{pedido.numeroPedido}</h1>
        </div>
        <Badge status={pedido.status} />
      </div>

      {erro && <p className="page-erro">{erro}</p>}

      <div className="detalhe-grid">
        <div className="detalhe-item">
          <span className="detalhe-label">Cliente</span>
          <span className="detalhe-valor">{pedido.cliente?.nome}</span>
        </div>
        <div className="detalhe-item">
          <span className="detalhe-label">Modelo</span>
          <span className="detalhe-valor">{pedido.modelo?.nome}</span>
        </div>
        <div className="detalhe-item">
          <span className="detalhe-label">Cor</span>
          <span className="detalhe-valor">{pedido.cor}</span>
        </div>
        <div className="detalhe-item">
          <span className="detalhe-label">Data de entrega</span>
          <span className="detalhe-valor">{pedido.dataEntrega}</span>
        </div>
        <div className="detalhe-item">
          <span className="detalhe-label">Capas extras por peça</span>
          <span className="detalhe-valor">{pedido.capaExtra}</span>
        </div>
      </div>

      <div className="dashboard-secao">
        <h2>Itens</h2>
        <table className="tabela">
          <thead>
            <tr>
              <th>Tamanho</th>
              <th>Gênero</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {pedido.itens?.map((item) => (
              <tr key={item.id}>
                <td>{item.tamanhoModelo?.tamanho}</td>
                <td>{item.tamanhoModelo?.genero}</td>
                <td>{item.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pedido.status === 'AGUARDANDO_PROGRAMACAO' && sugestao && (
        <div className="dashboard-secao">
          <h2>Programação de enfesto</h2>

          <div className="enfesto-resumo">
            Consumo necessário: <strong>{sugestao.consumoNecessario} m</strong>
          </div>

          {sugestao.rolosDisponiveis.length === 0 ? (
            <p className="page-vazio">Nenhum rolo disponível para este tipo de tecido</p>
          ) : (
            <>
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Rolo</th>
                    <th>Saldo disponível</th>
                    <th>Quantidade a usar (m)</th>
                  </tr>
                </thead>
                <tbody>
                  {sugestao.rolosDisponiveis.map((rolo) => (
                    <tr key={rolo.roloId}>
                      <td>{rolo.codigo}</td>
                      <td>{rolo.saldoDisponivel} m</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          max={rolo.saldoDisponivel}
                          value={selecoes[rolo.roloId] ?? ''}
                          onChange={(e) => atualizarSelecao(rolo.roloId, e.target.value)}
                          className="input-selecao-rolo"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={confirmarEnfesto}
                disabled={confirmandoEnfesto}
                className="botao-primario botao-com-margem"
              >
                {confirmandoEnfesto ? 'Confirmando...' : 'Confirmar programação'}
              </button>
            </>
          )}
        </div>
      )}

      {pedido.status !== 'AGUARDANDO_PROGRAMACAO' && pedido.status !== 'ENTREGUE' && (
        <div className="dashboard-secao">
          <h2>Produção</h2>
          <button onClick={avancarEtapa} disabled={avancando} className="botao-primario">
            {avancando ? 'Avançando...' : 'Avançar etapa'}
          </button>
        </div>
      )}

      <div className="dashboard-secao">
        <h2>Histórico de produção</h2>
        {historico.length === 0 ? (
          <p className="page-vazio">Nenhuma movimentação registrada</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>De</th>
                <th>Para</th>
                <th>Data/hora</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((mov) => (
                <tr key={mov.id}>
                  <td><Badge status={mov.etapaAnterior} /></td>
                  <td><Badge status={mov.etapaNova} /></td>
                  <td>{new Date(mov.dataHora).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DetalhePedidoPage;