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
import ProcessoCard from "../components/processo/ProcessoCard"
import { VisitCard } from "../components/VisitCard";
import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

export default function AdminProcesso() {
    const [processos, setProcessos] = useState([]);
    const [esteira, setEsteira] = useState([]);
    const [visitas, setVisitas] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStage, setSelectedStage] = useState("Todos");

    const stageEnum = {
        'COLETA_DOCUMENTACAO'   : 'Coleta de Documentação',
        'ANALISE_CREDITO'       : 'Análise de Crédito',
        'APROVADO'              : 'Aprovado',
        'ENTREVISTA_GERENCIAL'  : 'Entrevista gerencial',
        'CONTRATO_EMPREITADA'   : 'Contrato de Empreitada',
        'CONFECCAO_PROJETO'     : 'Confecção do Projeto',
        'ENTREGA_PREFEITURA'    : 'Entrega na Prefeitura',
        'ANALISE_CREDITO_CAIXA' : 'Análise de Crédito Caixa',
        'AVALIACAO_IMOVEL_CAIXA': 'Avaliação do Imóvel Caixa',
        'ASSINATURA_CONTRATO'   : 'Assinatura do Contrato',
        'REGISTRO_CARTORIO'     : 'Registro em Cartório',
        'FINALIZADO'            : 'Processo Finalizado',
    };

    const stages = [{ value: 'Todos', label: 'Todos' }, ...Object.entries(stageEnum).map(([value, label]) => ({ value, label }))];

    async function getProcesses() {
        const { data } = await apiBase.get('/processos')
        setProcessos(data)
    }

    async function avancarEtapa(processoId) {
        try {
            await apiBase.post(`/processos/${processoId}/proxima-etapa`);
            await getProcesses();
        } catch (e) {
            console.error("Erro ao avançar etapa:", e);
        }
    }

    async function etapaAnterior(processoId) {
        try {
            await apiBase.post(`/processos/${processoId}/etapa-anterior`);
            await getProcesses();
        } catch (e) {
            console.error("Erro ao retroceder etapa:", e);
        }
    }

    const navigate = useNavigate()

    useEffect(() => {
        async function getData() {
            try {
                setLoading(true)
                await getProcesses()
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [])

    const filteredProcessos = processos.filter((processo) => {
        const nameMatches = processo.cliente.name.toLowerCase().includes(searchTerm.toLowerCase());
        const stageMatches = selectedStage === 'Todos' || processo.etapa === selectedStage;
        return nameMatches && stageMatches;
    });

    if (loading) return <Typography>Carregando...</Typography>

    return (
        <Box sx={{ height: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        Processos
                    </Typography>
                </Toolbar>
            </AppBar>

            {tabValue === 0 && (
                <Container sx={{ py: 2 }}>
                    {['CORRETOR', 'ADMIN'].includes(localStorage.getItem('role')) && (
                        <Button variant="contained"
                            
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => navigate('/criar-processo')}>
                                Criar processo

                            </Button>
                    )}
                    <TextField
                        label="Buscar por nome do cliente"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Filtrar por etapa</InputLabel>
                        <Select
                            value={selectedStage}
                            onChange={(e) => setSelectedStage(e.target.value)}
                            label="Filtrar por etapa"
                        >
                            {stages.map((stage) => (
                                <MenuItem key={stage.value} value={stage.value}>
                                    {stage.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {filteredProcessos.length !== 0 && filteredProcessos.map((atendimento) => (
                        <ProcessoCard key={atendimento.id} processo={atendimento} />
                    ))}
                    {filteredProcessos.length === 0 && (
                        <Typography variant="body1" align="center" sx={{ mt: 5, color: 'text.secondary' }}>
                            Nenhum processo em andamento.
                        </Typography>
                    )}
                </Container>
                
            )}
            
        </Box>
    )
}