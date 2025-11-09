import React, { useState, useEffect } from 'react';
import { Etiqueta, Task } from '../types';
import { etiquetaService } from '../services/etiquetaService';
import { useAuth } from '../contexts/AuthContext';

interface AsignarEtiquetasModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onEtiquetasUpdated: (updatedTask: Task) => void;
}

const AsignarEtiquetasModal: React.FC<AsignarEtiquetasModalProps> = ({
  isOpen,
  onClose,
  task,
  onEtiquetasUpdated
}) => {
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState<number[]>([]);
  const [newEtiquetaNombre, setNewEtiquetaNombre] = useState('');
  const [newEtiquetaColor, setNewEtiquetaColor] = useState('#FF5733');
  const [showNewEtiqueta, setShowNewEtiqueta] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      loadEtiquetas();
      setSelectedEtiquetas(task.etiquetas?.map(e => e.id) || []);
    }
  }, [isOpen, task]);

  const loadEtiquetas = async () => {
    try {
      const etiquetasData = await etiquetaService.getAll();
      setEtiquetas(etiquetasData);
    } catch (err: any) {
      console.error('Error loading etiquetas:', err);
    }
  };

  const toggleEtiqueta = (etiquetaId: number) => {
    setSelectedEtiquetas(prev =>
      prev.includes(etiquetaId)
        ? prev.filter(id => id !== etiquetaId)
        : [...prev, etiquetaId]
    );
  };

  const handleAsignarEtiquetas = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await etiquetaService.assignToTask(task.id, selectedEtiquetas, user.id);
      
      // Recargar las etiquetas de la tarea
      const updatedEtiquetas = await etiquetaService.getTaskEtiquetas(task.id);
      const updatedTask = { ...task, etiquetas: updatedEtiquetas };
      
      onEtiquetasUpdated(updatedTask);
      onClose();
      alert('✅ Etiquetas asignadas exitosamente!');
    } catch (err: any) {
      alert('❌ Error al asignar etiquetas: ' + (err.response?.data?.message || 'Error desconocido'));
      console.error('Error assigning etiquetas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEtiqueta = async () => {
    if (!newEtiquetaNombre.trim()) {
      alert('Por favor ingresa un nombre para la etiqueta');
      return;
    }

    try {
      const nuevaEtiqueta = await etiquetaService.create(newEtiquetaNombre, newEtiquetaColor);
      setEtiquetas(prev => [...prev, nuevaEtiqueta]);
      setSelectedEtiquetas(prev => [...prev, nuevaEtiqueta.id]);
      setNewEtiquetaNombre('');
      setNewEtiquetaColor('#FF5733');
      setShowNewEtiqueta(false);
      alert('✅ Etiqueta creada exitosamente!');
    } catch (err: any) {
      alert('❌ Error al crear la etiqueta: ' + (err.response?.data?.message || 'Error desconocido'));
      console.error('Error creating etiqueta:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ margin: '0 0 20px 0' }}>
          Asignar Etiquetas a: "{task.title}"
        </h3>

        {/* Etiquetas existentes */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Etiquetas existentes:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
            {etiquetas.map(etiqueta => (
              <button
                key={etiqueta.id}
                type="button"
                onClick={() => toggleEtiqueta(etiqueta.id)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: selectedEtiquetas.includes(etiqueta.id) ? etiqueta.color : '#f8f9fa',
                  color: selectedEtiquetas.includes(etiqueta.id) ? 'white' : '#333',
                  border: `2px solid ${etiqueta.color}`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                {etiqueta.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Crear nueva etiqueta */}
        <div style={{ marginBottom: '30px' }}>
          <button
            type="button"
            onClick={() => setShowNewEtiqueta(!showNewEtiqueta)}
            style={{
              padding: '10px 16px',
              backgroundColor: showNewEtiqueta ? '#6c757d' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {showNewEtiqueta ? '❌ Cancelar' : '➕ Crear Nueva Etiqueta'}
          </button>

          {showNewEtiqueta && (
            <div style={{ 
              marginTop: '15px', 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              border: '2px dashed #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Nueva Etiqueta</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                    Nombre:
                  </label>
                  <input
                    type="text"
                    value={newEtiquetaNombre}
                    onChange={(e) => setNewEtiquetaNombre(e.target.value)}
                    placeholder="Nombre de la etiqueta"
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                    Color:
                  </label>
                  <input
                    type="color"
                    value={newEtiquetaColor}
                    onChange={(e) => setNewEtiquetaColor(e.target.value)}
                    style={{ 
                      width: '100%', 
                      height: '42px',
                      padding: '2px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
              
              {newEtiquetaNombre && (
                <div style={{ 
                  padding: '10px',
                  backgroundColor: newEtiquetaColor,
                  color: 'white',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  marginBottom: '15px'
                }}>
                  Vista previa: {newEtiquetaNombre}
                </div>
              )}

              <button
                type="button"
                onClick={handleCreateEtiqueta}
                disabled={!newEtiquetaNombre.trim()}
                style={{
                  padding: '10px 16px',
                  backgroundColor: !newEtiquetaNombre.trim() ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: !newEtiquetaNombre.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                ✅ Crear y Seleccionar Etiqueta
              </button>
            </div>
          )}
        </div>

        {/* Etiquetas seleccionadas */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Etiquetas seleccionadas:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedEtiquetas.map(etiquetaId => {
              const etiqueta = etiquetas.find(e => e.id === etiquetaId);
              return etiqueta ? (
                <span
                  key={etiqueta.id}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: etiqueta.color,
                    color: 'white',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {etiqueta.nombre}
                </span>
              ) : null;
            })}
            {selectedEtiquetas.length === 0 && (
              <span style={{ color: '#666', fontStyle: 'italic' }}>
                No hay etiquetas seleccionadas
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleAsignarEtiquetas}
            disabled={loading}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: loading ? '#6c757d' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Asignando...' : '💾 Guardar Etiquetas'}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarEtiquetasModal;