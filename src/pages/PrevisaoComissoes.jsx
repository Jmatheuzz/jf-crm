import { useEffect, useState } from "react";
import { apiBase } from "../network/api";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import logo from '../assets/imgs/logo-1.png';
import SideMenu from "../components/SideMenu";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function PrevisaoComissoes() {
    const [previsao, setPrevisao] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
    const navigate = useNavigate();

    // Helper function to format the month string
    const formatMonth = (monthString) => {
        const [year, month] = monthString.split('-');
        const date = new Date(year, month - 1); // Month is 0-indexed in JavaScript
        return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    };

    async function getPrevisaoComissoes() {
        try {
            setLoading(true);
            const { data } = await apiBase.get('/comissoes/previsao');
            setPrevisao(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPrevisaoComissoes();
    }, []);

    const handleNextMonth = () => {
        if (previsao && currentMonthIndex < previsao.previsao_por_mes.length - 1) {
            setCurrentMonthIndex(currentMonthIndex + 1);
        }
    };

    const handlePrevMonth = () => {
        if (currentMonthIndex > 0) {
            setCurrentMonthIndex(currentMonthIndex - 1);
        }
    };

    if (loading) return <Typography>Carregando...</Typography>;
    if (!previsao || previsao.previsao_por_mes.length === 0) return <Typography>Nenhuma previsão de comissão encontrada.</Typography>;

    const mesData = previsao.previsao_por_mes[currentMonthIndex];

    return (
        <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SideMenu sx={{ mr: 2 }} />
                    <img src={logo} alt="logo" style={{ width: '150px'}} />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Previsão de Comissões
                    </Typography>
                </Toolbar>
                <Divider />
            </AppBar>

            <Container sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <IconButton onClick={handlePrevMonth} disabled={currentMonthIndex === 0}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ mx: 2, textTransform: 'capitalize' }}>
                        {formatMonth(mesData.mes)}
                    </Typography>
                    <IconButton onClick={handleNextMonth} disabled={currentMonthIndex === previsao.previsao_por_mes.length - 1}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>

                <Card key={mesData.mes} sx={{ mb: 3, mt: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Total: R$ {mesData.total_mes ? mesData.total_mes.toFixed(2) : '0.00'}
                        </Typography>
                        <List>
                            {mesData.comissoes.map((comissao) => (
                                <ListItem key={comissao.id}>
                                    <ListItemText
                                        primary={`Corretor: ${comissao.processo_habitacional.corretor.name} - Valor: R$ ${Number(comissao.valor).toFixed(2)}`}
                                        secondary={`Cliente: ${comissao.processo_habitacional.cliente.name} | Etapa: ${comissao.processo_habitacional.etapa} | Data da assinatura: ${new Date(comissao.processo_habitacional.data_assinatura).toLocaleDateString()}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
