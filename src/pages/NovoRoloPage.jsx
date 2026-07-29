import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './NovoRoloPage.css';

function NovoRoloPage() {
  const navigate = useNavigate();

  const [tiposTecido, setTiposTecido] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [tipoTecidoId, setTipoTecidoId] = useState('');
  const [cor, setCor] = useState('');
  const [metragemInicial, setMetragemInicial] = useState('');

  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    api.get('/tipos-tecido').then((response) => setTiposTecido(response.data));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      await api.post('/rolos', {
        codigo,
        tipoTecido: { id: Number(tipoTecidoId) },
        cor,
        metragemInicial: Number(metragemInicial),
        saldoAtual: 0,
      });
      navigate('/estoque');
    } catch (err) {
      setErro('Não foi possível cadastrar o rolo. Verifique os dados informados.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="novo-rolo-page">
      <div className="page-header">
        <h1>Novo rolo</h1>
      </div>

      {erro && <p className="page-erro">{erro}</p>}

      <form onSubmit={handleSubmit} className="rolo-form">
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="codigo">Código</label>
            <input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="tipoTecido">Tipo de tecido</label>
            <select
              id="tipoTecido"
              value={tipoTecidoId}
              onChange={(e) => setTipoTecidoId(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {tiposTecido.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="cor">Cor</label>
            <input id="cor" value={cor} onChange={(e) => setCor(e.target.value)} required />
          </div>

          <div className="form-field">
            <label htmlFor="metragemInicial">Metragem inicial (m)</label>
            <input
              id="metragemInicial"
              type="number"
              step="0.01"
              min="0.01"
              value={metragemInicial}
              onChange={(e) => setMetragemInicial(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/estoque')} className="botao-secundario">
            Cancelar
          </button>
          <button type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Cadastrar rolo'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NovoRoloPage;