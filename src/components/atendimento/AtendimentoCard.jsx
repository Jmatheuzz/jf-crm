

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Person from '@mui/icons-material/Person';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import { formatISOToLocaleDate } from '../../utils';

export default function AtendimentoCard({ atendimento, isDraggable }){
    const cardStyle = {
        mb: 2,
        bgcolor: 'background.paper',
        ...(isDraggable ? {} : { cursor: 'pointer', '&:hover': { backgroundColor: '#005c5c' } })
    };

    const handleClick = () => {
        if (!isDraggable) {
            window.location.href = `/atendimentos/${atendimento.id}`;
        }
    };

    return (
        <Card 
            elevation={2} 
            onClick={handleClick}
            sx={cardStyle}
        >
            <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" color={atendimento.is_active ?'white': 'red'}>
                    Atendimento N° {atendimento.id} {atendimento.is_active ? '' : '(Encerrado)'}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    {atendimento.interesse}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mt: 1 }}>
                    <CalendarMonth fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="caption">Iniciado: {formatISOToLocaleDate(atendimento.created_at)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <Person fontSize="small" sx={{ mr: 1 }} />
                    {['CLIENTE', 'ATENDIMENTO', 'ADMIN'].includes(localStorage.getItem('role')) && <Typography variant="caption">Corretor: {atendimento.corretor.name}</Typography>}
                
                </Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <Person fontSize="small" sx={{ mr: 1 }} />
                
                    {localStorage.getItem('role') !== 'CLIENTE' && <Typography variant="caption">Cliente: {atendimento.cliente.name}</Typography>}
                </Box>
            </CardContent>
        </Card>
    )
}