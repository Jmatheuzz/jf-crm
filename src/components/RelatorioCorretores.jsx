import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatarReais = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatarData = (dataStr) =>
  new Date(dataStr + 'T00:00:00').toLocaleDateString('pt-BR');

const baixarPDF = (corretores, colunasAtendimento, colunasProcesso, idxSimulacao, dataInicio, dataFim) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  const cabecalho = [
    'Nome',
    'Recebidos',
    'Cond. Qtd.',
    'Cond. Valor',
    ...colunasAtendimento.flatMap((nome, i) =>
      i === idxSimulacao ? [nome, 'Total Simul.'] : [nome]
    ),
    ...colunasProcesso,
  ];

  const linhas = corretores.map((c) => [
    c.nome,
    c.total_recebido_mes,
    c.condicionados?.quantidade ?? 0,
    formatarReais(c.condicionados?.valor_total),
    ...c.etapas_atendimento.flatMap((etapa, i) =>
      i === idxSimulacao
        ? [etapa.quantidade, formatarReais(c.total_simulacao)]
        : [etapa.quantidade]
    ),
    ...c.etapas_processo.map((e) => e.quantidade),
  ]);

  // Índices das colunas de condicionados para colorir de vermelho
  const idxCondQtd = 2;
  const idxCondValor = 3;
  // Índices das colunas de atendimento (começam em 4)
  const inicioAtendimento = 4;
  const totalAtendimento = colunasAtendimento.length + (idxSimulacao >= 0 ? 1 : 0);
  // Índices das colunas de processo
  const inicioProcesso = inicioAtendimento + totalAtendimento;

  doc.setFontSize(13);
  doc.setTextColor(0, 54, 54);
  doc.text('Relatório de Corretores', 40, 35);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Período: ${formatarData(dataInicio)} a ${formatarData(dataFim)}`, 40, 50);
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 40, 62);

  autoTable(doc, {
    startY: 72,
    head: [cabecalho],
    body: linhas,
    styles: { fontSize: 7, cellPadding: 3, halign: 'center' },
    headStyles: { fillColor: [0, 54, 54], textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    didParseCell(data) {
      if (data.section !== 'body') return;
      const col = data.column.index;
      const row = data.row.raw;

      // Condicionados: vermelho se > 0
      if (col === idxCondQtd && Number(row[idxCondQtd]) > 0) {
        data.cell.styles.textColor = [180, 0, 0];
        data.cell.styles.fontStyle = 'bold';
      }
      if (col === idxCondValor && Number(corretores[data.row.index]?.condicionados?.valor_total) > 0) {
        data.cell.styles.textColor = [180, 0, 0];
        data.cell.styles.fontStyle = 'bold';
      }

      // Atendimento: verde se > 0
      if (col >= inicioAtendimento && col < inicioProcesso && Number(row[col]) > 0) {
        data.cell.styles.textColor = [22, 101, 52];
        data.cell.styles.fontStyle = 'bold';
      }

      // Processo: azul se > 0
      if (col >= inicioProcesso && Number(row[col]) > 0) {
        data.cell.styles.textColor = [30, 64, 175];
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  doc.save(`relatorio_corretores_${new Date().toISOString().slice(0, 10)}.pdf`);
};

const RelatorioCorretores = ({ dados, dataInicio, dataFim }) => {
  const corretores = dados

  // Extraímos os nomes das etapas do primeiro registro para montar o cabeçalho dinamicamente
  const colunasAtendimento = corretores[0]?.etapas_atendimento.map(e => e.descricao) || [];
  const colunasProcesso = corretores[0]?.etapas_processo.map(e => e.descricao) || [];

  // Índice da etapa SIMULACAO (pela chave) para inserir total_simulacao após ela
  const idxSimulacao = corretores[0]?.etapas_atendimento.findIndex(e => e.chave === 'SIMULACAO') ?? -1;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">

        {/* Barra de ações */}
        <div className="flex justify-end p-3 border-b border-gray-200">
          <button
            onClick={() => baixarPDF(corretores, colunasAtendimento, colunasProcesso, idxSimulacao, dataInicio, dataFim)}
            disabled={corretores.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#003636] text-white text-sm rounded-lg hover:bg-[#004d4d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ⬇ Baixar PDF
          </button>
        </div>

        {/* Container com scroll horizontal para telas menores */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              {/* Nível 1: Grupos de Colunas */}
              <tr className="bg-[#003636] text-white border-b border-[#002525]">
                <th colSpan="2" className="p-3 border-r border-[#004d4d] text-sm">Dados do Corretor</th>
                <th colSpan="2" className="p-3 border-r border-[#004d4d] text-sm uppercase tracking-wider">Condicionados</th>
                <th colSpan={colunasAtendimento.length + (idxSimulacao >= 0 ? 1 : 0)} className="p-3 border-r border-[#004d4d] text-sm uppercase tracking-wider">Fluxo de Atendimento</th>
                <th colSpan={colunasProcesso.length} className="p-3 text-sm uppercase tracking-wider">Fluxo Habitacional</th>
              </tr>

              {/* Nível 2: Nomes das Etapas */}
              <tr className="bg-[#004444] text-white">
                <th className="p-2 border-r border-[#003636] min-w-[150px]">Nome</th>
                <th className="p-2 border-r border-[#003636]">Recebidos</th>

                {/* Colunas Condicionados */}
                <th className="p-2 border-r border-[#003636] font-normal italic leading-tight min-w-[60px]">Qtd.</th>
                <th className="p-2 border-r border-[#003636] font-normal italic leading-tight min-w-[110px]">Valor Total</th>

                {/* Colunas Dinâmicas de Atendimento */}
                {colunasAtendimento.map((nome, i) => (
                  <React.Fragment key={i}>
                    <th className="p-2 border-r border-[#003636] font-normal italic leading-tight min-w-[80px]">
                      {nome}
                    </th>
                    {i === idxSimulacao && (
                      <th className="p-2 border-r border-[#003636] font-normal italic leading-tight min-w-[60px]">
                        Total Simul.
                      </th>
                    )}
                  </React.Fragment>
                ))}

                {/* Colunas Dinâmicas de Processo */}
                {colunasProcesso.map((nome, i) => (
                  <th key={i} className="p-2 border-r border-[#003636] font-normal italic leading-tight min-w-[80px]">
                                {nome}
                            </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {corretores.map((corretor, index) => (
                <tr key={corretor.corretor_id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-yellow-50 transition-colors`}>
                  {/* Dados Básicos */}
                  <td className="p-2 border border-gray-200 font-bold text-[#003636] sticky left-0 bg-inherit shadow-sm">
                    {corretor.nome}
                  </td>
                  <td className="p-2 border border-gray-200 text-center font-semibold">
                    {corretor.total_recebido_mes}
                  </td>

                  {/* Condicionados */}
                  <td className={`p-2 border border-gray-200 text-center font-bold ${corretor.condicionados?.quantidade > 0 ? 'text-red-600 bg-red-50' : 'text-gray-300'}`}>
                    {corretor.condicionados?.quantidade ?? 0}
                  </td>
                  <td className={`p-2 border border-gray-200 text-center font-bold ${corretor.condicionados?.valor_total > 0 ? 'text-red-600 bg-red-50' : 'text-gray-300'}`}>
                    {formatarReais(corretor.condicionados?.valor_total)}
                  </td>

                  {/* Valores Atendimento */}
                  {corretor.etapas_atendimento.map((etapa, i) => (
                    <React.Fragment key={i}>
                      <td className={`p-2 border border-gray-200 text-center ${etapa.quantidade > 0 ? 'bg-green-50 font-bold text-green-800' : 'text-gray-300'}`}>
                        {etapa.quantidade}
                      </td>
                      {i === idxSimulacao && (
                        <td className={`p-2 border border-gray-200 text-center ${corretor.total_simulacao > 0 ? 'bg-green-50 font-bold text-green-800' : 'text-gray-300'}`}>
                          {formatarReais(corretor.total_simulacao)}
                        </td>
                      )}
                    </React.Fragment>
                  ))}

                  {/* Valores Processo */}
                  {corretor.etapas_processo.map((etapa, i) => (
                    <td key={i} className={`p-2 border border-gray-200 text-center ${etapa.quantidade > 0 ? 'bg-blue-50 font-bold text-blue-800' : 'text-gray-300'}`}>
                      {etapa.quantidade}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {corretores.length === 0 && (
          <div className="p-10 text-center text-gray-500 italic">
            Nenhum dado encontrado para o período selecionado.
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatorioCorretores;
