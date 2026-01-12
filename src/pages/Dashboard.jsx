// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { apiBase } from "../network/api";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import SpeedIcon from '@mui/icons-material/Speed';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { AppBar, Tab, Tabs, Toolbar } from '@mui/material';
import SideMenu from '../components/SideMenu';
import logo from '../assets/imgs/logo-1.png';
// --- Componente Principal ---
export default function Dashboard() {
    // Função genérica para buscar dados
    const fetchData = async (endpoint) => {
        try {
            const { data, status } = await apiBase.get(`${endpoint}`);

            return data;
        } finally {

        }
    };

    // --- Funções Específicas para Métricas ---

    // A maioria das suas métricas retorna um ResponseOk que encapsula o valor
    const fetchMetricaSimples = async (endpoint) => {
        const data = await fetchData(endpoint);
        // Retorna o campo 'valor' dentro do ResponseOk, ou o objeto se a estrutura for diferente

        return data ? data.valor : null;
    };

    const fetchRankingCorretores = () => {
        return fetchData('/ranking-corretores');
    };

    const fetchPipelineCorretores = () => {
        return fetchData('/pipeline-corretores');
    };
    const [kpis, setKpis] = useState({});
    const [ranking, setRanking] = useState([]);
    const [pipeline, setPipeline] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            // Lógica de busca de dados (mantida de src/Dashboard.jsx anterior)
            const [taxaConversao, totalClientes, funil, tempoMedio] = await Promise.all([
                fetchMetricaSimples('/taxa-conversao'),
                fetchMetricaSimples('/quantidade-clientes'),
                fetchMetricaSimples('/quantidade-processo-por-etapa'),
                fetchMetricaSimples('/tempo-medio-processo'),
            ]);
            console.log(tempoMedio);
            setKpis({
                taxaConversao,
                totalClientes,
                funil: funil || {},
                tempoMedio,
            });

            const [rankingData, pipelineData] = await Promise.all([
                fetchRankingCorretores(),
                fetchPipelineCorretores(),
            ]);

            setRanking(rankingData || []);
            setPipeline(pipelineData || []);
            setLoading(false);
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Carregando Métricas...
                </Typography>
            </Box>
        );
    }

    // Converte o funil (objeto) em uma lista de objetos para exibição fácil
    const funilData = Object.entries(kpis.funil).map(([etapa, quantidade]) => ({ etapa, quantidade }));
    console.log(funilData);
    console.log(funilData.reduce((acc, curr) => acc + curr.quantidade, 0));



    return (
        <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SideMenu sx={{ mr: 2 }} /> {/* Add SideMenu here */}
                    <img src={logo} alt="logo" style={{ width: '150px' }} />
                    <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 'auto' }}>
                        Olá, {localStorage.getItem('name')}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container sx={{ py: 1 }}>
                <Button
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2, mr: 2 }}
                    onClick={() => navigate('/gerenciar-imovel')} // Simula login
                >
                    Gerenciar imóveis
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => navigate('/gerenciar-user')} // Simula login
                >
                    Gerenciar usuários
                </Button>
                <Button variant="contained"

                    size="large"
                    sx={{ mt: 3, mb: 2, ml: 2 }}
                    onClick={() => navigate('/gerenciar-processo')}>
                    Gerenciar processos habitacionais

                </Button>
                <Button variant="contained"

                    size="large"
                    sx={{ mt: 3, mb: 2, ml: 2 }}
                    onClick={() => navigate('/gerenciar-atendimento')}>
                    Gerenciar atendimentos

                </Button>
                <Button variant="contained"

                    size="large"
                    sx={{ mt: 3, mb: 2, ml: 2 }}
                    onClick={() => navigate('/esteira-atendimentos')}>
                    Esteira de atendimentos iniciais
                </Button>
                <Button variant="contained"

                    size="large"
                    sx={{ mt: 3, mb: 2, ml: 2 }}
                    onClick={() => navigate('/esteira-processos')}>
                    Esteira de processos habitacionais
                </Button>
                <Button variant="contained"

                    size="large"
                    sx={{ mt: 3, mb: 2, ml: 2 }}
                    onClick={() => navigate('/comissoes')}>
                    Comissões
                </Button>

                <Button variant="contained"

                    size="large"
                    sx={{ mt: 3, mb: 2, ml: 2 }}
                    onClick={() => navigate('/resumo-corretores')}>
                    Relatório de Corretores
                </Button>

                <Button variant="contained"

                    size="large"
                    sx={{ mt: 3, mb: 2, ml: 2 }}
                    onClick={() => navigate('/previsao-comissoes')}>
                    Previsão de Comissões
                </Button>

                {/* SEÇÃO 1: KPIs (4 Cartões de Destaque) */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <KpiCard
                        title="Taxa de Conversão"
                        value={`${(kpis.taxaConversao * 100).toFixed(2)}%`}
                        icon={<TrendingUpIcon />}
                    />
                    <KpiCard
                        title="Total de Clientes"
                        value={kpis.totalClientes}
                        icon={<PeopleIcon />}
                    />
                    <KpiCard
                        title="Tempo Médio do Ciclo"
                        value={kpis.tempoMedio ? `${kpis.tempoMedio.toFixed(1)} dias` : '0 dias'}
                        icon={<SpeedIcon />}
                    />
                    <KpiCard
                        title="Total de Processos Ativos"
                        value={funilData.reduce((acc, curr) => acc + curr.quantidade, 0)}
                        icon={<AccountTreeIcon />}
                    />
                </Grid>

                <Grid container spacing={3}>
                    {/* FUNIL POR ETAPA (Esquerda - 40%) */}
                    <Grid item xs={12} md={5}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    📊 Funil de Processos (Etapas)
                                </Typography>
                                <FunilTable data={funilData} />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* RANKING DE CORRETORES (Direita - 60%) */}
                    <Grid item xs={12} md={7}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    🥇 Ranking de Performance (Vendas)
                                </Typography>
                                <RankingTable data={ranking} />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* PIPELINE DETALHADO (Linha inteira) */}
                    <Grid item xs={12}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    📋 Pipeline Detalhado por Corretor
                                </Typography>
                                <PipelineList data={pipeline} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

// --- Componentes Auxiliares com MUI ---

const KpiCard = ({ title, value, icon }) => (
    <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: 120, bgcolor: 'background.paper' }}>
            <Box sx={{ color: 'primary.main', mr: 2, fontSize: 40 }}>
                {icon}
            </Box>
            <Box>
                <Typography color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" component="div">
                    {value}
                </Typography>
            </Box>
        </Card>
    </Grid>
);

const FunilTable = ({ data }) => {
    const navigate = useNavigate();

    return (
        <TableContainer component={Paper} elevation={3}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'background.paper' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Etapa</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Processos</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index} hover onClick={() => navigate(`/processos-etapa/${item.etapa}`)}>
                            <TableCell>{item.etapa}</TableCell>
                            <TableCell align="right">{item.quantidade}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
};

const RankingTable = ({ data }) => (
    <TableContainer component={Paper} elevation={3}>
        <Table size="small">
            <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Corretor</TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Visitas</TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Processos</TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Taxa Conv.</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map(c => (
                    <TableRow key={c.corretorId} hover>
                        <TableCell>{c.nomeCorretor}</TableCell>
                        <TableCell align="right">{c.visitasAgendadas}</TableCell>
                        <TableCell align="right">{c.processosIniciados}</TableCell>
                        <TableCell align="right">{c.taxaConversao.toFixed(2)}%</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

const PipelineList = ({ data }) => {
    const corretoresComProcessos = data.filter(c => c.totalProcessosEmAndamento > 0);

    if (corretoresComProcessos.length === 0) {
        return <Typography variant="body1">Nenhum processo em andamento no pipeline.</Typography>;
    }

    return (
        <Grid container spacing={3}>
            {corretoresComProcessos.map(c => (
                <Grid item xs={12} sm={6} md={4} key={c.corretorId}>
                    <Card sx={{ bgcolor: 'background.paper' }}>
                        <CardContent sx={{ p: 1.5 }}>
                            <Typography variant="subtitle1" component="h4" color="primary.dark">
                                {c.nomeCorretor} ({c.totalProcessosEmAndamento} Processos)
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <List dense disablePadding>
                                {c.processos.map(p => {
                                    if (['CONTRATO_EMPREITADA', 'CONFECCAO_PROJETO', 'APROVACAO_MUNICIPAL', 'ABERTURA_OS', 'AVALIACAO_CAIXA', 'CONFORMIDADE_PROCESSO'].includes(p.etapaEnum)) {
                                        return (
                                            <ListItem key={p.id} sx={{ py: 0, px: 0 }}>
                                                <ListItemText
                                                    primary={p.clienteNome || `ID: ${p.id}`}
                                                    secondary={`Etapa: ${p.etapaAtual}`}
                                                    primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9em' }}
                                                    secondaryTypographyProps={{ fontSize: '0.8em' }}
                                                />
                                            </ListItem>
                                        )
                                    }
                                })}
                                <hr/>
                                {c.processos.map(p => {
                                    if (['ASSINATURA_CONTRATO', 'REGISTRO_CARTORIO', 'HABITISE_EMITIDO', 'AVERBACAO_OBRA', 'IMOVEL_ENTREGUE'].includes(p.etapaEnum)) {
                                        return (
                                            <ListItem key={p.id} sx={{ py: 0, px: 0 }}>
                                                <ListItemText
                                                    primary={p.clienteNome || `ID: ${p.id}`}
                                                    secondary={`Etapa: ${p.etapaAtual}`}
                                                    primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9em' }}
                                                    secondaryTypographyProps={{ fontSize: '0.8em' }}
                                                />
                                            </ListItem>
                                        )
                                    }
                                })}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};