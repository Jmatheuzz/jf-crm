import React, { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatISOToLocaleDate, formatToBRL } from '../utils';
import { apiBase } from '../network/api';
import ConfirmationModal from './ConfirmationModal';

// --- Componente VisitCard ---
const ComissaoCard = ({ comissao, onUpdateStatus }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [comissaoToUpdate, setComissaoToUpdate] = useState(null);
    const [newStatus, setNewStatus] = useState(null);
    // Define a cor e o ícone do Chip com base no status
    const isPago = comissao.pago;
    const statusColor = isPago ? 'success' : 'warning';
    const statusLabel = isPago ? 'Pago' : 'Pendente';

    const handleConfirmAction = (id, value) => {
        console.log('abc');
        
        setComissaoToUpdate(id);
        setNewStatus(value);
        setShowConfirmModal(true);
    };

    const executeConfirmarVisita = async () => {
        try {
            await apiBase.put(`/comissoes/${comissaoToUpdate}`, { pago: newStatus });
            onUpdateStatus();
        } catch (error) {
            console.error("Erro ao atualizar status da comissão:", error);
            // Optionally, show an error message to the user
        } finally {
            setShowConfirmModal(false);
            setComissaoToUpdate(null);
            setNewStatus(null);
        }
    };
    return (
        <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Grid container spacing={1} alignItems="center">

                    {/* Data e Status */}
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Criado em: {formatISOToLocaleDate(comissao.created_at)}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Valor: {formatToBRL(comissao.valor)}
                            </Typography>
                        </Box>
                        {comissao.processo_habitacional?.imovel?.valor &&
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Valor do imóvel: {formatToBRL(comissao.processo_habitacional.imovel.valor)}
                            </Typography>
                        </Box>
                        }
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Corretor: {comissao.processo_habitacional.corretor.name}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Cliente: {comissao.processo_habitacional.cliente.name}
                            </Typography>
                        </Box>

                        <Chip
                            label={statusLabel}
                            color={statusColor}
                            size="small"
                            icon={isPago ? <CheckCircleIcon /> : null}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleConfirmAction(comissao.id, !isPago)}
                                startIcon={<CheckCircleIcon />}
                            >
                                {isPago ? 'Marcar como Pendente' : 'Marcar como Pago'}
                            </Button>
                
                            
                        </Box>
                    </Grid>

                    {/* Endereço e Ação (Botão) */}
                    <Grid item xs={12} sm={6}>

                        
                        
                    </Grid>
                </Grid>
                <ConfirmationModal
                                open={showConfirmModal}
                                onCancel={() => setShowConfirmModal(false)}
                                onConfirm={executeConfirmarVisita}
                                title={
                                    isPago
                                        ? 'Tem certeza que deseja marcar esta comissão como PENDENTE?'
                                        : 'Tem certeza que deseja marcar esta comissão como PAGA?'
                                }
                            />
            </CardContent>
        </Card>
    );
};

export const Comissao = () => {

    const [comissoes, setComissoes] = useState([]);
    const [loading, setLoading] = useState(false)



    async function getComissoes() {
        const { data } = await apiBase.get('/comissoes')
        setComissoes(data)
    }

    useEffect(() => {
        async function getData() {
            try {
                setLoading(true)
                await getComissoes()
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [])

    if (loading) return <Typography>Carregando...</Typography>

    return (
        <div className="p-4 mx-auto">
            <Typography variant="h4">Comissões</Typography>
            {comissoes.length !== 0 && comissoes.map((comissao) => (
                <ComissaoCard key={comissao.id} comissao={comissao} onUpdateStatus={() => getComissoes()} />
            ))}
            {comissoes.length === 0 && (
                                    <Typography variant="body1" align="center" sx={{ mt: 5, color: 'text.secondary' }}>
                                        Nenhuma comissão encontrada.
                                    </Typography>
                                )}
        </div>
    );
}