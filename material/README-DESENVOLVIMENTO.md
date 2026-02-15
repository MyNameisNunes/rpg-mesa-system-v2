# 📚 README - Guia de Desenvolvimento

## 🎯 Objetivo deste Documento

Este README foi criado para você **desenvolver o projeto sozinho**, sem precisar de assistência de IA. Aqui você encontrará:

- 📖 Explicação completa da arquitetura
- 🔧 Como adicionar novas funcionalidades
- 📝 Código comentado e exemplos
- 🔗 Links para documentações oficiais
- 💡 Boas práticas e padrões

---

## 📁 Estrutura do Projeto

```
rpg-mesa-system-v2/
│
├── server/                    # Backend (Node.js + Express + Socket.io)
│   ├── src/
│   │   ├── index.js          # Servidor principal
│   │   ├── auth.js           # Autenticação JWT
│   │   └── sessionManager.js # Gerenciamento de sessões e permissões
│   ├── package.json
│   └── .env                  # Configurações (porta, secrets)
│
└── client/                    # Frontend (React + TypeScript + Vite)
    ├── src/
    │   ├── components/        # Componentes React
    │   │   ├── Login.tsx
    │   │   ├── SessionList.tsx
    │   │   └── GameRoom.tsx
    │   ├── hooks/             # Custom Hooks
    │   │   └── useSocket.ts  # Hook para WebSocket
    │   ├── data/              # Dados estáticos
    │   │   └── systemRules.ts # Regras dos 8 sistemas de RPG
    │   ├── types/             # Tipos TypeScript
    │   │   └── index.ts
    │   ├── styles/            # CSS de cada componente
    │   ├── App.tsx            # Componente principal
    │   └── main.tsx           # Entry point
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

---

## 🔧 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **Socket.io** - WebSocket para comunicação em tempo real
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **dotenv** - Variáveis de ambiente

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - JavaScript com tipagem
- **Vite** - Build tool rápido
- **Socket.io-client** - Cliente WebSocket

---

## 📖 Documentações Oficiais

### Backend
- [Node.js](https://nodejs.org/docs/latest/api/)
- [Express.js](https://expressjs.com/en/4x/api.html)
- [Socket.io](https://socket.io/docs/v4/)
- [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js)

### Frontend
- [React](https://react.dev/learn)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/guide/)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

### Aprendizado
- [JavaScript MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Tutorial](https://react.dev/learn/tutorial-tic-tac-toe)

---

## 🎓 Conceitos Importantes

### 1. WebSocket vs HTTP

**HTTP (Request/Response):**
```
Cliente → Request → Servidor
Cliente ← Response ← Servidor
```
- Unidirecional
- Cliente sempre inicia
- Usado para: Login, criar sessão, buscar dados

**WebSocket (Bidirecionional):**
```
Cliente ↔ Conexão Persistente ↔ Servidor
```
- Bidirecional
- Tempo real
- Qualquer um pode enviar mensagens
- Usado para: Chat, dados, notificações

### 2. JWT (JSON Web Token)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJ1c2VybmFtZSI6Im1lc3RyZSJ9.abc123...
│────────── Header ──────────│───────── Payload ────────│── Signature ──│
```

**Como funciona:**
1. Usuário faz login (username + password)
2. Servidor valida e cria token JWT
3. Cliente armazena token (localStorage)
4. Cliente envia token em todas as requisições
5. Servidor valida token antes de responder

**No código:**
```javascript
// Criar token (backend)
const token = jwt.sign({ userId, username, role }, SECRET, { expiresIn: '24h' });

// Validar token (backend)
const decoded = jwt.verify(token, SECRET);
```

### 3. React Hooks

**useState** - Gerenciar estado:
```typescript
const [count, setCount] = useState(0);
setCount(count + 1); // Atualiza estado
```

**useEffect** - Executar código em momentos específicos:
```typescript
useEffect(() => {
  // Código executa quando componente é montado
  return () => {
    // Cleanup quando componente é desmontado
  };
}, [dependencias]); // Executa quando dependências mudam
```

**Custom Hook** - Reutilizar lógica:
```typescript
function useSocket(token) {
  // Lógica compartilhada
  return { socket, connected, ... };
}
```

### 4. TypeScript Básico

**Tipos Primitivos:**
```typescript
let nome: string = "João";
let idade: number = 25;
let ativo: boolean = true;
```

**Interfaces:**
```typescript
interface Usuario {
  id: string;
  nome: string;
  idade?: number; // ? = opcional
}

const usuario: Usuario = {
  id: "1",
  nome: "João"
  // idade é opcional
};
```

**Union Types:**
```typescript
type Role = 'master' | 'player'; // Só pode ser um desses
let role: Role = 'master'; // ✅ OK
let role2: Role = 'admin'; // ❌ Erro
```

---

## 🛠️ Como Adicionar Funcionalidades

### 1. Adicionar Novo Sistema de RPG

**Arquivo:** `client/src/data/systemRules.ts`

```typescript
// 1. Adicione o tipo no enum
export type SystemType = 
  | 'DND5E' 
  | 'NOVO_SISTEMA' // ← Adicione aqui
  | ...;

// 2. Crie as regras
export const NOVO_SISTEMA_RULES: SystemRules = {
  name: 'Nome do Sistema',
  type: 'NOVO_SISTEMA',
  description: 'Descrição do sistema',
  
  // Atributos do personagem
  attributes: ['forca', 'agilidade', 'inteligencia'],
  
  // Fórmulas de cálculo
  hpFormula: 'constituicao * level + 10',
  acFormula: '10 + agilidade',
  initiativeFormula: 'agilidade + d20',
  
  // Progressão de nível
  maxLevel: 20,
  experienceTable: [0, 1000, 3000, ...],
  
  // Classes disponíveis
  classes: [
    {
      id: 'guerreiro',
      name: 'Guerreiro',
      description: 'Combatente corpo a corpo',
      hitDie: 'd10',
      primaryAttributes: ['forca'],
      proficiencies: ['Armas', 'Armaduras'],
      startingEquipment: ['Espada', 'Escudo']
    }
  ],
  
  // Raças disponíveis
  races: [
    {
      id: 'humano',
      name: 'Humano',
      description: 'Versátil',
      attributeModifiers: { forca: 1, agilidade: 1 },
      traits: ['Versátil'],
      speed: 30
    }
  ],
  
  // Tipos de dados usados
  diceTypes: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20']
};

// 3. Adicione na função getSystemRules
export function getSystemRules(systemType: string): SystemRules {
  const systems: { [key: string]: SystemRules } = {
    DND5E: DND5E_RULES,
    NOVO_SISTEMA: NOVO_SISTEMA_RULES, // ← Adicione aqui
    // ...
  };
  return systems[systemType] || DND5E_RULES;
}

// 4. Adicione na lista de sistemas
export const ALL_SYSTEMS = [
  { type: 'DND5E', name: 'D&D 5e', icon: '🐉', category: 'Fantasia' },
  { type: 'NOVO_SISTEMA', name: 'Novo Sistema', icon: '⚡', category: 'Ação' },
  // ...
];
```

**Documentação útil:**
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)

---

### 2. Adicionar Nova Permissão

**Backend:** `server/src/sessionManager.js`

```javascript
// 1. Adicione a nova permissão nos defaults
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
  canEditNotes: true,
  canManageInventory: true, // ← Nova permissão
};

const DEFAULT_PLAYER_PERMISSIONS = {
  // ... mesmo processo
  canManageInventory: false, // ← Jogador não tem por padrão
};
```

**Frontend:** `client/src/types/index.ts`

```typescript
// 2. Adicione no tipo Permission
export interface Permission {
  canCreateCharacter: boolean;
  canEditCharacter: boolean;
  // ... outras permissões
  canManageInventory: boolean; // ← Adicione aqui
}
```

**Frontend:** `client/src/components/GameRoom.tsx`

```typescript
// 3. Use a permissão no componente
{permissions?.canManageInventory && (
  <button onClick={handleManageInventory}>
    📦 Gerenciar Inventário
  </button>
)}
```

---

### 3. Adicionar Novo Evento WebSocket

**Backend:** `server/src/index.js`

```javascript
// Adicione o listener no io.on('connection', ...)
socket.on('novo-evento', (data) => {
  const sessionId = socket.data.sessionId;
  if (!sessionId) return;

  // Verificar permissão (se necessário)
  if (!SessionManager.hasPermission(sessionId, socket.data.userId, 'canDoSomething')) {
    socket.emit('error', { message: 'Sem permissão' });
    return;
  }

  // Processar dados
  const resultado = processar(data);

  // Enviar para todos na sessão
  io.to(sessionId).emit('evento-resposta', resultado);
  
  // OU enviar apenas para quem enviou
  socket.emit('evento-resposta', resultado);
});
```

**Frontend:** `client/src/hooks/useSocket.ts`

```typescript
// Adicione o listener no useEffect
useEffect(() => {
  if (!socket) return;

  // Escutar evento do servidor
  socket.on('evento-resposta', (data) => {
    console.log('Recebido:', data);
    // Atualizar estado
    setAlgumaCoisa(data);
  });

  // Cleanup
  return () => {
    socket.off('evento-resposta');
  };
}, [socket]);

// Adicione função para enviar evento
const enviarNovoEvento = useCallback((dados: any) => {
  if (socket) {
    socket.emit('novo-evento', dados);
  }
}, [socket]);

// Retorne a função
return {
  socket,
  connected,
  // ... outras funções
  enviarNovoEvento, // ← Adicione aqui
};
```

**Documentação útil:**
- [Socket.io Emit Cheatsheet](https://socket.io/docs/v4/emit-cheatsheet/)

---

### 4. Criar Novo Componente React

**Arquivo:** `client/src/components/MeuComponente.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import '../styles/MeuComponente.css';

// 1. Defina as props (dados que o componente recebe)
interface MeuComponenteProps {
  titulo: string;
  dados: any[];
  onAcao: (id: string) => void;
}

// 2. Crie o componente
const MeuComponente: React.FC<MeuComponenteProps> = ({ 
  titulo, 
  dados, 
  onAcao 
}) => {
  // 3. Estados locais (dados que mudam)
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  // 4. Efeitos (executam em momentos específicos)
  useEffect(() => {
    // Executa quando 'dados' muda
    console.log('Dados atualizados:', dados);
  }, [dados]);

  // 5. Funções de handler
  const handleClick = (id: string) => {
    setSelecionado(id);
    onAcao(id); // Chama função passada por props
  };

  // 6. Renderização
  return (
    <div className="meu-componente">
      <h2>{titulo}</h2>
      
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {dados.map(item => (
            <li 
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={selecionado === item.id ? 'ativo' : ''}
            >
              {item.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MeuComponente;
```

**CSS:** `client/src/styles/MeuComponente.css`

```css
.meu-componente {
  padding: 20px;
  background: white;
  border-radius: 12px;
}

.meu-componente h2 {
  color: #333;
  margin-bottom: 20px;
}

.meu-componente ul {
  list-style: none;
  padding: 0;
}

.meu-componente li {
  padding: 10px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.meu-componente li:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.meu-componente li.ativo {
  background: #667eea;
  color: white;
}
```

**Usar o componente:** `client/src/App.tsx`

```typescript
import MeuComponente from './components/MeuComponente';

function App() {
  const dados = [
    { id: '1', nome: 'Item 1' },
    { id: '2', nome: 'Item 2' }
  ];

  const handleAcao = (id: string) => {
    console.log('Clicou em:', id);
  };

  return (
    <MeuComponente
      titulo="Minha Lista"
      dados={dados}
      onAcao={handleAcao}
    />
  );
}
```

**Documentação útil:**
- [React Components](https://react.dev/learn/your-first-component)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript React Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

### 5. Adicionar Autenticação em Nova Rota

**Backend:** `server/src/index.js`

```javascript
// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = AuthService.verifyToken(token);
    req.user = decoded; // Adiciona user na request
    next(); // Continua para a rota
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Rota protegida
app.get('/api/dados-secretos', verificarToken, (req, res) => {
  // req.user contém { userId, username, role }
  console.log('Usuário autenticado:', req.user);
  
  res.json({ 
    mensagem: 'Dados secretos',
    userId: req.user.userId 
  });
});

// Rota protegida apenas para mestres
app.post('/api/admin/deletar-tudo', verificarToken, (req, res) => {
  if (req.user.role !== 'master') {
    return res.status(403).json({ error: 'Apenas mestres' });
  }
  
  // Código para mestres
  res.json({ sucesso: true });
});
```

**Frontend:** Chamar rota protegida

```typescript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/dados-secretos', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);
```

---

### 6. Salvar Dados no LocalStorage

**JavaScript:**

```javascript
// Salvar
const dados = { nome: 'João', idade: 25 };
localStorage.setItem('usuario', JSON.stringify(dados));

// Carregar
const dadosSalvos = localStorage.getItem('usuario');
if (dadosSalvos) {
  const dados = JSON.parse(dadosSalvos);
  console.log(dados.nome); // "João"
}

// Deletar
localStorage.removeItem('usuario');

// Limpar tudo
localStorage.clear();
```

**TypeScript com React:**

```typescript
import { useState, useEffect } from 'react';

function MeuComponente() {
  const [dados, setDados] = useState(() => {
    // Carregar do localStorage na inicialização
    const saved = localStorage.getItem('meusDados');
    return saved ? JSON.parse(saved) : { /* valores padrão */ };
  });

  // Salvar sempre que dados mudar
  useEffect(() => {
    localStorage.setItem('meusDados', JSON.stringify(dados));
  }, [dados]);

  return (
    <div>
      {/* Usar dados */}
    </div>
  );
}
```

---

## 🐛 Debug e Testes

### Backend (Node.js)

**Console log:**
```javascript
console.log('Valor da variável:', minhaVariavel);
console.log('Tipo:', typeof minhaVariavel);
console.log('Objeto completo:', JSON.stringify(objeto, null, 2));
```

**Debugger:**
```javascript
debugger; // Pausa execução aqui (precisa abrir DevTools do Chrome)
```

**Testar com Postman/Insomnia:**
```
POST http://localhost:3001/api/auth/login
Headers: Content-Type: application/json
Body: {
  "username": "mestre",
  "password": "mestre123"
}
```

### Frontend (React)

**Console log:**
```typescript
console.log('Props recebidas:', props);
console.log('Estado atual:', state);
```

**React DevTools:**
1. Instale extensão: [React DevTools](https://react.dev/learn/react-developer-tools)
2. Abra DevTools (F12)
3. Vá para aba "Components" ou "Profiler"
4. Inspecione estado e props dos componentes

**Network Tab:**
1. F12 → Network
2. Veja todas requisições HTTP/WebSocket
3. Inspecione headers, payload, response

---

## 📦 Estrutura de Dados

### SessionManager (Backend)

```javascript
{
  id: "session_123",
  name: "Campanha dos Dragões",
  systemType: "DND5E",
  masterId: "master_001",
  
  players: [
    {
      socketId: "abc123",
      userId: "master_001",
      username: "mestre",
      role: "master",
      sessionId: "session_123"
    },
    {
      socketId: "def456",
      userId: "player_001",
      username: "jogador1",
      role: "player",
      sessionId: "session_123"
    }
  ],
  
  permissions: {
    "player_001": {
      canCreateCharacter: false,
      canEditCharacter: false,
      canRollDice: true,
      canChat: true,
      // ...
    }
  },
  
  temporaryPermissions: [
    {
      userId: "player_001",
      permission: "canCreateCharacter",
      expiresAt: Date("2024-01-01T12:05:00")
    }
  ],
  
  characters: [],
  chatLog: [],
  diceHistory: [],
  createdAt: Date("2024-01-01T12:00:00"),
  lastActivity: Date("2024-01-01T12:00:00")
}
```

---

## 🔒 Segurança

### Boas Práticas

**1. Nunca exponha secrets:**
```javascript
// ❌ ERRADO
const JWT_SECRET = 'meu-secret-123';

// ✅ CORRETO
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
```

**2. Valide entrada do usuário:**
```javascript
// ❌ ERRADO
const username = req.body.username;
deleteUser(username); // Pode deletar qualquer usuário!

// ✅ CORRETO
const username = req.body.username;
if (!username || typeof username !== 'string') {
  return res.status(400).json({ error: 'Username inválido' });
}
if (username.length < 3 || username.length > 20) {
  return res.status(400).json({ error: 'Username deve ter 3-20 caracteres' });
}
deleteUser(username);
```

**3. Hash de senhas:**
```javascript
// ❌ ERRADO
const user = { username, password }; // Senha em texto puro!

// ✅ CORRETO
const hashedPassword = await bcrypt.hash(password, 10);
const user = { username, password: hashedPassword };
```

**4. Sanitize HTML:**
```typescript
// ❌ ERRADO
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ CORRETO
<div>{userInput}</div> // React escapa automaticamente
```

---

## 🚀 Deploy (Produção)

### Backend (Render/Railway/Heroku)

**1. Prepare o projeto:**
```javascript
// package.json - adicione script
"scripts": {
  "start": "node src/index.js",
  "dev": "node src/index.js"
}
```

**2. Configure variáveis de ambiente:**
```bash
# No serviço de hospedagem, configure:
NODE_ENV=production
JWT_SECRET=um-secret-super-seguro-aleatorio
PORT=3001
```

**3. Deploy:**
- [Render](https://render.com/) - Grátis, fácil
- [Railway](https://railway.app/) - Grátis, moderno
- [Heroku](https://www.heroku.com/) - Tradicional

### Frontend (Vercel/Netlify)

**1. Build:**
```bash
cd client
npm run build
# Cria pasta 'dist' com arquivos otimizados
```

**2. Deploy:**
- [Vercel](https://vercel.com/) - Recomendado para React
- [Netlify](https://www.netlify.com/) - Alternativa excelente

**3. Configure variável de ambiente:**
```typescript
// Mude URL do servidor
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
```

```bash
# No serviço de hospedagem:
VITE_SERVER_URL=https://seu-backend.onrender.com
```

---

## 📚 Recursos de Aprendizado

### Cursos Gratuitos
- [FreeCodeCamp](https://www.freecodecamp.org/)
- [The Odin Project](https://www.theodinproject.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

### YouTube (Português)
- [Rocketseat](https://www.youtube.com/@rocketseat)
- [Filipe Deschamps](https://www.youtube.com/@FilipeDeschamps)
- [Código Fonte TV](https://www.youtube.com/@codigofontetv)

### Livros
- "Eloquent JavaScript" (grátis online)
- "You Don't Know JS" (série gratuita)
- "Clean Code" - Robert Martin

### Prática
- [Frontend Mentor](https://www.frontendmentor.io/)
- [Exercism](https://exercism.org/)
- [LeetCode](https://leetcode.com/)

---

## 🎯 Próximos Passos Sugeridos

### Nível Iniciante
1. ✅ Entender a estrutura atual do projeto
2. ✅ Modificar textos e estilos CSS
3. ✅ Adicionar um novo sistema de RPG
4. ✅ Criar um componente simples

### Nível Intermediário
5. 🔄 Adicionar banco de dados (MongoDB/PostgreSQL)
6. 🔄 Criar sistema de inventário
7. 🔄 Implementar upload de avatares
8. 🔄 Adicionar sistema de amigos

### Nível Avançado
9. 🚀 Implementar áudio/vídeo (WebRTC)
10. 🚀 Criar editor visual de personagens
11. 🚀 Sistema de combate tático
12. 🚀 Mapas interativos com fog of war

---

## 🆘 Troubleshooting Comum

### "Module not found"
```bash
# Instale as dependências
npm install
```

### "Port already in use"
```bash
# Windows - matar processo na porta 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill
```

### "CORS error"
```javascript
// Backend - adicione no cors
app.use(cors({
  origin: ['http://localhost:5173', 'seu-dominio.com'],
  credentials: true
}));
```

### "Cannot read property of undefined"
```typescript
// Use optional chaining
const nome = usuario?.nome; // undefined se usuario for null

// Ou nullish coalescing
const nome = usuario?.nome ?? 'Sem nome';
```

---

## 📞 Onde Buscar Ajuda

1. **Documentação Oficial** - Sempre o primeiro lugar
2. **Stack Overflow** - Busque por mensagens de erro
3. **GitHub Issues** - Veja issues de libraries que usa
4. **Discord/Reddit** - Comunidades de programação
5. **ChatGPT** - Para dúvidas pontuais

---

## ✅ Checklist de Boas Práticas

### Código
- [ ] Nomes descritivos de variáveis
- [ ] Funções pequenas (uma responsabilidade)
- [ ] Comentários apenas quando necessário
- [ ] Sem código duplicado
- [ ] Tratamento de erros adequado

### Git
- [ ] Commits pequenos e frequentes
- [ ] Mensagens de commit descritivas
- [ ] Branches para features
- [ ] README atualizado

### Segurança
- [ ] Senhas hasheadas
- [ ] JWT para autenticação
- [ ] Validação de inputs
- [ ] HTTPS em produção
- [ ] Variáveis sensíveis em .env

---

**Boa sorte no desenvolvimento! 🚀**

Se você seguir este guia e estudar as documentações linkadas, você conseguirá evoluir o projeto sozinho. Pratique, quebre coisas, conserte, e aprenda com os erros. É assim que se aprende programação de verdade! 💪
