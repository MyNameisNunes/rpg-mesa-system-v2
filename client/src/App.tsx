import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import SessionList from './components/SessionList';
import GameRoom from './components/GameRoom';

type View = 'login' | 'sessions' | 'game';

function App() {
  const [view, setView] = useState<View>('login');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setView('sessions');
    }
  }, []);

  const handleLogin = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    setView('sessions');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setView('login');
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setView('game');
  };

  const handleLeaveSession = () => {
    setCurrentSessionId(null);
    setView('sessions');
  };

  return (
    <div className="app">
      {view === 'login' && (
        <Login onLogin={handleLogin} />
      )}

      {view === 'sessions' && token && user && (
        <SessionList
          user={user}
          token={token}
          onSelectSession={handleSelectSession}
          onLogout={handleLogout}
        />
      )}

      {view === 'game' && token && user && currentSessionId && (
        <GameRoom
          sessionId={currentSessionId}
          token={token}
          user={user}
          onLeave={handleLeaveSession}
        />
      )}
    </div>
  );
}

export default App;
