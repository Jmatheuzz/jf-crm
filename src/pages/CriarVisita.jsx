import React, { useState } from "react";
import { apiBase } from "../network/api";



import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import FindProcesso from "../components/FindProcesso";
import FindImovel from "../components/FindImovel";

export default function CriarVisita() {
  const [selectedProcesso, setSelectedProcesso] = useState(null);
  const [selectedImovel, setSelectedImovel] = useState(null);
  const [dataVisita, setDataVisita] = useState("");

  const navigate = useNavigate()

  const fetchProcessos = async (query) => {

    try {
      const res = await apiBase.get("/processos?search=" + query);
      return res.data; // [{ id, nome, cpf }]
    } catch (err) {
      console.error("Erro ao buscar processos:", err);
      return [];
    }
  };

  const fetchImoveis = async (query) => {
    try {
      const res = await apiBase.get("/imoveis?search=" + query);
      return res.data; // [{ id, nome, cpf }]
    } catch (err) {
      console.error("Erro ao buscar imoveis:", err);
      return [];
    }
  };

  async function criarVisita() {
    try {
      const { data } = await apiBase.post("/visitas", {
        processo_id: selectedProcesso.id,
        imovel_id: selectedImovel.id,
        data_visita: dataVisita
      })
      navigate(`/`)
    } catch (err) {

    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Criar Visita
      </Typography>
      <FindProcesso
        fetchProcessos={fetchProcessos}
        label="Selecionar processo"
        value={selectedProcesso}
        onChange={(newCliente) => setSelectedProcesso(newCliente)}
      />
      <FindImovel
        fecthImoveis={fetchImoveis}
        label="Selecionar imóvel"
        value={selectedImovel}
        onChange={(newImovel) => setSelectedImovel(newImovel)}
      />
      <TextField
                      label="Data da visita"
                      margin="normal"
                      type="datetime-local"
                      onChange={e => setDataVisita(e.target.value)}
                      slotProps={{ inputLabel: { shrink: true } }}
                  />

      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => criarVisita()} // Simula login
      >
        Criar
      </Button>
    </div>
  );
}
