const DEFAULT_MASTER_PERMISSIONS = {
  canCreateCharacter: true,
  canEditCharacter: true,
  canViewAllCharacters: true,
  canRollDice: true,
  canChat: true,
  canViewMap: true,
  canEditMap: true,
  canInitiateBattle: true,
  canControlBattle: true,
  canViewNotes: true,
  canEditNotes: true
};

const DEFAULT_PLAYER_PERMISSIONS = {
  canCreateCharacter: false,
  canEditCharacter: false,
  canViewAllCharacters: false,
  canRollDice: true,
  canChat: true,
  canViewMap: true,
  canEditMap: false,
  canInitiateBattle: false,
  canControlBattle: false,
  canViewNotes: false,
  canEditNotes: false
};

const sessions = new Map();

export const SessionManager = {
  createSession(name, systemType, masterId) {
    const session = {
      id: `session_${Date.now()}`,
      name,
      systemType,
      masterId,
      players: [],
      characters: [],
      permissions: {},
      temporaryPermissions: [],
      chatLog: [],
      diceHistory: [],
      createdAt: new Date(),
      lastActivity: new Date()
    };

    sessions.set(session.id, session);
    return session;
  },

  getSession(sessionId) {
    return sessions.get(sessionId);
  },

  getAllSessions() {
    return Array.from(sessions.values());
  },

  addPlayer(sessionId, userId, username, role, socketId) {
    const session = sessions.get(sessionId);
    if (!session) return false;

    if (session.players.some(p => p.userId === userId)) {
      return false;
    }

    session.players.push({
      socketId,
      userId,
      username,
      role,
      sessionId
    });

    if (!session.permissions[userId]) {
      session.permissions[userId] = role === 'master' 
        ? { ...DEFAULT_MASTER_PERMISSIONS }
        : { ...DEFAULT_PLAYER_PERMISSIONS };
    }

    session.lastActivity = new Date();
    return true;
  },

  removePlayer(sessionId, userId) {
    const session = sessions.get(sessionId);
    if (!session) return false;

    session.players = session.players.filter(p => p.userId !== userId);
    session.lastActivity = new Date();
    return true;
  },

  getUserPermissions(sessionId, userId) {
    const session = sessions.get(sessionId);
    if (!session) return null;

    this.cleanExpiredPermissions(sessionId);

    const basePermissions = session.permissions[userId] || { ...DEFAULT_PLAYER_PERMISSIONS };
    const finalPermissions = { ...basePermissions };

    const tempPerms = session.temporaryPermissions.filter(tp => tp.userId === userId);
    for (const tempPerm of tempPerms) {
      finalPermissions[tempPerm.permission] = true;
    }

    return finalPermissions;
  },

  updatePermissions(sessionId, userId, permissions) {
    const session = sessions.get(sessionId);
    if (!session) return false;

    if (!session.permissions[userId]) {
      session.permissions[userId] = { ...DEFAULT_PLAYER_PERMISSIONS };
    }

    session.permissions[userId] = {
      ...session.permissions[userId],
      ...permissions
    };

    session.lastActivity = new Date();
    return true;
  },

  grantTemporaryPermission(sessionId, userId, permission, durationSeconds) {
    const session = sessions.get(sessionId);
    if (!session) return false;

    const expiresAt = new Date(Date.now() + durationSeconds * 1000);

    session.temporaryPermissions = session.temporaryPermissions.filter(
      tp => !(tp.userId === userId && tp.permission === permission)
    );

    session.temporaryPermissions.push({
      userId,
      permission,
      expiresAt
    });

    session.lastActivity = new Date();
    return true;
  },

  revokeTemporaryPermission(sessionId, userId, permission) {
    const session = sessions.get(sessionId);
    if (!session) return false;

    session.temporaryPermissions = session.temporaryPermissions.filter(
      tp => !(tp.userId === userId && tp.permission === permission)
    );

    session.lastActivity = new Date();
    return true;
  },

  cleanExpiredPermissions(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return;

    const now = new Date();
    session.temporaryPermissions = session.temporaryPermissions.filter(
      tp => tp.expiresAt > now
    );
  },

  hasPermission(sessionId, userId, permission) {
    const permissions = this.getUserPermissions(sessionId, userId);
    return permissions ? permissions[permission] === true : false;
  },

  addChatMessage(sessionId, message) {
    const session = sessions.get(sessionId);
    if (!session) return false;

    session.chatLog.push(message);
    session.lastActivity = new Date();
    return true;
  },

  addDiceRoll(sessionId, roll) {
    const session = sessions.get(sessionId);
    if (!session) return false;

    session.diceHistory.push(roll);
    session.lastActivity = new Date();
    return true;
  },

  addCharacter(sessionId, character) {
    const session = sessions.get(sessionId);
    if (!session) return false;

    session.characters.push(character);
    session.lastActivity = new Date();
    return true;
  },

  updateCharacter(sessionId, characterId, updates) {
    const session = sessions.get(sessionId);
    if (!session) return false;

    const charIndex = session.characters.findIndex(c => c.id === characterId);
    if (charIndex === -1) return false;

    session.characters[charIndex] = {
      ...session.characters[charIndex],
      ...updates
    };

    session.lastActivity = new Date();
    return true;
  },

  deleteSession(sessionId) {
    return sessions.delete(sessionId);
  }
};

// Limpar permissões expiradas a cada minuto
setInterval(() => {
  for (const session of sessions.values()) {
    SessionManager.cleanExpiredPermissions(session.id);
  }
}, 60000);
