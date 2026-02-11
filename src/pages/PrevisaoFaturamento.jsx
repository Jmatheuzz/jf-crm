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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import List from '@mui/material/List';
import { ListItem, ListItemText } from "@mui/material";

export default function PrevisaoFaturamento() {
    const [previsaoFaturamento, setPrevisaoFaturamento] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
    const navigate = useNavigate();

    async function getPrevisaoFaturamento() {
        try {
            setLoading(true);
            const { data } = await apiBase.get('/previsao-faturamento');
            console.log('aaaaaaaa', data.data);

            setPrevisaoFaturamento(data.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPrevisaoFaturamento();
    }, []);

    const handleNextMonth = () => {
        if (previsaoFaturamento && currentMonthIndex < previsaoFaturamento.previsao_por_mes?.length - 1) {
            setCurrentMonthIndex(currentMonthIndex + 1);
        }
    };

    const handlePrevMonth = () => {
        if (currentMonthIndex > 0) {
            setCurrentMonthIndex(currentMonthIndex - 1);
        }
    };

    if (loading) return <Typography>Carregando...</Typography>;
    if (!previsaoFaturamento || !previsaoFaturamento?.length) return <Typography>Nenhuma previsão de faturamento encontrada.</Typography>;

    const mesData = previsaoFaturamento && previsaoFaturamento[currentMonthIndex];

    return (
        <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SideMenu sx={{ mr: 2 }} />
                    <img src={logo} alt="logo" style={{ width: '150px' }} />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Previsão de Faturamento
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
                        {mesData?.mes_ano_label}
                    </Typography>
                    <IconButton onClick={handleNextMonth} disabled={currentMonthIndex === previsaoFaturamento?.length - 1}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>

                <Card key={mesData?.mes_ano_label} sx={{ mb: 3, mt: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Total Previsto: R$ {mesData?.total_previsto ? mesData?.total_previsto?.toFixed(2) : '0.00'}
                        </Typography>
                    </CardContent>
                    <List>
                        {mesData.atendimentos.map((atendimento) => (
                            <ListItem key={atendimento.id}>
                                <ListItemText
                                    primary={`Corretor: ${atendimento.corretor_nome} - Valor da simulação: R$ ${Number(atendimento.valor_previsto).toFixed(2)}`}
                                    secondary={`Cliente: ${atendimento.cliente_nome} | Data da simulação: ${new Date(atendimento.data_previsao + " 00:00:00").toLocaleDateString()}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </Container>
        </Box>
    );
}
