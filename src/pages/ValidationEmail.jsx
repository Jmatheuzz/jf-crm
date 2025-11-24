import { useContext, useState } from "react"
import { apiAuth } from "../network/api"
import { Context } from "../context/Context.jsx"
import { useNavigate } from "react-router-dom"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import FullscreenLoader from "../components/FullscreenLoader.jsx"
import logo from '../assets/imgs/logo-2.png';

export default function ValidationEmail() {

    const [code, setCode] = useState('')
    const { email } = useContext(Context)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function validateEmail(e) {
        try {
            setLoading(true)
            const data = {
            email: email || localStorage.getItem('email'),
            code
        }
        const response = await apiAuth.post('/validation-email-signup', data)
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('role', response.data.data.role)
        localStorage.setItem('userId', response.data.data.userId)
        localStorage.setItem('name', response.data.data.name)
        navigate('/basic-info')
        } catch (e) {
            if (e.response?.status === 400) {
                window.showErrorModal("Codigo inválido. Verifique o código informado.");
      }else if(e.response?.status === 422) {
                window.showErrorModal("Código deve ter 6 dígitos.");
      }else {
                window.showErrorModal("Erro ao solicitar o código. Por favor, tente novamente.");
      }
        } finally {
            setLoading(false)
        }
    }

    if(loading) return <FullscreenLoader message="Validando o código..." show={loading}/>
    

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
            <img src={logo} alt="logo" style={{ width: '200px', margin: '0 auto', marginBottom: '20px' }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Confirmar email
                        </Typography>
            <TextField
                label="Código"
                placeholder="Código"
                margin="normal"
                type="text"
                onChange={e => setCode(e.target.value)}
            />
            <Button
                variant="contained"

                size="large"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => validateEmail()} // Simula criação e avança
            >
                Enviar
            </Button>

        </Box>
    )
}