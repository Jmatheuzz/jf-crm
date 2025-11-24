import React, { useState } from "react";

import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { apiAuth } from "../network/api"
import { useNavigate } from "react-router-dom";
import FullscreenLoader from "../components/FullscreenLoader";
import logo from '../assets/imgs/logo-2.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true)
      const res = await apiAuth.post("/password/request", { email });
      setMessage(res.data.message || "Código enviado com sucesso!");
      localStorage.setItem("resetEmail", email);
      navigate("/validar-codigo-senha");
    } catch (e) {
      if (e.response?.status === 422) {
                window.showErrorModal("Conta não encontrada. Verifique o e-mail informado.");
      }else {
                window.showErrorModal("Erro ao solicitar o código. Por favor, tente novamente.");
      }
    } finally {
      setLoading(false)
    }
  };

  if (loading) return <FullscreenLoader message="Procurando sua conta..." show={loading} />

  return (
    <Container maxWidth="sm">
      <img src={logo} alt="logo" style={{ width: '200px', margin: '0 auto', marginBottom: '20px' }} />
      <Box mt={8} textAlign="center">
        <Typography variant="h5">Recuperar Senha</Typography>
        <Typography variant="body2" color="textSecondary">
          Informe seu e-mail para receber o código de recuperação.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
            Enviar código
          </Button>
        </form>

        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );
}
