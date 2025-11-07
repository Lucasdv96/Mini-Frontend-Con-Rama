import React, { useState, useEffect } from 'react';
import { Team } from '../types';
import { teamService } from '../services/teamService';
import { useAuth } from '../contexts/AuthContext';

const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await teamService.getAll();
      setTeams(teamsData);
    } catch (err: any) {
      setError('Error al cargar los equipos');
      console.error('Error loading teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTeamName.trim()) return;

    try {
      await teamService.create(newTeamName, user.id);
      setNewTeamName('');
      setShowCreateForm(false);
      await loadTeams();
      alert('Equipo creado exitosamente!');
    } catch (err: any) {
      alert('Error al crear el equipo: ' + (err.response?.data?.message || 'Error desconocido'));
      console.error('Error creating team:', err);
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
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        <h2>Gestión de Equipos</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Crear Equipo
        </button>
      </div>

      {error && (
        <div style={{ 
          color: '#721c24', 
          backgroundColor: '#f8d7da',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {/* Formulario para crear equipo */}
      {showCreateForm && (
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
            maxWidth: '500px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Crear Nuevo Equipo</h3>
            <form onSubmit={handleCreateTeam}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Nombre del equipo:
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  required
                  placeholder="Ingresa el nombre del equipo"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="submit" 
                  style={{ 
                    padding: '12px 24px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Crear
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)} 
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
            </form>
          </div>
        </div>
      )}

      {/* Lista de equipos */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {teams.map(team => (
          <div key={team.id} style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #007bff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{team.name}</h3>
                <p style={{ margin: 0, color: '#666' }}>
                  <strong>Propietario:</strong> {team.propietario.name}
                </p>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                  <strong>Miembros:</strong> {team.memberships?.length || 0} | 
                  <strong> Tareas:</strong> {team.tasks?.length || 0}
                </p>
                <p style={{ margin: '5px 0 0 0', color: '#999', fontSize: '14px' }}>
                  Creado: {new Date(team.fechaCreacion).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          color: '#666', 
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
          <h3 style={{ color: '#333' }}>No hay equipos creados</h3>
          <p style={{ marginBottom: '20px' }}>Crea tu primer equipo para comenzar a organizar tareas</p>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Crear Primer Equipo
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;