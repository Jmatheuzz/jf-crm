import { useEffect, useState } from "react"
import { apiBase } from "../network/api"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import AtendimentoCard from "../components/atendimento/AtendimentoCard"
import { VisitCard } from "../components/VisitCard";
import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom";
import logo from '../assets/imgs/logo-1.png';

export default function Home() {
    const [processos, setProcessos] = useState([]);
    const [visitas, setVisitas] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false)

    async function getProcesses() {
        const { data } = await apiBase.get('/atendimentos')
        setProcessos(data)
    }

    const navigate = useNavigate()

    async function getVisitas() {
        const { data } = await apiBase.get('/visitas')
        setVisitas(data)
    }

    useEffect(() => {
        async function getData() {
            try {
                setLoading(true)
                await getProcesses()
                await getVisitas()
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [])

    if (loading) return <Typography>Carregando...</Typography>

    return (
        <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <img src={logo} alt="logo" style={{ width: '150px'}} />
                    <Typography variant="h6">
                        Atendimentos
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Olá, {localStorage.getItem('name')}
                    </Typography>
                </Toolbar>
                <Divider />
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant="fullWidth">
                    <Tab label="Atendimentos" />
                    <Tab label="Visitas" />
                </Tabs>
            </AppBar>

            {tabValue === 0 && (
                <Container sx={{ py: 2 }}>
                    {['ATENDIMENTO'].includes(localStorage.getItem('role')) && (
                        <Button variant="contained"
                            
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => navigate('criar-atendimento')}>
                                Criar atendimento

                            </Button>
                    )}
                    {['ATENDIMENTO'].includes(localStorage.getItem('role')) && (
                        <Button
                                        variant="contained"
                                        size="large"
                                        sx={{ mt: 3, mb: 2, ml: 2 }}
                                        onClick={() => navigate('/gerenciar-user')} // Simula login
                                    >
                                        Usuários
                                    </Button>
                    )}
                    {processos.length !== 0 && processos.map((atendimento) => (
                        <AtendimentoCard key={atendimento.id} atendimento={atendimento} />
                    ))}
                    {processos.length === 0 && (
                        <Typography variant="body1" align="center" sx={{ mt: 5, color: 'text.secondary' }}>
                            Nenhum atendimento em andamento.
                        </Typography>
                    )}
                </Container>
            )}
            {tabValue === 1 && (
                <Container sx={{ py: 2 }}>
                    {['CORRETOR', 'ATENDIMENTO'].includes(localStorage.getItem('role')) && (
                        <Button variant="contained"
                            
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => navigate('/criar-visita')}>
                                Criar visita

                            </Button>
                    )}
                    {visitas.length !== 0 && visitas.map((visita) => (
                        <VisitCard key={visita.id} visita={visita} onUpdateStatus={() => getVisitas()} />
                    ))}
                    {visitas.length === 0 && (
                        <Typography variant="body1" align="center" sx={{ mt: 5, color: 'text.secondary' }}>
                            Nenhuma visita encontrada.
                        </Typography>
                    )}
                </Container>
            )}
        </Box>
    )
}