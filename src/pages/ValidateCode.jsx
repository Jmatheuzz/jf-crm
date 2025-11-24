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

export default function ValidateCode() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true)
      const res = await apiAuth.post("/password/validate", { email: localStorage.getItem("resetEmail"), code });
      localStorage.setItem("code", code);
      setMessage(res.data.message || "Código validado!");
      navigate("/resetar-senha");
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
  };
  if (loading) return <FullscreenLoader message="Validando o código..." show={loading} />
  return (
    <Container maxWidth="sm">
      <img src={logo} alt="logo" style={{ width: '200px', margin: '0 auto', marginBottom: '20px' }} />
      <Box mt={8} textAlign="center">
        <Typography variant="h5">Validar Código</Typography>
        <Typography variant="body2" color="textSecondary">
          Insira o código de 6 dígitos que você recebeu no e-mail.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Código"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
            Validar
          </Button>
        </form>

        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );
}
