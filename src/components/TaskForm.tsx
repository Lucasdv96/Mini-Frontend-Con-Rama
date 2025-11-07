import React, { useState, useEffect } from 'react';
import { Team } from '../types';
import { teamService } from '../services/teamService';
import { taskService } from '../services/taskService';
import { useAuth } from '../contexts/AuthContext';

const TaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const teamsData = await teamService.getAll();
      setTeams(teamsData);
      
      // Seleccionar el primer equipo por defecto si hay equipos
      if (teamsData.length > 0) {
        setSelectedTeam(teamsData[0].id);
      }
    } catch (err: any) {
      console.error('Error loading teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTeam || !title.trim()) return;

    try {
      setSubmitLoading(true);
      await taskService.create(title, description, selectedTeam, user.id);
      
      // Limpiar formulario
      setTitle('');
      setDescription('');
      
      alert('✅ Tarea creada exitosamente!');
    } catch (err: any) {
      alert('❌ Error al crear la tarea: ' + (err.response?.data?.message || 'Error desconocido'));
      console.error('Error creating task:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div>Cargando equipos...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Crear Nueva Tarea</h2>
      
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Título: *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ingresa el título de la tarea"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Descripción:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe la tarea (opcional)"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Equipo: *
          </label>
          <select
            value={selectedTeam || ''}
            onChange={(e) => setSelectedTeam(Number(e.target.value))}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              backgroundColor: 'white'
            }}
          >
            <option value="">Seleccionar equipo</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={submitLoading || !selectedTeam}
          style={{ 
            width: '100%',
            padding: '15px', 
            backgroundColor: submitLoading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: submitLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
        >
          {submitLoading ? '⏳ Creando...' : '🚀 Crear Tarea'}
        </button>
      </form>

      {teams.length === 0 && (
        <div style={{ 
          marginTop: '30px', 
          padding: '30px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '12px',
          color: '#856404',
          textAlign: 'center',
          border: '1px solid #ffeaa7'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>📝 Primero crea un equipo</h3>
          <p style={{ margin: 0 }}>
            Necesitas crear al menos un equipo antes de poder crear tareas. 
            Ve a la pestaña "Equipos" para crear tu primer equipo.
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskForm;