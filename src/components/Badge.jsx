import './Badge.css';

const CONFIG_STATUS = {
  AGUARDANDO_PROGRAMACAO: { label: 'Aguardando programação', tom: 'neutro' },
  PROGRAMADO: { label: 'Programado', tom: 'info' },
  EM_CORTE: { label: 'Em corte', tom: 'info' },
  EM_COSTURA: { label: 'Em costura', tom: 'info' },
  EM_ARREMATACAO: { label: 'Em arrematação', tom: 'info' },
  EM_EXPEDICAO: { label: 'Em expedição', tom: 'aviso' },
  ENTREGUE: { label: 'Entregue', tom: 'sucesso' },
};

function Badge({ status }) {
  const config = CONFIG_STATUS[status] ?? { label: status, tom: 'neutro' };

  return <span className={`badge badge-${config.tom}`}>{config.label}</span>;
}

export default Badge;