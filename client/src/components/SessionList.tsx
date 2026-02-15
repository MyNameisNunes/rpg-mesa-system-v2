import React, { useState, useEffect } from 'react';
import { ALL_SYSTEMS } from '../data/systemRules';
import '../styles/SessionList.css';

interface SessionListProps {
  user: any;
  token: string;
  onSelectSession: (sessionId: string) => void;
  onLogout: () => void;
}

const SessionList: React.FC<SessionListProps> = ({ user, token, onSelectSession, onLogout }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('DND5E');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
    }
  };

  const createSession = async () => {
    if (!newSessionName.trim()) {
      alert('Digite um nome para a sessão!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newSessionName,
          systemType: selectedSystem
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const newSession = await response.json();
      setSessions([...sessions, newSession]);
      setShowCreateForm(false);
      setNewSessionName('');
      onSelectSession(newSession.id);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="session-list-container">
      <div className="session-list-box">
        <div className="header">
          <div>
            <h1>🎲 Sessões Disponíveis</h1>
            <p className="user-info">
              {user.role === 'master' ? '👑' : '🎮'} {user.username}
            </p>
          </div>
          <button onClick={onLogout} className="btn-logout">
            Sair
          </button>
        </div>

        {user.role === 'master' && !showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-create-session"
          >
            ➕ Nova Sessão
          </button>
        )}

        {showCreateForm && (
          <div className="create-session-form">
            <h2>Criar Nova Sessão</h2>
            
            <div className="form-group">
              <label>Nome da Sessão:</label>
              <input
                type="text"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder="Ex: Campanha do Dragão Negro"
              />
            </div>

            <div className="form-group">
              <label>Sistema de RPG:</label>
              <div className="systems-grid">
                {ALL_SYSTEMS.map(system => (
                  <button
                    key={system.type}
                    className={`system-card ${selectedSystem === system.type ? 'selected' : ''}`}
                    onClick={() => setSelectedSystem(system.type)}
                  >
                    <span className="system-icon">{system.icon}</span>
                    <span className="system-name">{system.name}</span>
                    <span className="system-category">{system.category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button onClick={() => setShowCreateForm(false)} className="btn-cancel">
                Cancelar
              </button>
              <button onClick={createSession} className="btn-confirm">
                Criar Sessão
              </button>
            </div>
          </div>
        )}

        <div className="sessions-grid">
          {sessions.length === 0 ? (
            <div className="no-sessions">
              <p>Nenhuma sessão disponível</p>
              {user.role === 'master' && (
                <p>Crie uma nova sessão para começar!</p>
              )}
            </div>
          ) : (
            sessions.map(session => {
              const systemInfo = ALL_SYSTEMS.find(s => s.type === session.systemType);
              return (
                <div key={session.id} className="session-card">
                  <div className="session-icon">{systemInfo?.icon}</div>
                  <h3>{session.name}</h3>
                  <p className="session-system">{systemInfo?.name}</p>
                  <p className="session-players">
                    👥 {session.players.length} jogador(es)
                  </p>
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className="btn-join"
                  >
                    Entrar
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionList;
