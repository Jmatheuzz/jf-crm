import { useState } from "react"
import { apiAuth } from "../network/api"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { Link, useNavigate } from "react-router-dom"
import VisibilityOff  from "@mui/icons-material/VisibilityOff"
import IconButton from "@mui/material/IconButton"
import FullscreenLoader from "../components/FullscreenLoader"
import Visibility from "@mui/icons-material/Visibility"
import logo from '../assets/imgs/logo-2.png';

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)

    const navigate = useNavigate()

    async function login() {
        try {
            setLoading(true)
            const data = {
                email,
                password
            }
            const response = await apiAuth.post('/login', data)
            localStorage.setItem('token', response.data.data.token)
            localStorage.setItem('role', response.data.data.role)
            localStorage.setItem('userId', response.data.data.userId)
            localStorage.setItem('name', response.data.data.name)
        } catch(e) {
            if (e.response?.status === 401 || e.response?.status === 403) {
                window.showErrorModal("Dados inválidos. Verifique e tente novamente.");
            }
        } finally {
            setLoading(false)
        }

        if (localStorage.getItem('role') === 'ADMIN') {
            navigate('/dashboard')
            return
        }
        navigate('/')
    }

    if(loading) return <FullscreenLoader message="Entrando..." show={loading}/>

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', maxWidth: 600, margin: '0 auto' }}>
            <img src={logo} alt="logo" style={{ width: '200px', margin: '0 auto', marginBottom: '20px' }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Seja bem-vindo!
            </Typography>

            <TextField
                label="E-mail"
                placeholder="email@example.com"
                margin="normal"
                fullWidth
                type="email"
                onChange={e => setEmail(e.target.value)}
            />
            <TextField
                label="Digite sua senha"
                margin="normal"
                fullWidth
                type={showPass ? 'text' : 'password'}
                InputProps={{
                    endAdornment: <IconButton edge="end" onClick={() => setShowPass(!showPass)}>{showPass ? <Visibility /> : <VisibilityOff />}</IconButton>
                }}
                onChange={e => setPassword(e.target.value)}
            />

            <Box sx={{ textAlign: 'right', my: 1 }}>
                <Typography variant='inherit' sx={{ ml: 1, cursor: 'pointer', color: 'primary.main' }} onClick={() => navigate('/request-reset-senha')}>Esqueceu a senha?</Typography>
            </Box>

            <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => login()} // Simula login
            >
                Entrar
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
                Não tem conta?
                <Typography onClick={() => navigate('/cadastro')} variant='body2' sx={{ ml: 1, fontWeight: 'bold', cursor: 'pointer', color: 'primary.main' }}>
                    Criar Conta
                </Typography>
            </Box>
        </Box>
    )
}