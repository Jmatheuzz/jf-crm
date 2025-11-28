import React, { useState } from "react";
import { apiBase } from "../network/api";
import FindUser from "../components/FindUser";


import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import logo from '../assets/imgs/logo-1.png';

export default function CriarProcesso() {
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedCorretor, setSelectedCorretor] = useState(null);
  const [selectedInteresse, setSelectedInteresse] = useState("Compra de Imóvel");

  const navigate = useNavigate()

  const handleChangeInteresse = (event) => {
    setSelectedInteresse(event.target.value);
  };

  const fetchUsers = async (query) => {

    try {
      const res = await apiBase.get(`/users?role=${'CLIENTE'}&search=${query}`);
      return res.data; // [{ id, nome, cpf }]
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      return [];
    }
  };

  const fetchCorretores = async (query) => {

    try {
      const res = await apiBase.get(`/users?role=${'CORRETOR'}&search=${query}`);
      return res.data; // [{ id, nome, cpf }]
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      return [];
    }
  };

  async function criarAtendimento() {
    try {
      const {data} = await apiBase.post("/processos", {
        cliente_id: selectedCliente.id,
        corretor_id: selectedCorretor.id,
        interesse: selectedInteresse
      })
      navigate(`/processos/${data.id}`)
    } catch (err) {

    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <img src={logo} alt="logo" style={{ width: '100px'}} />
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Criar Processo
      </Typography>
      <FindUser
        fetchUsers={fetchUsers}
        label="Buscar cliente"
        value={selectedCliente}
        onChange={(newCliente) => setSelectedCliente(newCliente)}
      />

      {
        ['ADMIN'].includes(localStorage.getItem('role')) &&
        <FindUser
        fetchUsers={fetchCorretores}
        label="Buscar corretor"
        value={selectedCorretor}
        onChange={(newCliente) => setSelectedCorretor(newCliente)}
      />
      }

      <Select
        value={selectedInteresse}
        onChange={handleChangeInteresse}
        label="Escolha uma opção"
        sx={{ mt: 2, mb: 2 }}
      >
        <MenuItem value="Compra de Imóvel">Compra de Imóvel</MenuItem>
        <MenuItem value="Compra de Lote">Compra de Lote</MenuItem>
        <MenuItem value="Aluguel de Imóvel">Aluguel de Imóvel</MenuItem>
      </Select>

      <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => criarAtendimento()} // Simula login
            >
                Criar
      </Button>
    </div>
  );
}
