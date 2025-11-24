const etapasPre = {
  COLETA_DOCUMENTACAO: "Coleta de Documentação",
  ANALISE_CREDITO: "Análise de Crédito",
  RESERVA: "Reserva do imóvel",
};

const etapasProcesso = {
  CONTRATO_EMPREITADA: "Contrato de Empreitada",
  CONFECCAO_PROJETO: "Confecção do Projeto",
  ENTREGA_PREFEITURA: "Entrega na Prefeitura",
  ANALISE_CREDITO_CAIXA: "Análise de Crédito Caixa",
  AVALIACAO_IMOVEL_CAIXA: "Avaliação do Imóvel Caixa",
  ASSINATURA_CONTRATO: "Assinatura do Contrato",
  REGISTRO_CARTORIO: "Registro em Cartório",
  FINALIZADO: "Processo Finalizado"
};


export function mapearEtapasPreAnalise(texto) {
  const resultados = Object.entries(etapasPre).map(([chave, valor]) => {
    return {
      valor,
      isCompletado: valor.toLowerCase() === texto.toLowerCase()
    };
  });
  return resultados;
}

export function mapearEtapasProcessoHabitacional(texto) {
  const resultados = Object.entries(etapasProcesso).map(([chave, valor]) => {
    return {
      valor,
      isCompletado: valor.toLowerCase() === texto.toLowerCase()
    };
  });
  return resultados;
}

export function formatISOToLocaleDate(isoDate, locale = 'pt-BR') {
  const date = new Date(isoDate); // cria a data completa, incluindo hora
  return date.toLocaleString(locale, { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false // opcional, para formato 24h
  });
}

export function formatISOToLocale(isoDate, locale = 'pt-BR') {
  const date = new Date(isoDate); // cria a data completa, incluindo hora
  return date.toLocaleString(locale, { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // opcional, para formato 24h
  });
}


export function formatToBRL(valor) {
  if(!valor) valor = 0;
  console.log(valor);
  
  const numero = typeof valor === 'string' ? parseFloat(valor.replace(/\D/g, "")) / 100 : valor
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export function removeMask(valorFormatado) {
  return Number(valorFormatado.replace(/\D/g, "")) / 100;
}

export function applyCpfCnpjMask(value) {
  const numeric = value.replace(/\D/g, '');

  if (numeric.length <= 11) {
    // CPF: 000.000.000-00
    return numeric
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  } else {
    // CNPJ: 00.000.000/0000-00
    return numeric
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
  }
}

export function removeCpfCnpjMask(value) {
  return value.replace(/\D/g, '');
}

// 📞 Telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
export function applyPhoneMask(value) {
  const numeric = value.replace(/\D/g, '');

  if (numeric.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return numeric
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // Celular: (XX) XXXXX-XXXX
    return numeric
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
}

export function removePhoneMask(value) {
  return value.replace(/\D/g, '');
}

// 🏠 CEP: 00000-000
export function applyCepMask(value) {
  const numeric = value.replace(/\D/g, '');
  return numeric.replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
}

export function removeCepMask(value) {
  return value.replace(/\D/g, '');
}
