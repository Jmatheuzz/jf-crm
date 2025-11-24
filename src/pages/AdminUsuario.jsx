import React, { useState, useEffect } from 'react';
import { Plus, Home, Upload, X, DollarSign, Maximize, Bed, Bath, Trash2, Edit2 } from 'lucide-react';
import { apiBase } from '../network/api';
import { formatToBRL, removeMask } from '../utils';
import Carousel from '../components/Carousel';
import { Checkbox, FormControlLabel, MenuItem, Select } from '@mui/material';
import ConfirmationModal from '../components/ConfirmationModal';
import TextField from "@mui/material/TextField"; // Added import

export const AdminUsuario = () => {
  const [usuarios, seetUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [role, setRole] = useState('TUDO');
  const [searchTerm, setSearchTerm] = useState(""); // Added state

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const { data } = await apiBase.get(`/users?role=${role === 'TUDO' ? '' : role}`);
      seetUsuarios(data ?? []);
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
      window.location.reload();
    }

  const filteredUsuarios = usuarios.filter((usuario) => // Added filtering logic
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
          onClick={() => setShowModal(true)}
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
          <TextField // Added TextField
            label="Buscar por nome do usuário"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

      {filteredUsuarios.length === 0 ? ( // Changed usuarios to filteredUsuarios
        <div className="text-center py-12 bg-background-paper rounded-lg">
          <Home className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">Nenhum usuario cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsuarios.map((usuario) => ( // Changed usuarios to filteredUsuarios
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
          onSuccess={loadUsuarios}
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

const UsuarioModal = ({ usuario, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    creci: usuario?.creci || '',
    name: usuario?.name || '',
    telefone: usuario?.telefone,
    email: usuario?.email,
    password: usuario?.password,
    role: usuario?.role || 'CLIENTE',
    cpf: usuario?.cpf || '',
    rg: usuario?.rg || '',
    renda: usuario?.renda || 0,
    profissao: usuario?.profissao || '',
    estado_civil: usuario?.estado_civil || '',
    possui_fgts: usuario?.possui_fgts || false,
  });
  const [loading, setLoading] = useState(false);

  async function saveImovel() {
    setLoading(true);
    try {
      if (usuario) {
        await apiBase.put(`/users/${usuario.id}`, { ...formData });
      } else {
        const { data } = await apiBase.post('/users', { ...formData });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving usuario:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = [];
    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i]);
      newPhotos.push(url);
    }
    setPhotos([...fotos, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setPhotos(fotos.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#004b49] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-background-paper">
          <h2 className="text-xl font-bold">
            {usuario ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Função</label>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              label="Escolha uma opção"
              sx={{ mt: 2, mb: 2, color: 'text.primary', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'text.primary' } }}
            >
              <MenuItem value="ADMIN">Administrador</MenuItem>
              <MenuItem value="CORRETOR">Corretor</MenuItem>
              <MenuItem value="ATENDIMENTO">Atendimento</MenuItem>
              <MenuItem value="CLIENTE">Cliente</MenuItem>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Telefone</label>
            <input
              type="text"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none"
              required
            />
          </div>


          {formData.role === 'CORRETOR' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Creci</label>
              <input
                value={formData.creci}
                onChange={(e) => setFormData({ ...formData, creci: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none resize-none"
                required
              />
            </div>
          )}
          {formData.role === 'CLIENTE' && (
            <>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">RG</label>
                <input
                  value={formData.rg}
                  onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none resize-none"
                  required
                />
              </div>
              <div>
              <label className="block text-sm font-medium text-text-primary mb-2">CPF</label>
              <input
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Profissão</label>
              <input
                value={formData.profissao}
                onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Renda</label>
              <input
                value={formatToBRL(formData.renda)}
                 onChange={(e) => {
                                    const valorFormatado = e.target.value;
                                    const valorNumerico = removeMask(valorFormatado);
                                    setFormData({ ...formData, renda: valorNumerico });
                                  }}
                rows={3}
                className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Estado Civil</label>
              <input
                value={formData.estado_civil}
                onChange={(e) => setFormData({ ...formData, estado_civil: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none resize-none"
                required
              />
            </div>
            <div>
              <FormControlLabel 
                              control={<Checkbox />} 
                              label="Possui FGTS?" 
                              onChange={(e) => setFormData({ ...formData, possui_fgts: e.target.checked })}
                          />
            </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Senha</label>
            <input
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none resize-none"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-600 text-text-primary rounded-lg hover:bg-gray-800 transition"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
              onClick={() => saveImovel()}
            >
              {loading ? 'Salvando...' : usuario ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
