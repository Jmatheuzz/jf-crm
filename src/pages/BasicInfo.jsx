import { useContext, useState } from "react"
import { apiBase } from "../network/api"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';  

import { useNavigate } from "react-router-dom"
import FullscreenLoader from "../components/FullscreenLoader";
import logo from '../assets/imgs/logo-1.png';

export default function BasicInfo(){

    const [cpf, setCpf] = useState('')
    const [rg, setRg] = useState('')
    const [telefone, setTelefone] = useState('')
    const [estadoCivil, setEstadoCivil] = useState('')
    const [profissao, setProfissao] = useState('')
    const [renda, setRenda] = useState('')
    const [possuiFgts, setPossuiFgts] = useState(false)
const [loading, setLoading] = useState(false)
    const clienteId = localStorage.getItem('userId')
    const navigate = useNavigate()

    async function basicInfo(){
        try {
            setLoading(true)
            const data = {
            rg,
            cpf,
            telefone,
            estado_civil: estadoCivil,
            profissao,
            renda,
            possui_fgts: possuiFgts
        }
        const response = await apiBase.put(`/users/${clienteId}`, data)
        navigate('/')
        } finally {
            setLoading(false)
        }
    }
if (loading) return <FullscreenLoader message="Salvando suas informações..." show={loading} />
    return (
        <Box sx={{ p: 3, height: '100vh' }}>
        <img src={logo} alt="logo" style={{ width: '100px'}} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Informações Básicas
        </Typography>
        <Typography variant="body1" gutterBottom>
            Por favor, preencha suas informações básicas para continuar.
        </Typography>

        <TextField
            label="RG"
            margin="normal"
            fullWidth
            onChange={(e) => setRg(e.target.value)}
        />

        <TextField
            label="CPF"
            margin="normal"
            fullWidth
            onChange={(e) => setCpf(e.target.value)}
        />

        <TextField
            label="Telefone"
            margin="normal"
            fullWidth
            onChange={(e) => setTelefone(e.target.value)}
        />

        <TextField
            label="Estado civil"
            margin="normal"
            fullWidth
            onChange={(e) => setEstadoCivil(e.target.value)}
        />

        <TextField
            label="Profissão"
            margin="normal"
            fullWidth
            onChange={(e) => setProfissao(e.target.value)}
        />

        <TextField
            label="Renda"
            margin="normal"
            fullWidth type="number"
            onChange={(e) => setRenda(e.target.value)}
        />

        
        <Box sx={{ mt: 3, mb: 2 }}>
            <FormControlLabel 
                control={<Checkbox />} 
                label="Possui FGTS?" 
                onChange={(e) => setPossuiFgts(e.target.checked)}
            />
        </Box>


        <Button 
            variant="contained" 
            fullWidth 
            size="large" 
            sx={{ mt: 3, mb: 2 }}
            onClick={() => basicInfo()} // Salva e avança para lista
        >
            Salvar
        </Button>
    </Box>
    )
}