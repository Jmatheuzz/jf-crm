// Ícones (cada um separado)
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import LockClockOutlined from "@mui/icons-material/LockClockOutlined";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";

// Componentes do MUI (cada um separado)
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiBase } from "../network/api";
import Button from "@mui/material/Button";
import FindImovel from "./FindImovel";

const ProcessoTask = ({ label, status }) => {
    const color = status != 'PENDENTE' ? 'primary' : 'disabled';

    return (
        <ListItem disablePadding sx={{ py: 0.5 }}>
            <Grid container alignItems="center">
                <Grid item xs={10}>
                    <ListItemText primary={label} primaryTypographyProps={{ color: status !== 'PENDENTE' ? 'text.primary' : 'text.secondary' }} />
                </Grid>
                <Grid item xs={2} sx={{ px: 0.5 }} textAlign="right">
                    {status == 'CONCLUIDA' && <CheckCircleOutline color={color} />}
                    {status == 'PENDENTE' && <LockClockOutlined color={color} />}
                    {status == 'EM_ANDAMENTO' && <RadioButtonUnchecked color={color} />}
                </Grid>
            </Grid>
        </ListItem>
    );
};
export const ProcessoDetailScreen = ({ processo }) => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImovel, setSelectedImovel] = useState(null);
    const [observacao, setObservacao] = useState('');
    const [observacaoChanged, setObservacaoChanged] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        async function getData() {
            try {
                const { data } = await apiBase.get(`/processos/${id}`);
                setData(data);
                setObservacao(data.processo.observacao || '');
            } finally {
                setLoading(false);
            }
        }
        getData()
    }, [])

    async function proximaEtapa() {
        try {
            await apiBase.post(`/processos/${id}/proxima-etapa`)
        } catch (e) {

        } finally {
            window.location.reload();
        }
    }

    async function etapaAnterior() {
        try {
            await apiBase.post(`/processos/${id}/etapa-anterior`)
        } catch (e) {

        } finally {
            window.location.reload();
        }
    }

    async function adicionarImovel() {
        try {
            await apiBase.post(`/processos/${id}/adicionar-imovel`, {
                imovel_id: selectedImovel.id
            })
        } catch (e) {

        } finally {
            window.location.reload();
        }
    }

    async function handleSaveObservacao() {
        try {
            await apiBase.put(`/processos/${id}`, { observacao });
            setObservacaoChanged(false);
        } catch (error) {
            console.error('Error saving observation:', error);
        }
    }

    if (loading) {
        return <Typography>Carregando...</Typography>
    }

    const fetchImoveis = async (query) => {
        try {
            const res = await apiBase.get("/imoveis?search=" + query);
            return res.data; // [{ id, nome, cpf }]
        } catch (err) {
            console.error("Erro ao buscar imoveis:", err);
            return [];
        }
    };

    return (
        <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" color="primary" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Atendimento {data.processo.id}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ py: 3 }}>
                {/* INFORMAÇÕES DO CORRETOR */}
                <Card elevation={2} sx={{ mb: 3 }}>
                    <CardContent sx={{ pb: 1 }}>
                        {['CORRETOR', 'ADMIN', 'ATENDIMENTO'].includes(localStorage.getItem('role')) && (
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Cliente: {data.processo.cliente.name}
                            </Typography>)}
                        {['ADMIN', 'ATENDIMENTO', 'CLIENTE'].includes(localStorage.getItem('role')) && (
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Corretor: {data.processo.corretor.name}
                            </Typography>)}
                        {localStorage.getItem('role') === 'CLIENTE' && (
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Whatsapp: {data.processo.corretor.telefone}
                            </Typography>)}
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {data.processo.interesse}
                        </Typography>
                        {
                            ['ADMIN'].includes(localStorage.getItem('role')) && !data.processo?.imovel?.id && (
                                <FindImovel
                                    fecthImoveis={fetchImoveis}
                                    label="Selecionar imóvel"
                                    value={selectedImovel}
                                    onChange={(newImovel) => setSelectedImovel(newImovel)}
                                />
                            )
                        }
                        {
                            data.processo?.imovel?.id && (
                                (
                                    <>
                                        <Typography variant="subtitle1">
                                            Endereço: {data.processo.imovel.endereco}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Valor: R$ {data.processo.imovel.valor}
                                        </Typography>
                                    </>
                                )
                            )
                        }

                    </CardContent>
                </Card>

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.dark' }}>
                    Etapas
                </Typography>
                <Card elevation={2} sx={{ mb: 3 }}>
                    <CardContent>
                        <List disablePadding>
                            {data.timeline && data.timeline.map((etapa, index) => (
                                <ProcessoTask key={index} label={etapa.descricao} status={etapa.status} />
                            ))}
                        </List>
                    </CardContent>
                </Card>
                {
                    localStorage.getItem('role') === 'ADMIN' && (
                        <Card sx={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button
                                variant="contained"

                                size="large"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => etapaAnterior()} // Simula criação e avança
                            >Anterior</Button>

                            {
                                selectedImovel && (
                                    <Button
                                        variant="contained"

                                        size="large"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={() => adicionarImovel()} // Simula criação e avança
                                    >Salvar imóvel</Button>
                                )
                            }

                            <Button
                                variant="contained"

                                size="large"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => proximaEtapa()} // Simula criação e avança
                            >Proximo</Button>
                        </Card>
                    )
                }
                {
                    localStorage.getItem('role') === 'ADMIN' && (
                        <Card sx={{ mt: 3, p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Observação do Processo
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={observacao}
                                onChange={(e) => {
                                    setObservacao(e.target.value);
                                    setObservacaoChanged(true);
                                }}
                                variant="outlined"
                            />
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ mt: 2 }}
                                onClick={handleSaveObservacao}
                                disabled={!observacaoChanged}
                            >
                                Salvar Observação
                            </Button>
                        </Card>
                    )
                }
            </Container>
        </Box>
    )
};