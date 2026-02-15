import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthService } from './auth.js';
import { SessionManager } from './sessionManager.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// ============ ROTAS DE AUTENTICAÇÃO ============

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await AuthService.login(username, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await AuthService.register(username, password, role);
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/auth/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const decoded = AuthService.verifyToken(token);
    res.json(decoded);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// ============ ROTAS DE SESSÃO ============

app.get('/api/sessions', (req, res) => {
  const sessions = SessionManager.getAllSessions();
  res.json(sessions);
});

app.post('/api/sessions', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const decoded = AuthService.verifyToken(token);
    if (decoded.role !== 'master') {
      return res.status(403).json({ error: 'Apenas mestres podem criar sessões' });
    }

    const { name, systemType } = req.body;
    const session = SessionManager.createSession(name, systemType, decoded.userId);
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/sessions/:id', (req, res) => {
  const session = SessionManager.getSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Sessão não encontrada' });
  }
  res.json(session);
});

// ============ WEBSOCKET ============

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Autenticação necessária'));
  }

  try {
    const decoded = AuthService.verifyToken(token);
    socket.data.userId = decoded.userId;
    socket.data.username = decoded.username;
    socket.data.role = decoded.role;
    next();
  } catch (error) {
    next(new Error('Token inválido'));
  }
});

io.on('connection', (socket) => {
  console.log(`✅ ${socket.data.username} (${socket.data.role}) conectado`);

  socket.on('join-session', (sessionId) => {
    const session = SessionManager.getSession(sessionId);
    if (!session) {
      socket.emit('error', { message: 'Sessão não encontrada' });
      return;
    }

    SessionManager.addPlayer(
      sessionId,
      socket.data.userId,
      socket.data.username,
      socket.data.role,
      socket.id
    );

    socket.join(sessionId);
    socket.data.sessionId = sessionId;

    const permissions = SessionManager.getUserPermissions(sessionId, socket.data.userId);
    socket.emit('session-joined', {
      session,
      permissions
    });

    socket.to(sessionId).emit('player-joined', {
      userId: socket.data.userId,
      username: socket.data.username,
      role: socket.data.role
    });

    console.log(`${socket.data.username} entrou na sessão ${sessionId}`);
  });

  socket.on('leave-session', () => {
    const sessionId = socket.data.sessionId;
    if (sessionId) {
      SessionManager.removePlayer(sessionId, socket.data.userId);
      socket.leave(sessionId);
      
      socket.to(sessionId).emit('player-left', {
        userId: socket.data.userId,
        username: socket.data.username
      });
    }
  });

  socket.on('update-permissions', (data) => {
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;

    const session = SessionManager.getSession(sessionId);
    if (!session || session.masterId !== socket.data.userId) {
      socket.emit('error', { message: 'Apenas o mestre pode alterar permissões' });
      return;
    }

    SessionManager.updatePermissions(sessionId, data.targetUserId, data.permissions);
    
    const targetPlayer = session.players.find(p => p.userId === data.targetUserId);
    if (targetPlayer) {
      const updatedPermissions = SessionManager.getUserPermissions(sessionId, data.targetUserId);
      io.to(targetPlayer.socketId).emit('permissions-updated', updatedPermissions);
    }

    io.to(sessionId).emit('session-update', SessionManager.getSession(sessionId));
  });

  socket.on('grant-temp-permission', (data) => {
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;

    const session = SessionManager.getSession(sessionId);
    if (!session || session.masterId !== socket.data.userId) {
      socket.emit('error', { message: 'Apenas o mestre pode conceder permissões temporárias' });
      return;
    }

    SessionManager.grantTemporaryPermission(
      sessionId,
      data.targetUserId,
      data.permission,
      data.durationSeconds
    );

    const targetPlayer = session.players.find(p => p.userId === data.targetUserId);
    if (targetPlayer) {
      const updatedPermissions = SessionManager.getUserPermissions(sessionId, data.targetUserId);
      io.to(targetPlayer.socketId).emit('permissions-updated', updatedPermissions);
      io.to(targetPlayer.socketId).emit('temp-permission-granted', {
        permission: data.permission,
        expiresIn: data.durationSeconds
      });
    }

    console.log(`Permissão temporária: ${data.permission} para ${data.targetUserId} por ${data.durationSeconds}s`);
  });

  socket.on('chat-message', (message) => {
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;

    if (!SessionManager.hasPermission(sessionId, socket.data.userId, 'canChat')) {
      socket.emit('error', { message: 'Você não tem permissão para enviar mensagens' });
      return;
    }

    const chatMessage = {
      id: `msg_${Date.now()}`,
      senderId: socket.data.userId,
      senderName: socket.data.username,
      message,
      timestamp: new Date(),
      type: 'chat'
    };

    SessionManager.addChatMessage(sessionId, chatMessage);
    io.to(sessionId).emit('chat-message', chatMessage);
  });

  socket.on('roll-dice', (data) => {
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;

    if (!SessionManager.hasPermission(sessionId, socket.data.userId, 'canRollDice')) {
      socket.emit('error', { message: 'Você não tem permissão para rolar dados' });
      return;
    }

    const match = data.notation.match(/(\d+)d(\d+)(([+-]\d+))?/i);
    if (!match) {
      socket.emit('error', { message: 'Notação de dado inválida' });
      return;
    }

    const numDice = parseInt(match[1]);
    const diceSize = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;

    const rolls = [];
    let total = 0;

    for (let i = 0; i < numDice; i++) {
      const roll = Math.floor(Math.random() * diceSize) + 1;
      rolls.push(roll);
      total += roll;
    }

    const diceRoll = {
      id: `roll_${Date.now()}`,
      timestamp: new Date(),
      rollerId: socket.data.userId,
      rollerName: socket.data.username,
      diceNotation: data.notation,
      result: total + modifier,
      rolls,
      modifier,
      reason: data.reason,
      visibility: data.visibility
    };

    SessionManager.addDiceRoll(sessionId, diceRoll);

    if (data.visibility === 'public') {
      io.to(sessionId).emit('dice-rolled', diceRoll);
    } else {
      const session = SessionManager.getSession(sessionId);
      if (session) {
        const master = session.players.find(p => p.role === 'master');
        if (master) {
          io.to(master.socketId).emit('dice-rolled', diceRoll);
        }
        socket.emit('dice-rolled', diceRoll);
      }
    }
  });

  socket.on('create-character', (character) => {
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;

    if (!SessionManager.hasPermission(sessionId, socket.data.userId, 'canCreateCharacter')) {
      socket.emit('error', { message: 'Você não tem permissão para criar personagens' });
      return;
    }

    const newCharacter = {
      ...character,
      id: `char_${Date.now()}`,
      ownerId: socket.data.userId
    };

    SessionManager.addCharacter(sessionId, newCharacter);
    io.to(sessionId).emit('character-created', newCharacter);
  });

  socket.on('update-character', (data) => {
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;

    if (!SessionManager.hasPermission(sessionId, socket.data.userId, 'canEditCharacter')) {
      socket.emit('error', { message: 'Você não tem permissão para editar personagens' });
      return;
    }

    SessionManager.updateCharacter(sessionId, data.characterId, data.updates);
    io.to(sessionId).emit('character-updated', {
      characterId: data.characterId,
      updates: data.updates
    });
  });

  socket.on('disconnect', () => {
    const sessionId = socket.data.sessionId;
    if (sessionId) {
      SessionManager.removePlayer(sessionId, socket.data.userId);
      socket.to(sessionId).emit('player-left', {
        userId: socket.data.userId,
        username: socket.data.username
      });
    }
    console.log(`❌ ${socket.data.username} desconectado`);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log('');
  console.log('🎲 ========================================');
  console.log('   Sistema de RPG de Mesa - Servidor');
  console.log('🎲 ========================================');
  console.log('');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 WebSocket disponível`);
  console.log('');
  console.log('📝 Usuários disponíveis:');
  console.log('   Mestre: mestre / mestre123');
  console.log('   Jogador 1: jogador1 / jogador123');
  console.log('   Jogador 2: jogador2 / jogador123');
  console.log('');
  console.log('🎲 ========================================');
});
