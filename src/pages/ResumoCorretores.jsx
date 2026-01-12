import { useEffect, useState } from "react";
import { apiBase } from "../network/api";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import logo from '../assets/imgs/logo-1.png';
import SideMenu from "../components/SideMenu";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function ResumoCorretores() {
    const [corretores, setCorretores] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function getCorretores() {
        try {
            setLoading(true);
            const { data } = await apiBase.get('/users?role=CORRETOR');
            setCorretores(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCorretores();
    }, []);

    if (loading) return <Typography>Carregando...</Typography>;

    return (
        <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SideMenu sx={{ mr: 2 }} />
                    <img src={logo} alt="logo" style={{ width: '150px'}} />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Resumo dos Corretores
                    </Typography>
                </Toolbar>
                <Divider />
            </AppBar>

            <Container sx={{ py: 2 }}>
                <List>
                    {corretores.map((corretor) => (
                        <ListItem button key={corretor.id} onClick={() => navigate(`/corretor/${corretor.id}/processos`)}>
                            <ListItemText primary={corretor.name} sx={{cursor: 'pointer'}} />
                        </ListItem>
                    ))}
                </List>
            </Container>
        </Box>
    );
}
