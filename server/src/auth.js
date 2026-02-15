import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-super-seguro-mude-isso';
const users = new Map();

// Criar usuários padrão
const defaultUsers = [
  {
    id: 'master_001',
    username: 'mestre',
    password: 'mestre123',
    role: 'master'
  },
  {
    id: 'player_001',
    username: 'jogador1',
    password: 'jogador123',
    role: 'player'
  },
  {
    id: 'player_002',
    username: 'jogador2',
    password: 'jogador123',
    role: 'player'
  }
];

// Inicializar usuários
async function initDefaultUsers() {
  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    users.set(user.username, {
      ...user,
      password: hashedPassword,
      createdAt: new Date()
    });
  }
  console.log('✅ Usuários padrão criados:');
  console.log('   Mestre: mestre / mestre123');
  console.log('   Jogador 1: jogador1 / jogador123');
  console.log('   Jogador 2: jogador2 / jogador123');
}

initDefaultUsers();

export const AuthService = {
  async register(username, password, role = 'player') {
    if (users.has(username)) {
      throw new Error('Usuário já existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: `${role}_${Date.now()}`,
      username,
      password: hashedPassword,
      role,
      createdAt: new Date()
    };

    users.set(username, user);
    return user;
  },

  async login(username, password) {
    const user = users.get(username);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Senha incorreta');
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword
    };
  },

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role
      };
    } catch (error) {
      throw new Error('Token inválido');
    }
  },

  getUserById(userId) {
    for (const user of users.values()) {
      if (user.id === userId) {
        return user;
      }
    }
    return undefined;
  },

  getAllUsers() {
    return Array.from(users.values()).map(({ password, ...user }) => user);
  }
};
