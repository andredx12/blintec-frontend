import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './NovoPedidoPage.css';

function NovoPedidoPage() {
  const navigate = useNavigate();

  const [modelos, setModelos] = useState([]);
  const [tamanhos, setTamanhos] = useState([]);

  const [clienteNome, setClienteNome] = useState('');
  const [modeloId, setModeloId] = useState('');
  const [numeroPedido, setNumeroPedido] = useState('');
  const [cor, setCor] = useState('');
  const [capaExtra, setCapaExtra] = useState(0);
  const [dataEntrega, setDataEntrega] = useState('');
  const [itens, setItens] = useState([{ tamanhoModeloId: '', quantidade: '' }]);

  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    api.get('/modelos').then((response) => setModelos(response.data));
  }, []);

  useEffect(() => {
    if (!modeloId) {
      setTamanhos([]);
      return;
    }
    api.get(`/modelos/${modeloId}/tamanhos`).then((response) => setTamanhos(response.data));
  }, [modeloId]);

  function adicionarItem() {
    setItens([...itens, { tamanhoModeloId: '', quantidade: '' }]);
  }

  function removerItem(index) {
    setItens(itens.filter((_, i) => i !== index));
  }

  function atualizarItem(index, campo, valor) {
    const novosItens = [...itens];
    novosItens[index][campo] = valor;
    setItens(novosItens);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      await api.post('/pedidos', {
        clienteNome,
        numeroPedido,
        modeloId: Number(modeloId),
        cor,
        capaExtra,
        dataEntrega,
        itens: itens.map((item) => ({
          tamanhoModeloId: Number(item.tamanhoModeloId),
          quantidade: Number(item.quantidade),
        })),
      });
      navigate('/');
    } catch (err) {
      setErro('Não foi possível criar o pedido. Verifique os dados informados.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="novo-pedido-page">
      <div className="page-header">
        <div>
          <h1>Novo pedido</h1>
          <p className="page-descricao">Preencha os dados abaixo para registrar um novo pedido de produção.</p>
        </div>
      </div>

      {erro && <p className="page-erro">{erro}</p>}

      <form onSubmit={handleSubmit} className="pedido-form">
        <section className="form-secao">
          <div className="form-field">
            <label htmlFor="numeroPedido">Número do pedido</label>
            <input
              id="numeroPedido"
              value={numeroPedido}
              onChange={(e) => setNumeroPedido(e.target.value)}
              placeholder="Ex: PED-2026-0010"
              required
            />
          </div>
        </section>

        <section className="form-secao">
          <h2 className="form-secao-titulo">Informações do pedido</h2>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="clienteNome">Cliente</label>
              <input
                id="clienteNome"
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                placeholder="Digite o nome do cliente"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="modelo">Modelo</label>
              <select id="modelo" value={modeloId} onChange={(e) => setModeloId(e.target.value)} required>
                <option value="">Selecione</option>
                {modelos.map((modelo) => (
                  <option key={modelo.id} value={modelo.id}>{modelo.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="cor">Cor</label>
              <input id="cor" value={cor} onChange={(e) => setCor(e.target.value)} placeholder="Ex: Preto" required />
            </div>

            <div className="form-field">
              <label htmlFor="dataEntrega">Data de entrega</label>
              <input
                id="dataEntrega"
                type="date"
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <section className="form-secao">
          <div className="form-field">
            <label htmlFor="capaExtra">Capas extras por peça</label>
            <input
              id="capaExtra"
              type="number"
              min="0"
              value={capaExtra}
              onChange={(e) => setCapaExtra(Number(e.target.value))}
            />
          </div>
        </section>

        <div className="itens-section">
          <div className="itens-header">
            <h2>Itens</h2>
            <button type="button" onClick={adicionarItem} className="botao-secundario">
              Adicionar item
            </button>
          </div>

          {itens.map((item, index) => (
            <div key={index} className="item-linha">
              <select
                value={item.tamanhoModeloId}
                onChange={(e) => atualizarItem(index, 'tamanhoModeloId', e.target.value)}
                disabled={!modeloId}
                required
              >
                <option value="">Tamanho</option>
                {tamanhos.map((tamanho) => (
                  <option key={tamanho.id} value={tamanho.id}>
                    {tamanho.tamanho} ({tamanho.genero})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                placeholder="Quantidade"
                value={item.quantidade}
                onChange={(e) => atualizarItem(index, 'quantidade', e.target.value)}
                required
              />

              {itens.length > 1 && (
                <button type="button" onClick={() => removerItem(index)} className="botao-remover">
                  Remover
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="botao-secundario">
            Cancelar
          </button>
          <button type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Criar pedido'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NovoPedidoPage;