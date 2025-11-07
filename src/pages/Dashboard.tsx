import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import TeamManagement from '../components/TeamManagement';
import TaskForm from '../components/TaskForm';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'kanban' | 'teams' | 'createTask'>('kanban');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>🚀 Mini Kanban</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#666' }}>Hola, <strong>{user?.name}</strong></span>
          <button 
            onClick={logout}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Navegación */}
      <nav style={{ 
        backgroundColor: 'white', 
        padding: '15px 20px',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveSection('kanban')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeSection === 'kanban' ? '#007bff' : 'transparent',
              color: activeSection === 'kanban' ? 'white' : '#007bff',
              border: '1px solid #007bff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            📋 Tablero Kanban
          </button>
          <button
            onClick={() => setActiveSection('teams')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeSection === 'teams' ? '#007bff' : 'transparent',
              color: activeSection === 'teams' ? 'white' : '#007bff',
              border: '1px solid #007bff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            👥 Equipos
          </button>
          <button
            onClick={() => setActiveSection('createTask')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeSection === 'createTask' ? '#007bff' : 'transparent',
              color: activeSection === 'createTask' ? 'white' : '#007bff',
              border: '1px solid #007bff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            ➕ Crear Tarea
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {activeSection === 'kanban' && <KanbanBoard />}
        {activeSection === 'teams' && <TeamManagement />}
        {activeSection === 'createTask' && <TaskForm />}
      </main>
    </div>
  );
};

export default Dashboard;