import React from 'react';

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
import { formatISOToLocale } from '../utils';
import { apiBase } from '../network/api';

// --- Componente VisitCard ---
export const VisitCard = ({ visita, onUpdateStatus }) => {
    // Define a cor e o ícone do Chip com base no status
    const isVisited = visita.confirmada;
    const statusColor = isVisited ? 'success' : 'primary';
    const statusLabel = isVisited ? 'Realizada' : 'Agendada';
    async function confirmarVisita(id) {
        const { data } = await apiBase.post(`/visitas/confirmar/${id}`)
        onUpdateStatus()
    }
    return (
        <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Grid container spacing={1} alignItems="center">
                    
                    {/* Data e Status */}
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                {formatISOToLocale(visita.data_visita)}
                            </Typography>
                        </Box>
                        
                        <Chip 
                            label={statusLabel} 
                            color={statusColor} 
                            size="small" 
                            icon={isVisited ? <CheckCircleIcon /> : null} 
                        />
                    </Grid>

                    {/* Endereço e Ação (Botão) */}
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {visita.imovel.endereco || 'Endereço do Imóvel'}
                            </Typography>
                        </Box>
                        
                        {localStorage.getItem('role') === 'CORRETOR' &&
                            <Box textAlign="right">
                             {!isVisited && (
                                <Button 
                                    variant="contained" 
                                    size="small" 
                                    onClick={() => confirmarVisita(visita.id)}
                                    startIcon={<CheckCircleIcon />}
                                >
                                    Confirmar Visita
                                </Button>
                            )}
                        </Box>
                        }
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

// Exportar o componente se estiver em um arquivo separado
// export default VisitCard;