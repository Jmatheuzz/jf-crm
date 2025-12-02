import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiBase } from '../network/api';
import { formatToBRL, removeMask } from '../utils';
import { Checkbox, FormControlLabel, MenuItem, Select } from '@mui/material';

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
    possui_fgts: usuario?.possui_fgts,
    possui_filhos_menor: usuario?.possui_filhos_menor,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        creci: usuario?.creci || '',
        name: usuario?.name || '',
        telefone: usuario?.telefone || '',
        email: usuario?.email || '',
        password: usuario?.password || '',
        role: usuario?.role || 'CLIENTE',
        cpf: usuario?.cpf || '',
        rg: usuario?.rg || '',
        renda: usuario?.renda || 0,
        profissao: usuario?.profissao || '',
        estado_civil: usuario?.estado_civil || '',
        possui_fgts: usuario?.possui_fgts || false,
        possui_filhos_menor: usuario?.possui_filhos_menor || false,
      });
    }
  }, [usuario]);

  async function saveImovel() {
    setLoading(true);
    try {
      if (formData.role === 'CLIENTE') {
        formData.password = 'senhajfcliente637495';
      }
      if (usuario) {
        await apiBase.put(`/users/${usuario.id}`, { ...formData });
      } else {
        const { data } = await apiBase.post('/users', { ...formData });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving usuario:', error);
    } finally {
      setLoading(false);
    }
  }

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
                              control={<Checkbox checked={formData.possui_fgts}/>} 
                              label="Possui FGTS?" 
                              value={formData.possui_fgts}
                              onChange={(e) => setFormData({ ...formData, possui_fgts: e.target.checked })}
                          />
            </div>
            <div>
              <FormControlLabel 
                              control={<Checkbox checked={formData.possui_filhos_menor}/>} 
                              label="Possui filho menor de idade?" 
                              value={formData.possui_filhos_menor}
                              onChange={(e) => setFormData({ ...formData, possui_filhos_menor: e.target.checked })}
                          />
            </div>
            </>
          )}
          {
            formData.role !== 'CLIENTE' && <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Senha</label>
            <input
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none resize-none"
              required
            />
          </div>
          }

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

export default UsuarioModal;
