# 💻 EXEMPLOS DE CÓDIGO COMENTADOS

## 📚 Índice

1. [Backend - Criar Nova Rota](#backend---criar-nova-rota)
2. [Backend - Adicionar Evento WebSocket](#backend---adicionar-evento-websocket)
3. [Frontend - Criar Hook Customizado](#frontend---criar-hook-customizado)
4. [Frontend - Formulário com Estado](#frontend---formulário-com-estado)
5. [Frontend - Requisição HTTP](#frontend---requisição-http)
6. [Frontend - WebSocket Listener](#frontend---websocket-listener)
7. [TypeScript - Tipos Complexos](#typescript---tipos-complexos)
8. [CSS - Layout Responsivo](#css---layout-responsivo)

---

## Backend - Criar Nova Rota

```javascript
// server/src/index.js

// ============================================
// ROTA SIMPLES (GET)
// ============================================

// GET /api/personagens
// Retorna lista de todos os personagens
app.get('/api/personagens', (req, res) => {
  // req = request (requisição do cliente)
  // res = response (resposta para o cliente)
  
  // Buscar personagens (exemplo simplificado)
  const personagens = [
    { id: '1', nome: 'Aragorn', nivel: 10 },
    { id: '2', nome: 'Gandalf', nivel: 20 }
  ];
  
  // Enviar resposta JSON
  res.json(personagens);
});

// ============================================
// ROTA COM PARÂMETRO (GET)
// ============================================

// GET /api/personagens/:id
// Retorna um personagem específico
app.get('/api/personagens/:id', (req, res) => {
  // Pegar parâmetro da URL
  // Ex: /api/personagens/123 → req.params.id = "123"
  const id = req.params.id;
  
  // Buscar personagem (exemplo)
  const personagem = { id, nome: 'Aragorn', nivel: 10 };
  
  // Verificar se existe
  if (!personagem) {
    // Retornar erro 404
    return res.status(404).json({ 
      error: 'Personagem não encontrado' 
    });
  }
  
  // Retornar personagem
  res.json(personagem);
});

// ============================================
// ROTA COM BODY (POST)
// ============================================

// POST /api/personagens
// Cria novo personagem
app.post('/api/personagens', (req, res) => {
  // Pegar dados do body da requisição
  // Cliente envia: { nome: "Legolas", classe: "Arqueiro" }
  const { nome, classe } = req.body;
  
  // Validar dados
  if (!nome || !classe) {
    return res.status(400).json({ 
      error: 'Nome e classe são obrigatórios' 
    });
  }
  
  // Criar personagem
  const novoPersonagem = {
    id: `char_${Date.now()}`, // ID único baseado em timestamp
    nome,
    classe,
    nivel: 1,
    hp: 10,
    criadoEm: new Date()
  };
  
  // Salvar (exemplo - você implementaria isso)
  // salvarPersonagem(novoPersonagem);
  
  // Retornar personagem criado (status 201 = Created)
  res.status(201).json(novoPersonagem);
});

// ============================================
// ROTA PROTEGIDA COM JWT
// ============================================

// POST /api/personagens/secreto
// Apenas usuários autenticados podem acessar
app.post('/api/personagens/secreto', (req, res) => {
  // 1. Pegar token do header Authorization
  // Cliente envia: Authorization: Bearer eyJhbGc...
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  // 2. Remover "Bearer " do início
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // 3. Validar token
    const decoded = AuthService.verifyToken(token);
    // decoded = { userId: "123", username: "mestre", role: "master" }
    
    // 4. Verificar role (se necessário)
    if (decoded.role !== 'master') {
      return res.status(403).json({ error: 'Apenas mestres' });
    }
    
    // 5. Processar requisição
    const dados = req.body;
    
    // 6. Retornar resposta
    res.json({ 
      sucesso: true,
      userId: decoded.userId 
    });
    
  } catch (error) {
    // Token inválido ou expirado
    res.status(401).json({ error: 'Token inválido' });
  }
});

// ============================================
// ROTA COM QUERY PARAMS (GET)
// ============================================

// GET /api/personagens?nivel=10&classe=guerreiro
// Buscar personagens com filtros
app.get('/api/personagens/buscar', (req, res) => {
  // Pegar query params
  // Ex: /api/personagens/buscar?nivel=10&classe=guerreiro
  const { nivel, classe } = req.query;
  // req.query = { nivel: "10", classe: "guerreiro" }
  
  // Converter tipos (query params são sempre strings)
  const nivelNumero = nivel ? parseInt(nivel) : undefined;
  
  // Buscar com filtros (exemplo)
  let personagens = obterTodosPersonagens(); // Sua função
  
  if (nivelNumero) {
    personagens = personagens.filter(p => p.nivel >= nivelNumero);
  }
  
  if (classe) {
    personagens = personagens.filter(p => p.classe === classe);
  }
  
  res.json(personagens);
});
```

---

## Backend - Adicionar Evento WebSocket

```javascript
// server/src/index.js

// ============================================
// ESTRUTURA BÁSICA DO SOCKET
// ============================================

io.on('connection', (socket) => {
  // socket = conexão individual de um cliente
  // socket.data = dados anexados durante autenticação
  // Ex: socket.data.userId, socket.data.username, socket.data.role
  
  console.log('Novo cliente conectado:', socket.data.username);
  
  // ==========================================
  // EVENTO 1: ATAQUE DE PERSONAGEM
  // ==========================================
  
  socket.on('atacar-personagem', (data) => {
    // data = { atacanteId: "char_1", alvoId: "char_2", arma: "espada" }
    
    // 1. Pegar sessão do jogador
    const sessionId = socket.data.sessionId;
    if (!sessionId) {
      socket.emit('error', { message: 'Não está em uma sessão' });
      return;
    }
    
    // 2. Verificar permissão
    const temPermissao = SessionManager.hasPermission(
      sessionId, 
      socket.data.userId, 
      'canControlBattle'
    );
    
    if (!temPermissao) {
      socket.emit('error', { message: 'Sem permissão para atacar' });
      return;
    }
    
    // 3. Processar ataque
    const { atacanteId, alvoId, arma } = data;
    
    // Buscar personagens
    const session = SessionManager.getSession(sessionId);
    const atacante = session.characters.find(c => c.id === atacanteId);
    const alvo = session.characters.find(c => c.id === alvoId);
    
    if (!atacante || !alvo) {
      socket.emit('error', { message: 'Personagem não encontrado' });
      return;
    }
    
    // Rolar dado de ataque (d20 + modificador)
    const modificador = Math.floor((atacante.forca - 10) / 2);
    const rolagem = Math.floor(Math.random() * 20) + 1;
    const totalAtaque = rolagem + modificador;
    
    // Verificar se acertou
    const acertou = totalAtaque >= alvo.armadura;
    
    let dano = 0;
    if (acertou) {
      // Rolar dano da arma (1d8 + modificador)
      const danoDado = Math.floor(Math.random() * 8) + 1;
      dano = danoDado + modificador;
      
      // Aplicar dano
      alvo.hp = Math.max(0, alvo.hp - dano);
      
      // Atualizar no gerenciador
      SessionManager.updateCharacter(sessionId, alvo.id, { hp: alvo.hp });
    }
    
    // 4. Criar resultado
    const resultado = {
      atacante: atacante.nome,
      alvo: alvo.nome,
      rolagem,
      modificador,
      total: totalAtaque,
      acertou,
      dano,
      hpRestante: alvo.hp,
      timestamp: new Date()
    };
    
    // 5. Enviar para TODOS na sessão
    io.to(sessionId).emit('ataque-realizado', resultado);
    
    // 6. Log no servidor
    console.log(`${atacante.nome} atacou ${alvo.nome}: ${acertou ? 'Acertou!' : 'Errou!'}`);
  });
  
  // ==========================================
  // EVENTO 2: USAR HABILIDADE
  // ==========================================
  
  socket.on('usar-habilidade', (data) => {
    // data = { personagemId: "char_1", habilidadeId: "skill_fireball" }
    
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;
    
    const { personagemId, habilidadeId } = data;
    
    // Buscar personagem
    const session = SessionManager.getSession(sessionId);
    const personagem = session.characters.find(c => c.id === personagemId);
    
    if (!personagem) {
      socket.emit('error', { message: 'Personagem não encontrado' });
      return;
    }
    
    // Buscar habilidade
    const habilidade = personagem.habilidades?.find(h => h.id === habilidadeId);
    
    if (!habilidade) {
      socket.emit('error', { message: 'Habilidade não encontrada' });
      return;
    }
    
    // Verificar recursos (mana, energia, etc)
    if (personagem.mana < habilidade.custo) {
      socket.emit('error', { message: 'Mana insuficiente' });
      return;
    }
    
    // Consumir mana
    personagem.mana -= habilidade.custo;
    SessionManager.updateCharacter(sessionId, personagem.id, { 
      mana: personagem.mana 
    });
    
    // Aplicar efeito da habilidade
    const resultado = {
      personagem: personagem.nome,
      habilidade: habilidade.nome,
      efeito: habilidade.efeito,
      timestamp: new Date()
    };
    
    // Enviar para todos
    io.to(sessionId).emit('habilidade-usada', resultado);
  });
  
  // ==========================================
  // EVENTO 3: MARCAR POSIÇÃO NO MAPA
  // ==========================================
  
  socket.on('marcar-posicao', (data) => {
    // data = { x: 10, y: 15, tipo: "inimigo", icone: "👹" }
    
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;
    
    // Verificar permissão
    if (!SessionManager.hasPermission(sessionId, socket.data.userId, 'canEditMap')) {
      socket.emit('error', { message: 'Sem permissão para editar mapa' });
      return;
    }
    
    const { x, y, tipo, icone } = data;
    
    // Criar marcador
    const marcador = {
      id: `marker_${Date.now()}`,
      x,
      y,
      tipo,
      icone,
      criadoPor: socket.data.username,
      criadoEm: new Date()
    };
    
    // Salvar marcador no mapa da sessão
    const session = SessionManager.getSession(sessionId);
    if (!session.mapa) session.mapa = { marcadores: [] };
    session.mapa.marcadores.push(marcador);
    
    // Enviar para todos
    io.to(sessionId).emit('marcador-adicionado', marcador);
  });
  
  // ==========================================
  // DESCONEXÃO
  // ==========================================
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectou:', socket.data.username);
    
    // Remover da sessão
    const sessionId = socket.data.sessionId;
    if (sessionId) {
      SessionManager.removePlayer(sessionId, socket.data.userId);
      
      // Notificar outros
      socket.to(sessionId).emit('player-left', {
        userId: socket.data.userId,
        username: socket.data.username
      });
    }
  });
});
```

---

## Frontend - Criar Hook Customizado

```typescript
// client/src/hooks/useFetch.ts

import { useState, useEffect } from 'react';

/**
 * Hook customizado para fazer requisições HTTP
 * 
 * Uso:
 * const { data, loading, error, refetch } = useFetch('/api/personagens');
 */

interface UseFetchResult<T> {
  data: T | null;      // Dados retornados
  loading: boolean;    // Está carregando?
  error: string | null; // Mensagem de erro
  refetch: () => void; // Função para recarregar
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  // ======================================
  // ESTADOS
  // ======================================
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  
  // ======================================
  // EFEITO - EXECUTAR FETCH
  // ======================================
  
  useEffect(() => {
    // Função assíncrona para buscar dados
    const fetchData = async () => {
      try {
        // 1. Resetar estados
        setLoading(true);
        setError(null);
        
        // 2. Fazer requisição
        const response = await fetch(`http://localhost:3001${url}`);
        
        // 3. Verificar se foi bem sucedido
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        // 4. Converter para JSON
        const json = await response.json();
        
        // 5. Atualizar estado com dados
        setData(json);
        
      } catch (err: any) {
        // 6. Capturar erro
        console.error('Erro ao buscar dados:', err);
        setError(err.message);
        
      } finally {
        // 7. Sempre executado (sucesso ou erro)
        setLoading(false);
      }
    };
    
    // Executar função
    fetchData();
    
  }, [url, refetchTrigger]); // Re-executar quando URL ou trigger mudar
  
  // ======================================
  // FUNÇÃO REFETCH
  // ======================================
  
  const refetch = () => {
    // Incrementar trigger força re-execução do useEffect
    setRefetchTrigger(prev => prev + 1);
  };
  
  // ======================================
  // RETORNAR
  // ======================================
  
  return { data, loading, error, refetch };
}

// ======================================
// EXEMPLO DE USO
// ======================================

/*
import { useFetch } from './hooks/useFetch';

function PersonagensLista() {
  // Buscar lista de personagens
  const { data, loading, error, refetch } = useFetch<Personagem[]>('/api/personagens');
  
  // Mostrar loading
  if (loading) return <p>Carregando...</p>;
  
  // Mostrar erro
  if (error) return <p>Erro: {error}</p>;
  
  // Mostrar dados
  return (
    <div>
      <button onClick={refetch}>Recarregar</button>
      <ul>
        {data?.map(personagem => (
          <li key={personagem.id}>{personagem.nome}</li>
        ))}
      </ul>
    </div>
  );
}
*/
```

---

## Frontend - Formulário com Estado

```typescript
// client/src/components/FormularioCriarPersonagem.tsx

import React, { useState, FormEvent } from 'react';

interface Personagem {
  nome: string;
  raca: string;
  classe: string;
  nivel: number;
}

interface FormularioCriarPersonagemProps {
  onCriar: (personagem: Personagem) => void;
  onCancelar: () => void;
}

const FormularioCriarPersonagem: React.FC<FormularioCriarPersonagemProps> = ({ 
  onCriar, 
  onCancelar 
}) => {
  // ======================================
  // ESTADOS - Um para cada campo
  // ======================================
  
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('humano');
  const [classe, setClasse] = useState('guerreiro');
  const [nivel, setNivel] = useState(1);
  
  // Estados auxiliares
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [enviando, setEnviando] = useState(false);
  
  // ======================================
  // VALIDAÇÃO
  // ======================================
  
  const validar = (): boolean => {
    const novosErros: { [key: string]: string } = {};
    
    // Validar nome
    if (!nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (nome.length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
    } else if (nome.length > 30) {
      novosErros.nome = 'Nome deve ter no máximo 30 caracteres';
    }
    
    // Validar nível
    if (nivel < 1 || nivel > 20) {
      novosErros.nivel = 'Nível deve estar entre 1 e 20';
    }
    
    // Atualizar estado de erros
    setErros(novosErros);
    
    // Retornar true se não houver erros
    return Object.keys(novosErros).length === 0;
  };
  
  // ======================================
  // SUBMIT DO FORMULÁRIO
  // ======================================
  
  const handleSubmit = async (e: FormEvent) => {
    // Prevenir reload da página
    e.preventDefault();
    
    // Validar campos
    if (!validar()) {
      return; // Parar se houver erros
    }
    
    // Desabilitar botão enquanto envia
    setEnviando(true);
    
    try {
      // Criar objeto personagem
      const novoPersonagem: Personagem = {
        nome: nome.trim(),
        raca,
        classe,
        nivel
      };
      
      // Chamar função passada por props
      await onCriar(novoPersonagem);
      
      // Limpar formulário após sucesso
      setNome('');
      setRaca('humano');
      setClasse('guerreiro');
      setNivel(1);
      setErros({});
      
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      setErros({ geral: 'Erro ao criar personagem. Tente novamente.' });
      
    } finally {
      // Re-habilitar botão
      setEnviando(false);
    }
  };
  
  // ======================================
  // RENDERIZAÇÃO
  // ======================================
  
  return (
    <form onSubmit={handleSubmit} className="formulario-personagem">
      <h2>Criar Novo Personagem</h2>
      
      {/* Erro geral */}
      {erros.geral && (
        <div className="erro-geral">{erros.geral}</div>
      )}
      
      {/* Campo: Nome */}
      <div className="campo">
        <label htmlFor="nome">Nome *</label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome do personagem"
          disabled={enviando}
          className={erros.nome ? 'erro' : ''}
        />
        {erros.nome && <span className="mensagem-erro">{erros.nome}</span>}
      </div>
      
      {/* Campo: Raça */}
      <div className="campo">
        <label htmlFor="raca">Raça *</label>
        <select
          id="raca"
          value={raca}
          onChange={(e) => setRaca(e.target.value)}
          disabled={enviando}
        >
          <option value="humano">Humano</option>
          <option value="elfo">Elfo</option>
          <option value="anao">Anão</option>
          <option value="halfling">Halfling</option>
        </select>
      </div>
      
      {/* Campo: Classe */}
      <div className="campo">
        <label htmlFor="classe">Classe *</label>
        <select
          id="classe"
          value={classe}
          onChange={(e) => setClasse(e.target.value)}
          disabled={enviando}
        >
          <option value="guerreiro">Guerreiro</option>
          <option value="mago">Mago</option>
          <option value="ladino">Ladino</option>
          <option value="clerigo">Clérigo</option>
        </select>
      </div>
      
      {/* Campo: Nível */}
      <div className="campo">
        <label htmlFor="nivel">Nível *</label>
        <input
          id="nivel"
          type="number"
          min="1"
          max="20"
          value={nivel}
          onChange={(e) => setNivel(parseInt(e.target.value))}
          disabled={enviando}
          className={erros.nivel ? 'erro' : ''}
        />
        {erros.nivel && <span className="mensagem-erro">{erros.nivel}</span>}
      </div>
      
      {/* Botões */}
      <div className="botoes">
        <button 
          type="button" 
          onClick={onCancelar}
          disabled={enviando}
          className="btn-secundario"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          disabled={enviando}
          className="btn-primario"
        >
          {enviando ? 'Criando...' : 'Criar Personagem'}
        </button>
      </div>
    </form>
  );
};

export default FormularioCriarPersonagem;
```

Continua no próximo arquivo...
