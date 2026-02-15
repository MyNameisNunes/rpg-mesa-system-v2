import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import '../styles/GameRoom.css';

interface GameRoomProps {
  sessionId: string;
  token: string;
  user: any;
  onLeave: () => void;
}

const GameRoom: React.FC<GameRoomProps> = ({ sessionId, token, user, onLeave }) => {
  const {
    socket,
    connected,
    permissions,
    session,
    joinSession,
    leaveSession,
    sendChatMessage,
    rollDice,
    createCharacter,
    updatePermissions,
    grantTempPermission
  } = useSocket(token);

  const [activeTab, setActiveTab] = useState<'chat' | 'dice' | 'characters' | 'permissions'>('chat');
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<any[]>([]);
  const [diceNotation, setDiceNotation] = useState('1d20');
  const [diceReason, setDiceReason] = useState('');
  const [diceHistory, setDiceHistory] = useState<any[]>([]);

  // Estados para permissões temporárias
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [tempPermission, setTempPermission] = useState('canCreateCharacter');
  const [tempDuration, setTempDuration] = useState(300);

  useEffect(() => {
    if (socket && sessionId) {
      joinSession(sessionId);
    }
  }, [socket, sessionId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('chat-message', (message: any) => {
      setChatLog(prev => [...prev, message]);
    });

    socket.on('dice-rolled', (roll: any) => {
      setDiceHistory(prev => [...prev, roll]);
    });

    socket.on('player-joined', (player: any) => {
      setChatLog(prev => [...prev, {
        id: `system_${Date.now()}`,
        type: 'system',
        message: `${player.username} entrou na sessão`,
        timestamp: new Date()
      }]);
    });

    socket.on('player-left', (player: any) => {
      setChatLog(prev => [...prev, {
        id: `system_${Date.now()}`,
        type: 'system',
        message: `${player.username} saiu da sessão`,
        timestamp: new Date()
      }]);
    });

    return () => {
      socket.off('chat-message');
      socket.off('dice-rolled');
      socket.off('player-joined');
      socket.off('player-left');
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (chatMessage.trim() && permissions?.canChat) {
      sendChatMessage(chatMessage);
      setChatMessage('');
    }
  };

  const handleRollDice = () => {
    if (permissions?.canRollDice) {
      rollDice(diceNotation, diceReason, 'public');
      setDiceReason('');
    }
  };

  const handleGrantTempPermission = () => {
    if (selectedPlayer && user.role === 'master') {
      grantTempPermission(selectedPlayer, tempPermission, tempDuration);
      alert(`Permissão concedida por ${tempDuration} segundos!`);
    }
  };

  const handleLeave = () => {
    leaveSession();
    onLeave();
  };

  if (!connected) {
    return (
      <div className="game-room loading">
        <p>Conectando ao servidor...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="game-room loading">
        <p>Carregando sessão...</p>
      </div>
    );
  }

  return (
    <div className="game-room">
      <header className="game-header">
        <div className="header-left">
          <h1>🎲 {session.name}</h1>
          <span className="system-badge">{session.systemType}</span>
        </div>
        <div className="header-right">
          <span className="status">
            {connected ? '🟢 Online' : '🔴 Offline'}
          </span>
          <button onClick={handleLeave} className="btn-leave">
            ← Sair
          </button>
        </div>
      </header>

      <div className="game-content">
        <aside className="sidebar">
          <div className="players-list">
            <h3>Jogadores ({session.players?.length || 0})</h3>
            {session.players?.map((player: any) => (
              <div key={player.userId} className="player-item">
                <span className="player-icon">
                  {player.role === 'master' ? '👑' : '🎮'}
                </span>
                <span className="player-name">{player.username}</span>
                {player.role === 'master' && (
                  <span className="master-badge">GM</span>
                )}
              </div>
            ))}
          </div>

          <div className="permissions-info">
            <h3>Suas Permissões</h3>
            <div className="permissions-list">
              {permissions && Object.entries(permissions).map(([key, value]) => (
                <div key={key} className={`permission-item ${value ? 'active' : 'inactive'}`}>
                  <span className="permission-icon">{value ? '✅' : '❌'}</span>
                  <span className="permission-name">
                    {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="tabs">
            <button
              className={activeTab === 'chat' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('chat')}
            >
              💬 Chat
            </button>
            <button
              className={activeTab === 'dice' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('dice')}
            >
              🎲 Dados
            </button>
            <button
              className={activeTab === 'characters' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('characters')}
            >
              👥 Personagens
            </button>
            {user.role === 'master' && (
              <button
                className={activeTab === 'permissions' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('permissions')}
              >
                🔐 Permissões
              </button>
            )}
          </div>

          <div className="tab-content">
            {activeTab === 'chat' && (
              <div className="chat-tab">
                <div className="chat-messages">
                  {chatLog.map(msg => (
                    <div key={msg.id} className={`chat-message ${msg.type}`}>
                      {msg.type === 'system' ? (
                        <span className="system-message">{msg.message}</span>
                      ) : (
                        <>
                          <span className="message-sender">{msg.senderName}:</span>
                          <span className="message-text">{msg.message}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={permissions?.canChat ? "Digite sua mensagem..." : "Sem permissão para enviar mensagens"}
                    disabled={!permissions?.canChat}
                  />
                  <button onClick={handleSendMessage} disabled={!permissions?.canChat}>
                    Enviar
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'dice' && (
              <div className="dice-tab">
                <div className="dice-roller">
                  <h2>Sistema de Dados</h2>
                  <div className="quick-dice">
                    {['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '1d100'].map(notation => (
                      <button
                        key={notation}
                        onClick={() => setDiceNotation(notation)}
                        className={diceNotation === notation ? 'active' : ''}
                        disabled={!permissions?.canRollDice}
                      >
                        {notation}
                      </button>
                    ))}
                  </div>
                  <div className="custom-dice">
                    <input
                      type="text"
                      value={diceNotation}
                      onChange={(e) => setDiceNotation(e.target.value)}
                      placeholder="Ex: 2d20+5"
                      disabled={!permissions?.canRollDice}
                    />
                    <input
                      type="text"
                      value={diceReason}
                      onChange={(e) => setDiceReason(e.target.value)}
                      placeholder="Motivo (opcional)"
                      disabled={!permissions?.canRollDice}
                    />
                    <button onClick={handleRollDice} disabled={!permissions?.canRollDice}>
                      🎲 Rolar
                    </button>
                  </div>
                </div>
                <div className="dice-history">
                  <h3>Histórico</h3>
                  {diceHistory.slice().reverse().map(roll => (
                    <div key={roll.id} className="dice-result">
                      <span className="roller">{roll.rollerName}:</span>
                      <span className="notation">{roll.diceNotation}</span>
                      <span className="rolls">[{roll.rolls.join(', ')}]</span>
                      {roll.modifier !== 0 && (
                        <span className="modifier">{roll.modifier > 0 ? '+' : ''}{roll.modifier}</span>
                      )}
                      <span className="result">= {roll.result}</span>
                      {roll.reason && <span className="reason">({roll.reason})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'characters' && (
              <div className="characters-tab">
                <h2>Personagens</h2>
                {permissions?.canCreateCharacter && (
                  <button className="btn-create-character">
                    ➕ Criar Personagem
                  </button>
                )}
                <div className="characters-list">
                  {session.characters?.length === 0 ? (
                    <p className="empty-message">Nenhum personagem criado ainda</p>
                  ) : (
                    session.characters?.map((char: any) => (
                      <div key={char.id} className="character-card">
                        <h3>{char.name}</h3>
                        <p>{char.race} {char.class}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'permissions' && user.role === 'master' && (
              <div className="permissions-tab">
                <h2>Gerenciar Permissões</h2>
                
                <div className="temp-permission-form">
                  <h3>Conceder Permissão Temporária</h3>
                  
                  <div className="form-group">
                    <label>Jogador:</label>
                    <select
                      value={selectedPlayer || ''}
                      onChange={(e) => setSelectedPlayer(e.target.value)}
                    >
                      <option value="">Selecione um jogador</option>
                      {session.players?.filter((p: any) => p.role !== 'master').map((player: any) => (
                        <option key={player.userId} value={player.userId}>
                          {player.username}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Permissão:</label>
                    <select
                      value={tempPermission}
                      onChange={(e) => setTempPermission(e.target.value)}
                    >
                      <option value="canCreateCharacter">Criar Personagem</option>
                      <option value="canEditCharacter">Editar Personagem</option>
                      <option value="canViewAllCharacters">Ver Todos Personagens</option>
                      <option value="canEditMap">Editar Mapa</option>
                      <option value="canInitiateBattle">Iniciar Combate</option>
                      <option value="canControlBattle">Controlar Combate</option>
                      <option value="canEditNotes">Editar Notas</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Duração (segundos):</label>
                    <input
                      type="number"
                      value={tempDuration}
                      onChange={(e) => setTempDuration(parseInt(e.target.value))}
                      min="10"
                      max="3600"
                    />
                    <span className="duration-helper">
                      {tempDuration} segundos = {Math.floor(tempDuration / 60)} minuto(s)
                    </span>
                  </div>

                  <button
                    onClick={handleGrantTempPermission}
                    disabled={!selectedPlayer}
                    className="btn-grant-permission"
                  >
                    ⏰ Conceder Permissão Temporária
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GameRoom;
