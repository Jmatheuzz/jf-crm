import { useEffect, useState } from "react";
import { apiBase } from "../network/api";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import logo from '../assets/imgs/logo-1.png';
import SideMenu from "../components/SideMenu";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CorretorProcessos() {
    const [processos, setProcessos] = useState([]);
    const [corretor, setCorretor] = useState(null);
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();

    async function getProcessos() {
        try {
            setLoading(true);
            const { data } = await apiBase.get(`/users/${userId}/processos`);
            setProcessos(data);
        } finally {
            setLoading(false);
        }
    }

    async function getCorretor() {
        try {
            setLoading(true);
            const { data } = await apiBase.get(`/users/${userId}`);
            setCorretor(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProcessos();
        getCorretor();
    }, [userId]);

    const generatePdf = () => {
        const doc = new jsPDF();
        doc.text(`Relatório de Processos - ${corretor?.name}`, 14, 16);
        
        const tableColumn = ["Cliente", "Etapa"];
        const tableRows = [];

        processos.forEach(processo => {
            const processoData = [
                processo.cliente_nome,
                processo.etapa
            ];
            tableRows.push(processoData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            headStyles: {fillColor: [0, 54, 54]}
        });
        doc.save(`relatorio - ${corretor?.name}.pdf`);
    }

    if (loading) return <Typography>Carregando...</Typography>;

    return (
        <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SideMenu sx={{ mr: 2 }} />
                    <img src={logo} alt="logo" style={{ width: '150px'}} />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Processos do Corretor {corretor?.name}
                    </Typography>
                </Toolbar>
                <Divider />
            </AppBar>

            <Container sx={{ py: 2 }}>
                <Button variant="contained" onClick={generatePdf} sx={{ mb: 2 }}>
                    Gerar PDF
                </Button>
                <List>
                    {processos.map((processo, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`Cliente: ${processo.cliente_nome}`}
                                secondary={
                                    <>
                                        <Typography component="span" variant="body2" color="text.primary">
                                            Etapa: {processo.etapa}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Container>
        </Box>
    );
}
