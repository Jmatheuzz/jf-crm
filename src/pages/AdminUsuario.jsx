import React, { useState, useEffect } from 'react';
import { Plus, Home, Trash2, Edit2 } from 'lucide-react';
import { apiBase } from '../network/api';
import { MenuItem, Select } from '@mui/material';
import ConfirmationModal from '../components/ConfirmationModal';
import TextField from "@mui/material/TextField";
import UsuarioModal from '../components/UsuarioModal';

export const AdminUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [role, setRole] = useState('TUDO');
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const { data } = await apiBase.get(`/users?role=${role === 'TUDO' ? '' : role}`);
      setUsuarios(data ?? []);
    } catch (error) {
      console.error('Error loading usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, [role]);

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
  };

  const handleConfirm = async () => {
      setOpen(false);
      await apiBase.delete(`/users/${idToDelete}`);
      setIdToDelete(null)
      loadUsuarios();
    }

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary-main rounded-full animate-spin"></div>
        <p className="text-text-secondary mt-4">Carregando usuarios...</p>
      </div>
    );
  }
  function getFuncaoDescricao(role){
    if (role === "ADMIN") return 'Administrador'
    if (role === 'CORRETOR') return 'Corretor'
    if (role === 'CLIENTE') return 'Cliente'
    if (role ==='ATENDIMENTO') return 'Atendimento'
  }
  return (
    <div className='p-6 bg-background-default text-text-primary'>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Gestão de Usuarios</h3>
        <button
          onClick={() => {
            setEditingUsuario(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Usuario</span>
        </button>
      </div>

      <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Filtrar por função</label>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Escolha uma opção"
              sx={{ mt: 2, mb: 2, color: 'text.primary', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'text.primary' } }}
            >
              <MenuItem value="TUDO">Tudo</MenuItem>
              <MenuItem value="ADMIN">Administrador</MenuItem>
              <MenuItem value="CORRETOR">Corretor</MenuItem>
              <MenuItem value="ATENDIMENTO">Atendimento</MenuItem>
              <MenuItem value="CLIENTE">Cliente</MenuItem>
            </Select>
          </div>
          <TextField
            label="Buscar por nome do usuário"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

      {filteredUsuarios.length === 0 ? (
        <div className="text-center py-12 bg-background-paper rounded-lg">
          <Home className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">Nenhum usuario cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="bg-background-paper border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              <div className="p-4" onClick={() => handleEdit(usuario)}>
                <h4 className="font-semibold mb-2">{usuario.name}</h4>
                <p className="text-sm text-text-secondary mb-3">Email: {usuario.email}</p>
                <p className="text-sm text-text-secondary mb-3">Função: {getFuncaoDescricao(usuario.role)}</p>
              </div>
              <div className='flex pl-2 pb-2'>
                  <Trash2 className="w-4 h-4" color='red'onClick={() => {
                    setOpen(true)
                    setIdToDelete(usuario.id)
                  }}/>
                  <Edit2 className="w-4 h-4 ml-3" color='green' onClick={() => handleEdit(usuario)}/>
                </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <UsuarioModal
          usuario={editingUsuario}
          onClose={handleCloseModal}
          onSuccess={() => {
            loadUsuarios();
            handleCloseModal();
          }}
        />
      )}
      <ConfirmationModal
              open={open}
              title="Excluir item"
              description="Deseja realmente excluir este usuário? Esta ação é irreversível."
              confirmLabel="Excluir"
              cancelLabel="Cancelar"
              onConfirm={handleConfirm}
              onCancel={() => {
                setOpen(false);
                setIdToDelete(null)
              }}
            />
    </div>
  );
};