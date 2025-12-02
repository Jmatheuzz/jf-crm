

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Person from '@mui/icons-material/Person';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import { formatISOToLocaleDate } from '../../utils';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import ConfirmationModal from '../ConfirmationModal';
import { apiBase } from '../../network/api';
import { Trash2 } from 'lucide-react';

export default function ProcessoCard({ processo }) {
      const [open, setOpen] = useState(false);
      const [idToDelete, setIdToDelete] = useState(null);
      const handleConfirm = async () => {
            setOpen(false);
            await apiBase.delete(`/processos/${idToDelete}`);
            setIdToDelete(null)
            window.location.reload();
          }
    return (
        <Card
            elevation={2}
        
            sx={{ mb: 2 }}
        >
            <CardContent sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: '#005c5c' }}} onClick={() => window.location.href = `/processos/${processo.id}`}>
                <Typography variant="subtitle2" color="text.secondary">
                    Processo N° {processo?.id}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    {processo.interesse}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mt: 1 }}>
                    <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="caption">Etapa: {processo.descricao_etapa}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mt: 1 }}>
                    <CalendarMonth fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="caption">Iniciado: {formatISOToLocaleDate(processo.created_at)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <Person fontSize="small" sx={{ mr: 1 }} />
                    {['CLIENTE', 'ATENDIMENTO', 'ADMIN', 'CORRETOR'].includes(localStorage.getItem('role')) && <Typography variant="caption">Corretor: {processo.corretor.name}</Typography>}

                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <Person fontSize="small" sx={{ mr: 1 }} />

                    {localStorage.getItem('role') !== 'CLIENTE' && <Typography variant="caption">Cliente: {processo.cliente.name}</Typography>}
                </Box>
            
            </CardContent>
            <Box sx={{p: 2, cursor: 'pointer', display: 'flex', justifyContent: 'flex-end'}}>
                <Trash2 className="w-4 h-4" color='red' onClick={() => {
                    setOpen(true)
                    setIdToDelete(processo.id)
                }} />
            </Box>
            <ConfirmationModal
                          open={open}
                          title="Excluir item"
                          description="Deseja realmente excluir este processo? Esta ação é irreversível."
                          confirmLabel="Excluir"
                          cancelLabel="Cancelar"
                          onConfirm={handleConfirm}
                          onCancel={() => {
                            setOpen(false);
                            setIdToDelete(null)
                          }}
                        />
        </Card>
    )
}