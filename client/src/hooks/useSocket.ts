import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001';

export interface Permission {
  canCreateCharacter: boolean;
  canEditCharacter: boolean;
  canViewAllCharacters: boolean;
  canRollDice: boolean;
  canChat: boolean;
  canViewMap: boolean;
  canEditMap: boolean;
  canInitiateBattle: boolean;
  canControlBattle: boolean;
  canViewNotes: boolean;
  canEditNotes: boolean;
}

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [permissions, setPermissions] = useState<Permission | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(SERVER_URL, {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('✅ Conectado ao servidor');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Desconectado do servidor');
      setConnected(false);
    });

    newSocket.on('session-joined', (data: any) => {
      setSession(data.session);
      setPermissions(data.permissions);
    });

    newSocket.on('permissions-updated', (newPermissions: Permission) => {
      setPermissions(newPermissions);
      console.log('🔄 Permissões atualizadas', newPermissions);
    });

    newSocket.on('temp-permission-granted', (data: { permission: string; expiresIn: number }) => {
      console.log(`⏰ Permissão temporária concedida: ${data.permission} por ${data.expiresIn}s`);
      
      // Notificar usuário
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Permissão Temporária', {
          body: `Você recebeu permissão para ${data.permission} por ${data.expiresIn} segundos`
        });
      }
    });

    newSocket.on('session-update', (updatedSession: any) => {
      setSession(updatedSession);
    });

    newSocket.on('error', (error: { message: string }) => {
      console.error('❌ Erro:', error.message);
      alert(error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  const joinSession = useCallback((sessionId: string) => {
    if (socket) {
      socket.emit('join-session', sessionId);
    }
  }, [socket]);

  const leaveSession = useCallback(() => {
    if (socket) {
      socket.emit('leave-session');
      setSession(null);
      setPermissions(null);
    }
  }, [socket]);

  const sendChatMessage = useCallback((message: string) => {
    if (socket) {
      socket.emit('chat-message', message);
    }
  }, [socket]);

  const rollDice = useCallback((notation: string, reason: string, visibility: 'public' | 'gm-only' = 'public') => {
    if (socket) {
      socket.emit('roll-dice', { notation, reason, visibility });
    }
  }, [socket]);

  const createCharacter = useCallback((character: any) => {
    if (socket) {
      socket.emit('create-character', character);
    }
  }, [socket]);

  const updateCharacter = useCallback((characterId: string, updates: any) => {
    if (socket) {
      socket.emit('update-character', { characterId, updates });
    }
  }, [socket]);

  const updatePermissions = useCallback((targetUserId: string, newPermissions: Partial<Permission>) => {
    if (socket) {
      socket.emit('update-permissions', { targetUserId, permissions: newPermissions });
    }
  }, [socket]);

  const grantTempPermission = useCallback((targetUserId: string, permission: string, durationSeconds: number) => {
    if (socket) {
      socket.emit('grant-temp-permission', { targetUserId, permission, durationSeconds });
    }
  }, [socket]);

  return {
    socket,
    connected,
    permissions,
    session,
    joinSession,
    leaveSession,
    sendChatMessage,
    rollDice,
    createCharacter,
    updateCharacter,
    updatePermissions,
    grantTempPermission
  };
}
