import React, { useEffect, useState } from 'react';
import { DndContext, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';
import AtendimentoCard from './atendimento/AtendimentoCard';
import { apiBase } from '../network/api';
import { Typography } from '@mui/material';

const DraggableAtendimentoCard = ({ atendimento }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: atendimento.id,
    data: { atendimento },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <AtendimentoCard atendimento={atendimento} isDraggable={true} />
    </div>
  );
};

const DroppableColumn = ({ title, esteira }) => {
  const { setNodeRef } = useDroppable({
    id: title,
  });
  
  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-80 rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-gray-500">{esteira?.length ?? 0} atendimentos</span>
      </div>
      <div className="p-2 space-y-2">
        {esteira?.map((atendimento) => (
          <DraggableAtendimentoCard key={atendimento.id} atendimento={atendimento} />
        ))}
      </div>
    </div>
  );
};

const AtendimentoEsteira = () => {
  const [esteira, setEsteira] = useState([]);
  const [loading, setLoading] = useState(false)
  
  
  const etapas = {
    'Simulação': esteira['Simulação'],
    'Colher documentação': esteira['Colher documentação'],
    'Abertura de conta': esteira['Abertura de conta'],
    'Conformidade de conta': esteira['Conformidade de conta'],
    'Análise de crédito': esteira['Análise de crédito']
  }
  async function getProcesses() {
    const { data } = await apiBase.post(`/atendimentos/grouped-by-etapa`);
    setEsteira(data)

  }
  useEffect(() => {
    async function getData() {
      try {
        setLoading(true)
        await getProcesses()
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [])
  const stages = Object.keys(etapas);
  async function avancarEtapa(processoId) {
    try {
      await apiBase.post(`/atendimentos/${processoId}/proxima-etapa`);
      await getProcesses();
    } catch (e) {
      console.error("Erro ao avançar etapa:", e);
    }
  }
  async function etapaAnterior(processoId) {
    try {
      await apiBase.post(`/atendimentos/${processoId}/etapa-anterior`);
      await getProcesses();
    } catch (e) {
      console.error("Erro ao retroceder etapa:", e);
    }
  }
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeContainer = findContainer(active.id);
      const overContainer = over.id;

      if (activeContainer && overContainer && activeContainer !== overContainer) {
        const atendimentoId = active.id;
        const sourceColumnIndex = stages.indexOf(activeContainer);
        const destinationColumnIndex = stages.indexOf(overContainer);

        if (destinationColumnIndex > sourceColumnIndex) {
          avancarEtapa(atendimentoId);
        } else {
          etapaAnterior(atendimentoId);
        }
      }
    }
  };

  const findContainer = (itemId) => {
    for (const stage of stages) {
      if (esteira[stage]?.some(p => p.id === itemId)) {
        return stage;
      }
    }
    return null;
  };

  if (loading) return <Typography>Carregando...</Typography>

  return (
    <div className="p-4 mx-auto">
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Esteira de Atendimentos</Typography>

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <div className="flex space-x-4 p-4 overflow-x-auto">
          {stages.map((stage) => (
            <DroppableColumn key={stage} title={stage} esteira={esteira[stage]} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default AtendimentoEsteira;