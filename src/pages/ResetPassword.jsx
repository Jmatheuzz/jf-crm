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

export default function ResetPassword({ email, code }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true)
      const res = await apiAuth.post("/password/reset", {
        email: localStorage.getItem("resetEmail"),
        code: localStorage.getItem("code"),
        new_password: password,
        new_password_confirmation: confirmPassword,
      });
      setMessage(res.data.message || "Senha redefinida com sucesso!");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("code");
      navigate("/login");
    } catch (err) {
      window.showErrorModal("Erro ao redefinir a senha. Por favor, tente novamente.");
    } finally {
      setLoading(false)
    }
  };

  if (loading) return <FullscreenLoader message="Resetando a senha..." show={loading} />

  return (
    <Container maxWidth="sm">
      <img src={logo} alt="logo" style={{ width: '200px', margin: '0 auto', marginBottom: '20px' }} />
      <Box mt={8} textAlign="center">
        <Typography variant="h5">Redefinir Senha</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nova Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirmar Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
            Redefinir Senha
          </Button>
        </form>

        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );
}
