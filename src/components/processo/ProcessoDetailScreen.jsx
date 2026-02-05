// Ícones (cada um separado)
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import LockClockOutlined from "@mui/icons-material/LockClockOutlined";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import DeleteIcon from '@mui/icons-material/Delete';

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
import { Button, IconButton, Paper } from "@mui/material";


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiBase } from "../../network/api";
import FindImovel from "../FindImovel";
import UsuarioModal from "../UsuarioModal";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ProcessoTask = ({ label, status, isAtual }) => {
    const color = status != 'PENDENTE' ? 'primary' : 'disabled';

    return (
        <ListItem disablePadding sx={{ py: 0.5 }}>
            <Grid container alignItems="center">
                <Grid item xs={10}>
                    <ListItemText primary={label} primaryTypographyProps={{ color: status !== 'PENDENTE' ? 'text.primary' : 'text.secondary' }} />
                </Grid>
                <Grid item xs={2} sx={{ px: 0.5 }} textAlign="right">
                    {status == 'CONCLUIDA' && <CheckCircleOutline color={color} />}
                    {!isAtual && status == 'PENDENTE' && <LockClockOutlined color={color} />}
                    {isAtual && status == 'PENDENTE' && <RadioButtonUnchecked color={color} />}
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
    const [correspondenteBancario, setCorrespondeBancario] = useState('');
    const [correspondenteBancarioChanged, setCorrespondeBancarioChanged] = useState(false);
    const [nomeConstrutora, setNomeConstrutora] = useState('');
    const [nomeConstrutoraChanged, setNomeConstrutoraChanged] = useState(false);
    const [dataAssinaturaEmpreitada, setDataAssinaturaEmpreitada] = useState('');
    const [dataAssinaturaEmpreitadaChanged, setDataAssinaturaEmpreitadaChanged] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [documentos, setDocumentos] = useState([]);


    const navigate = useNavigate()

    useEffect(() => {
        async function getData() {
            try {
                const { data } = await apiBase.get(`/processos/${id}`);
                setData(data);
                setDocumentos(data.documentos || []);
                setObservacao(data.processo.observacao || '');
                setCorrespondeBancario(data.processo.correspondenteBancario || '');
                setNomeConstrutora(data.processo.nomeConstrutora || '');
                setDataAssinaturaEmpreitada(data.processo.data_assinatura_empreitada || '');
            } finally {
                setLoading(false);
            }
        }
        getData()
    }, [id])

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

    async function handleSaveCorrespondeBancario() {
        try {
            await apiBase.put(`/processos/${id}`, { correspondenteBancario });
            setCorrespondeBancarioChanged(false);
        } catch (error) {
            console.error('Error saving observation:', error);
        }
    }

    async function handleSaveNomeConstrutora() {
        try {
            await apiBase.put(`/processos/${id}`, { nomeConstrutora });
            setNomeConstrutoraChanged(false);
        } catch (error) {
            console.error('Error saving nomeConstrutora:', error);
        }
    }

    async function handleSaveDataAssinaturaEmpreitada() {
        try {
            await apiBase.put(`/processos/${id}`, { data_assinatura_empreitada: dataAssinaturaEmpreitada });
            setDataAssinaturaEmpreitadaChanged(false);
        } catch (error) {
            console.error('Error saving data_assinatura_empreitada:', error);
        }
    }

    const handleFileSelect = (event) => {
        setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
    };

    const handleRemoveFile = (fileName) => {
        setSelectedFiles(selectedFiles.filter(file => file.name !== fileName));
    };

    const handleUpload = async () => {
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('documentos[]', file);
        });

        try {
            const { data } = await apiBase.post(`/processos/${id}/documentos`, formData);
            setDocumentos([...documentos, ...data]);
            setSelectedFiles([]);
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            window.location.reload();
        }
    };

    const handleDelete = async (docId) => {
        const docToDelete = documentos.find(d => d.id === docId);
        if (docToDelete && docToDelete.id) { // Salvo no servidor
            try {
                await apiBase.delete(`/documentos/${docId}`);
                setDocumentos(documentos.filter(d => d.id !== docId));
            } catch (error) {
                console.error('Error deleting file from server:', error);
            }
        }
    };


    const handlePdfExport = () => {
        const doc = new jsPDF();
        doc.text(`Resumo do Processo N°: ${data.processo.id}`, 14, 16);

        const processoInfo = [
            ["Cliente", data.processo.cliente.name],
            ["Corretor", data.processo.corretor.name],
            ["Interesse", data.processo.interesse],
        ];

        if (data.processo.correspondenteBancario) {
            processoInfo.push(["Corresponde Bancário", data.processo.correspondenteBancario]);
        }

        if (data.processo.nomeConstrutora) {
            processoInfo.push(["Nome Construtora", data.processo.nomeConstrutora]);
        }

        if (data.processo.imovel) {
            processoInfo.push(["Imóvel", data.processo.imovel.endereco]);
            processoInfo.push(["Valor do Imóvel", `R$ ${data.processo.imovel.valor}`]);
        }
        if (observacao) {
            processoInfo.push(["Observação", observacao]);
        }

        autoTable(doc, {
            startY: 20,
            head: [['Campo', 'Valor']],
            body: processoInfo,
            theme: 'striped',
            headStyles: { fillColor: [0, 92, 92] },
        });

        if (data.timeline && data.timeline.length > 0) {
            const tableBody = data.timeline.map(etapa => [etapa.descricao, etapa.status]);

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Etapa', 'Status']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [0, 92, 92] },
            });
        }

        doc.save(`processo-${data.processo.id}.pdf`);
    };

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
                        Processo {data.processo.id}
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
                                {
                                    localStorage.getItem('role') === 'CORRETOR' &&
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ ml: 2 }}
                                        onClick={() => {
                                            setEditingCliente(data.processo.cliente)
                                            setIsEditModalOpen(true)
                                        }}
                                    >
                                        Editar Cliente
                                    </Button>
                                }
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
                        {data.processo.correspondenteBancario && (
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Corresponde Bancário: {data.processo.correspondenteBancario}
                            </Typography>
                        )}
                        {data.processo.nomeConstrutora && (
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Nome da Construtora: {data.processo.nomeConstrutora}
                            </Typography>
                        )}
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
                                <ProcessoTask key={index} label={etapa.descricao} status={etapa.status} isAtual={etapa.chave === data.processo.etapa} />
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

                            <Button
                                variant="contained"
                                size="large"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handlePdfExport}
                            >
                                Gerar PDF
                            </Button>
                        </Card>
                    )
                }
                {
                    localStorage.getItem('role') === 'ADMIN' && (
                        <Card sx={{ mt: 3, p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Corresponde Bancário
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={1}
                                value={correspondenteBancario}
                                onChange={(e) => {
                                    setCorrespondeBancario(e.target.value);
                                    setCorrespondeBancarioChanged(true);
                                }}
                                variant="outlined"
                            />
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ mt: 2 }}
                                onClick={handleSaveCorrespondeBancario}
                                disabled={!correspondenteBancarioChanged}
                            >
                                Salvar Corresponde Bancário
                            </Button>
                        </Card>
                    )
                }
                {
                    localStorage.getItem('role') === 'ADMIN' && (
                        <Card sx={{ mt: 3, p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Nome da Construtora
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={1}
                                value={nomeConstrutora}
                                onChange={(e) => {
                                    setNomeConstrutora(e.target.value);
                                    setNomeConstrutoraChanged(true);
                                }}
                                variant="outlined"
                            />
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ mt: 2 }}
                                onClick={handleSaveNomeConstrutora}
                                disabled={!nomeConstrutoraChanged}
                            >
                                Salvar Nome da Construtora
                            </Button>
                        </Card>
                    )
                }
                {
                    ['ADMIN'].includes(localStorage.getItem('role')) && (
                        <Card sx={{ mt: 3, p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Data de Assinatura da Empreitada
                            </Typography>
                            <TextField
                                fullWidth
                                type="date"
                                value={dataAssinaturaEmpreitada}
                                onChange={(e) => {
                                    setDataAssinaturaEmpreitada(e.target.value);
                                    setDataAssinaturaEmpreitadaChanged(true);
                                }}
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ mt: 2 }}
                                onClick={handleSaveDataAssinaturaEmpreitada}
                                disabled={!dataAssinaturaEmpreitadaChanged}
                            >
                                Salvar Data
                            </Button>
                        </Card>
                    )
                }
                {
                    ['CORRETOR', 'ADMIN', 'ATENDIMENTO'].includes(localStorage.getItem('role')) && (
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
                {['CORRETOR', 'ADMIN', 'ATENDIMENTO'].includes(localStorage.getItem('role')) && (
                    <Card sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Documentos do Processo
                        </Typography>

                        <Button
                            variant="contained"
                            component="label"
                        >
                            Selecionar Arquivos
                            <input
                                type="file"
                                hidden
                                multiple
                                onChange={handleFileSelect}
                            />
                        </Button>

                        {selectedFiles.length > 0 && (
                            <Paper sx={{ mt: 2, p: 1 }}>
                                <Typography variant="subtitle2">Arquivos selecionados:</Typography>
                                <List dense>
                                    {selectedFiles.map((file, index) => (
                                        <ListItem
                                            key={index}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFile(file.name)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText primary={file.name} />
                                        </ListItem>
                                    ))}
                                </List>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ mt: 1 }}
                                    onClick={handleUpload}
                                >
                                    Fazer Upload
                                </Button>
                            </Paper>
                        )}

                        {documentos.length > 0 && (
                            <Paper sx={{ mt: 2, p: 1 }}>
                                <Typography variant="subtitle2">Documentos existentes:</Typography>
                                <List dense>
                                    {documentos.map((doc) => (
                                        <ListItem
                                            key={doc.id}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(doc.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText primary={<a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.nome_original}</a>} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}
                    </Card>
                )}
                {isEditModalOpen && (
                    <UsuarioModal
                        usuario={editingCliente}
                        onClose={() => setIsEditModalOpen(false)}
                        onSuccess={() => {
                            setIsEditModalOpen(false);
                            window.location.reload();
                        }}
                    />
                )}
            </Container>
        </Box>
    )
};