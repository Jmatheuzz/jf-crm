import { useEffect, useState } from "react";
import { apiBase } from "../network/api";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from '../assets/imgs/logo-1.png';
import SideMenu from "../components/SideMenu";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import RelatorioCorretores from "../components/RelatorioCorretores";

function primeiroDiaMes() {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
}

function ultimoDiaMes() {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().split('T')[0];
}

export default function ResumoCorretores() {
    const [corretores, setCorretores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [relatorio, setRelatorio] = useState([]);
    const [loadingRelatorio, setLoadingRelatorio] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const dataInicio = searchParams.get('data_inicio') || primeiroDiaMes();
    const dataFim = searchParams.get('data_fim') || ultimoDiaMes();

    async function getCorretores() {
        try {
            setLoading(true);
            const { data } = await apiBase.get('/users?role=CORRETOR');
            setCorretores(data);
        } finally {
            setLoading(false);
        }
    }

    async function getRelatorio() {
        try {
            setLoadingRelatorio(true);
            const { data } = await apiBase.get('/relatorio-corretores', {
                params: { data_inicio: dataInicio, data_fim: dataFim },
            });
            setRelatorio(data?.data || []);
        } finally {
            setLoadingRelatorio(false);
        }
    }

    useEffect(() => {
        getCorretores();
    }, []);

    useEffect(() => {
        getRelatorio();
    }, [dataInicio, dataFim]);

    function handleDataInicio(e) {
        setSearchParams({ data_inicio: e.target.value, data_fim: dataFim });
    }

    function handleDataFim(e) {
        setSearchParams({ data_inicio: dataInicio, data_fim: e.target.value });
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SideMenu sx={{ mr: 2 }} />
                    <img src={logo} alt="logo" style={{ width: '150px' }} />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Resumo dos Corretores
                    </Typography>
                </Toolbar>
                <Divider />
            </AppBar>

            <Container sx={{ py: 2 }}>
                {/* Lista de Corretores */}
                {loading ? (
                    <Typography>Carregando...</Typography>
                ) : (
                    <List>
                        {corretores.map((corretor) => (
                            <ListItem button key={corretor.id} onClick={() => navigate(`/corretor/${corretor.id}/processos`)}>
                                <ListItemText primary={corretor.name} sx={{ cursor: 'pointer' }} />
                            </ListItem>
                        ))}
                    </List>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Filtros de Data */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Relatório de Corretores</Typography>
                    <TextField
                        label="Data início"
                        type="date"
                        size="small"
                        value={dataInicio}
                        onChange={handleDataInicio}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                        label="Data fim"
                        type="date"
                        size="small"
                        value={dataFim}
                        onChange={handleDataFim}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <Button variant="outlined" size="small" onClick={getRelatorio}>
                        Atualizar
                    </Button>
                </Box>

                {/* Tabela Relatório */}
                {loadingRelatorio ? (
                    <Typography>Carregando relatório...</Typography>
                ) : relatorio.length > 0 ? (
                    <RelatorioCorretores dados={relatorio} />
                ) : (
                    <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Nenhum dado encontrado para o período selecionado.
                    </Typography>
                )}
            </Container>
        </Box>
    );
}
