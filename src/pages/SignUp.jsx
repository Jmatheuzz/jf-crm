import { useContext, useState } from "react"
import { apiAuth } from "../network/api"
import { Link, redirect, useNavigate } from "react-router-dom"
import { Context } from "../context/Context"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import IconButton from "@mui/material/IconButton"
import FullscreenLoader from "../components/FullscreenLoader"
import Visibility from "@mui/icons-material/Visibility"
import logo from '../assets/imgs/logo-2.png';

export default function SignUp(){

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const {setEmail: setEmailContext} = useContext(Context)
    const [loading, setLoading] = useState(false)
const [showPass1, setShowPass1] = useState(false)
const [showPass2, setShowPass2] = useState(false)
    const navigate = useNavigate()

    async function signUp(){
        const data = {
            email,
            name,
            password,
            passwordConfirmation
        }
        try {
            setLoading(true)
            await apiAuth.post('/register', data)
            setEmailContext(email)
            localStorage.setItem('email', email)
            navigate('/validation-email')
        } catch (e) {
            if (e.response?.status === 422) {
                window.showErrorModal("Já existe uma conta com esse e-mail.");
      }else {
                window.showErrorModal("Erro ao criar a conta. Por favor, tente novamente.");
      }
        } finally {
            setLoading(false)
        }
    }
    
    if(loading) return <FullscreenLoader message="Criando sua conta..." show={loading}/>

    return (
           <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
        <img src={logo} alt="logo" style={{ width: '200px', margin: '0 auto', marginBottom: '20px' }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Criar conta
        </Typography>

        <TextField 
            label="Nome completo" 
            margin="normal" 
            fullWidth 
            onChange={e => setName(e.target.value)}
        />
        <TextField 
            label="Email" 
            margin="normal" 
            fullWidth 
            type="email"
            onChange={e => setEmail(e.target.value)}
        />
        <TextField 
            label="Senha" 
            margin="normal" 
            fullWidth 
            type={showPass1 ? 'text' : 'password'} 
            InputProps={{ endAdornment: <IconButton edge="end" onClick={() => setShowPass1(!showPass1)}>{showPass1 ? <Visibility /> : <VisibilityOff />}</IconButton> }}
            onChange={e => setPassword(e.target.value)}
        />
        <TextField 
            label="Repita sua senha" 
            margin="normal" 
            fullWidth 
            type={showPass2 ? 'text' : 'password'} 
            InputProps={{ endAdornment: <IconButton edge="end" onClick={() => setShowPass2(!showPass2)}>{showPass2 ? <Visibility /> : <VisibilityOff />}</IconButton> }}
            onChange={e => setPasswordConfirmation(e.target.value)}
        />

        <Button 
            variant="contained" 
            fullWidth 
            size="large" 
            sx={{ mt: 3, mb: 2 }}
            onClick={() => signUp()} // Simula criação e avança
        >
            Criar conta
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" onClick={() => navigate('/login')}>
                Já tem conta? 
                <Typography variant="body1" sx={{ ml: 1, fontWeight: 'bold', cursor: 'pointer', color: 'primary.main' }}>
                    Entrar
                </Typography>
            </Typography>
        </Box>
    </Box>
    )
}