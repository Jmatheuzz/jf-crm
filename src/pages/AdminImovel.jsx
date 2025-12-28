import React, { useState, useEffect } from 'react';
import { Plus, Home, Upload, X, DollarSign, Maximize, Bed, Bath, Trash, Trash2, Edit2 } from 'lucide-react';
import { apiBase } from '../network/api';
import { formatToBRL, removeMask } from '../utils';
import Carousel from '../components/Carousel';
import ConfirmationModal from '../components/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { MenuItem, Select, Switch } from '@mui/material';

export const AdminImovel = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
      const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const { data } = await apiBase.get('/imoveis');
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProperty(null);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary-main rounded-full animate-spin"></div>
        <p className="text-text-secondary mt-4">Carregando imóveis...</p>
      </div>
    );
  }

  const handleConfirm = async () => {
    setOpen(false);
    await apiBase.delete(`/imoveis/${idToDelete}`);
    setIdToDelete(null)
    window.location.reload();
  }

  return (
    <div className='p-6 bg-background-default text-text-primary'>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Gestão de Imóveis</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Imóvel</span>
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 bg-background-paper rounded-lg">
          <Home className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">Nenhum imóvel cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="pl-2 pb-2 bg-background-paper border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-center justify-center w-full">
                {property.fotos.length > 0 ? (
                  <Carousel images={property.fotos} />
                ) : (
                  <Home className="w-12 h-12 text-text-secondary" />
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-2">{property.title}</h4>
                <p className="text-sm text-text-secondary mb-3">{property.endereco}</p>
                <span className="flex items-center space-x-1">
                    <span>{property.tipo}</span>
                  </span>
                <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
                  <span className="flex items-center space-x-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.numero_quartos}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.numero_banheiros}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Maximize className="w-4 h-4" />
                    <span>{property.area}m²</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
                  <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${property.disponivel ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {property.disponivel ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
                <p className="text-lg font-bold">
                  R$ {property.valor.toLocaleString('pt-BR')}
                </p>
              </div>
                <div className='flex'>
                  <Trash2 className="w-4 h-4" color='red'onClick={() => {
                    setOpen(true)
                    setIdToDelete(property.id)
                  }}/>
                  <Edit2 className="w-4 h-4 ml-3" color='green' onClick={() => handleEdit(property)}/>
                </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <PropertyModal
          property={editingProperty}
          onClose={handleCloseModal}
          onSuccess={loadProperties}
        />
      )}
      <ConfirmationModal
        open={open}
        title="Excluir item"
        description="Deseja realmente excluir este imóvel? Esta ação é irreversível."
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

const PropertyModal = ({ property, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    endereco: property?.endereco || '',
    valor: property?.valor || 0,
    area: property?.area,
    numero_quartos: property?.numero_quartos,
    numero_banheiros: property?.numero_banheiros,
    descricao: property?.descricao || '',
    disponivel: property?.disponivel ?? true
  });
  const [fotos, setPhotos] = useState(property?.fotos || []);
  const [loading, setLoading] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState('Imóvel para venda');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      formData.tipo= selectedTipo
      if (property) {
        await apiBase.put(`/imoveis/${property.id}`, { ...formData, fotos });
      } else {
        await apiBase.post('imoveis', formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setLoading(false);
    }
  };

  async function urlToFile(url, filename, mimeType) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
  }

  async function saveImovel() {
    setLoading(true);
    try {
      formData.tipo= selectedTipo
      if (property) {
        const { data } = await apiBase.put(`/imoveis/${property.id}`, { ...formData });
        const requests = []

        if (fotos) {
          for (let i = 0; i < fotos.length; i++) {
            if (fotos[i]?.url) continue; 
            const formDataFile = new FormData()

            formDataFile.append('foto', await urlToFile(fotos[i], `photo${i}.jpg`, 'image/jpeg'));
            formDataFile.append('imovel_id', data.id);

            requests.push(
              await apiBase.post(`/fotos-imovel`, formDataFile, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
              )
            )
          }
        }

        Promise.all(requests).then(() => {
          console.log('All photos uploaded');
        }).catch((error) => {
          console.error('Error uploading photos:', error);
        })  
      } else {
        const { data } = await apiBase.post('/imoveis', { ...formData });

        const requests = []

        if (fotos) {
          for (let i = 0; i < fotos.length; i++) {
            const formDataFile = new FormData()

            formDataFile.append('foto', await urlToFile(fotos[i], `photo${i}.jpg`, 'image/jpeg'));
            formDataFile.append('imovel_id', data.id);

            requests.push(
              await apiBase.post(`/fotos-imovel`, formDataFile, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
              )
            )
          }
        }

        Promise.all(requests).then(() => {
          console.log('All photos uploaded');
        }).catch((error) => {
          console.error('Error uploading photos:', error);
        })  
      }
      onSuccess();
      onClose()
    } catch (error) {
      console.error('Error saving property:', error);
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

  const removePhoto = async (index) => {
    setPhotos(fotos.filter((_, i) => i !== index));
    await apiBase.post(`/fotos-imovel/delete-by-path`, {url: fotos[index].url });
    onClose()
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#004b49] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-background-paper">
          <h2 className="text-xl font-bold">
            {property ? 'Editar Imóvel' : 'Novo Imóvel'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        

        <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-text-primary mb-2">Disponível</label>
            <Switch
              checked={formData.disponivel}
              onChange={(e) => setFormData({ ...formData, disponivel: e.target.checked })}
              name="disponivel"
              color="primary"
            />
          </div>
          <Select
        value={selectedTipo}
        onChange={(e) => setSelectedTipo(e.target.value)}
        label="Escolha uma opção"
        sx={{ mt: 2, mb: 2, color: 'text.primary', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'text.primary' } }}
      >
        <MenuItem value="Imóvel para venda">Imóvel para venda</MenuItem>
        <MenuItem value="Lote">Lote</MenuItem>
        <MenuItem value="Imóvel para locação">Imóvel para locação</MenuItem>
      </Select>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Endereço</label>
            <input
              type="text"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Preço (R$)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  value={formatToBRL(formData.valor)}
                  onChange={(e) => {
                    const valorFormatado = e.target.value;
                    const valorNumerico = removeMask(valorFormatado);
                    setFormData({ ...formData, valor: valorNumerico });
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Área (m²)
              </label>
              <div className="relative">
                <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="number"
                  value={Number(formData.area)}
                  onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Quartos</label>
              <div className="relative">
                <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="number"
                  value={formData.numero_quartos}
                  onChange={(e) => setFormData({ ...formData, numero_quartos: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Banheiros</label>
              <div className="relative">
                <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="number"
                  value={formData.numero_banheiros}
                  onChange={(e) =>
                    setFormData({ ...formData, numero_banheiros: Number(e.target.value) })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-background-paper border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none resize-none"
              required
            />
          </div>

          {
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Fotos</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition">
                <Upload className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-text-secondary">Clique para fazer upload de fotos</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-text-secondary mt-1">
                  Você pode adicionar múltiplas fotos
                </p>
              </div>

              {fotos.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {fotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.url ?? photo}
                        alt={`Preview ${index + 1}`}
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index, photo)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              {loading ? 'Salvando...' : property ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
