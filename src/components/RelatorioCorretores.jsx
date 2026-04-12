import React from 'react';

const formatarReais = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const RelatorioCorretores = ({ dados }) => {
  const corretores = dados

  // Extraímos os nomes das etapas do primeiro registro para montar o cabeçalho dinamicamente
  const colunasAtendimento = corretores[0]?.etapas_atendimento.map(e => e.descricao) || [];
  const colunasProcesso = corretores[0]?.etapas_processo.map(e => e.descricao) || [];

  // Índice da etapa SIMULACAO (pela chave) para inserir total_simulacao após ela
  const idxSimulacao = corretores[0]?.etapas_atendimento.findIndex(e => e.chave === 'SIMULACAO') ?? -1;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">

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