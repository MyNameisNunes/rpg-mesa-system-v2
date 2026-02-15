import { SystemRules } from '../types';

// D&D 5e (já existente - mantido)
export const DND5E_RULES: SystemRules = {
  name: 'Dungeons & Dragons 5ª Edição',
  type: 'DND5E',
  description: 'Sistema clássico de fantasia medieval com d20',
  attributes: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
  hpFormula: 'constitution_modifier + class_hit_die',
  acFormula: '10 + dexterity_modifier + armor_bonus',
  initiativeFormula: 'dexterity_modifier + d20',
  maxLevel: 20,
  experienceTable: [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000],
  classes: [
    { id: 'fighter', name: 'Guerreiro', description: 'Mestre em combate', hitDie: 'd10', primaryAttributes: ['strength'], proficiencies: [], startingEquipment: [] },
    { id: 'wizard', name: 'Mago', description: 'Usuário de magia arcana', hitDie: 'd6', primaryAttributes: ['intelligence'], proficiencies: [], startingEquipment: [] },
    { id: 'rogue', name: 'Ladino', description: 'Especialista em furtividade', hitDie: 'd8', primaryAttributes: ['dexterity'], proficiencies: [], startingEquipment: [] },
    { id: 'cleric', name: 'Clérigo', description: 'Campeão divino', hitDie: 'd8', primaryAttributes: ['wisdom'], proficiencies: [], startingEquipment: [] }
  ],
  races: [
    { id: 'human', name: 'Humano', description: 'Versátil', attributeModifiers: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 }, traits: [], speed: 30 },
    { id: 'elf', name: 'Elfo', description: 'Gracioso e mágico', attributeModifiers: { dexterity: 2 }, traits: [], speed: 30 },
    { id: 'dwarf', name: 'Anão', description: 'Resistente', attributeModifiers: { constitution: 2 }, traits: [], speed: 25 }
  ],
  diceTypes: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']
};

// Pathfinder
export const PATHFINDER_RULES: SystemRules = {
  name: 'Pathfinder 2ª Edição',
  type: 'PATHFINDER',
  description: 'Evolução do d20 system com mais opções táticas',
  attributes: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
  hpFormula: 'constitution + class_hp + ancestry_hp',
  acFormula: '10 + dexterity_modifier + armor_bonus + proficiency',
  initiativeFormula: 'perception + d20',
  maxLevel: 20,
  experienceTable: [0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000, 55000, 66000, 78000, 91000, 105000, 120000, 136000, 153000, 171000, 190000],
  classes: [
    { id: 'fighter', name: 'Guerreiro', description: 'Versatilidade em combate', hitDie: 'd10', primaryAttributes: ['strength', 'dexterity'], proficiencies: [], startingEquipment: [] },
    { id: 'wizard', name: 'Mago', description: 'Magia preparada arcana', hitDie: 'd6', primaryAttributes: ['intelligence'], proficiencies: [], startingEquipment: [] },
    { id: 'ranger', name: 'Patrulheiro', description: 'Caçador e rastreador', hitDie: 'd10', primaryAttributes: ['dexterity', 'wisdom'], proficiencies: [], startingEquipment: [] },
    { id: 'alchemist', name: 'Alquimista', description: 'Criador de poções e bombas', hitDie: 'd8', primaryAttributes: ['intelligence'], proficiencies: [], startingEquipment: [] }
  ],
  races: [
    { id: 'human', name: 'Humano', description: 'Adaptável', attributeModifiers: {}, traits: ['Versátil'], speed: 25 },
    { id: 'elf', name: 'Elfo', description: 'Longevos e mágicos', attributeModifiers: { dexterity: 2, intelligence: 2, constitution: -2 }, traits: ['Visão na Penumbra'], speed: 30 },
    { id: 'dwarf', name: 'Anão', description: 'Robustos', attributeModifiers: { constitution: 2, wisdom: 2, charisma: -2 }, traits: ['Visão no Escuro'], speed: 20 }
  ],
  diceTypes: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20']
};

// Chamado de Cthulhu
export const CALL_OF_CTHULHU_RULES: SystemRules = {
  name: 'Chamado de Cthulhu 7ª Edição',
  type: 'CALL_OF_CTHULHU',
  description: 'Horror investigativo lovecraftiano',
  attributes: ['strength', 'constitution', 'size', 'dexterity', 'appearance', 'intelligence', 'power', 'education'],
  hpFormula: '(constitution + size) / 10',
  acFormula: 'dexterity / 2',
  initiativeFormula: 'dexterity',
  maxLevel: 1,
  experienceTable: [0],
  classes: [
    { id: 'investigator', name: 'Investigador', description: 'Detetive de mistérios', hitDie: 'd6', primaryAttributes: ['intelligence'], proficiencies: [], startingEquipment: [] },
    { id: 'professor', name: 'Professor', description: 'Acadêmico estudioso', hitDie: 'd6', primaryAttributes: ['education', 'intelligence'], proficiencies: [], startingEquipment: [] },
    { id: 'journalist', name: 'Jornalista', description: 'Repórter investigativo', hitDie: 'd6', primaryAttributes: ['intelligence', 'appearance'], proficiencies: [], startingEquipment: [] },
    { id: 'occultist', name: 'Ocultista', description: 'Estudioso do paranormal', hitDie: 'd6', primaryAttributes: ['power', 'intelligence'], proficiencies: [], startingEquipment: [] }
  ],
  races: [
    { id: 'human', name: 'Humano', description: 'Anos 1920', attributeModifiers: {}, traits: [], speed: 30 }
  ],
  diceTypes: ['d4', 'd6', 'd8', 'd10', 'd100']
};

// Tormenta20
export const TORMENTA20_RULES: SystemRules = {
  name: 'Tormenta20',
  type: 'TORMENTA20',
  description: 'O maior cenário de RPG brasileiro',
  attributes: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
  hpFormula: 'constitution + class_hp',
  acFormula: '10 + dexterity_modifier + armor',
  initiativeFormula: 'dexterity_modifier + d20',
  maxLevel: 20,
  experienceTable: [0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000, 55000, 66000, 78000, 91000, 105000, 120000, 136000, 153000, 171000, 190000],
  classes: [
    { id: 'guerreiro', name: 'Guerreiro', description: 'Combatente versátil', hitDie: 'd10', primaryAttributes: ['strength'], proficiencies: [], startingEquipment: [] },
    { id: 'arcanista', name: 'Arcanista', description: 'Mago estudioso', hitDie: 'd6', primaryAttributes: ['intelligence'], proficiencies: [], startingEquipment: [] },
    { id: 'clerigo', name: 'Clérigo', description: 'Servo dos deuses', hitDie: 'd8', primaryAttributes: ['wisdom'], proficiencies: [], startingEquipment: [] },
    { id: 'ladino', name: 'Ladino', description: 'Especialista em perícias', hitDie: 'd8', primaryAttributes: ['dexterity'], proficiencies: [], startingEquipment: [] }
  ],
  races: [
    { id: 'humano', name: 'Humano', description: 'Versáteis', attributeModifiers: {}, traits: ['Versátil'], speed: 9 },
    { id: 'anao', name: 'Anão', description: 'Resistentes', attributeModifiers: { constitution: 2, wisdom: 1, dexterity: -1 }, traits: ['Visão no Escuro'], speed: 6 },
    { id: 'elfo', name: 'Elfo', description: 'Graciosos', attributeModifiers: { dexterity: 2, intelligence: 1, constitution: -1 }, traits: ['Visão na Penumbra'], speed: 9 },
    { id: 'qareen', name: 'Qareen', description: 'Gênios do deserto', attributeModifiers: { charisma: 2, intelligence: 1, wisdom: -1 }, traits: ['Herança Genasi'], speed: 9 }
  ],
  diceTypes: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20']
};

// Vampiro: A Máscara
export const VAMPIRO_MASCARA_RULES: SystemRules = {
  name: 'Vampiro: A Máscara 5ª Edição',
  type: 'VAMPIRO_MASCARA',
  description: 'Horror pessoal e político vampírico',
  attributes: ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'composure', 'intelligence', 'wits', 'resolve'],
  hpFormula: 'stamina + 3',
  acFormula: 'dexterity + athletics',
  initiativeFormula: 'wits + composure',
  maxLevel: 1,
  experienceTable: [0],
  classes: [
    { id: 'brujah', name: 'Brujah', description: 'Rebeldes apaixonados', hitDie: 'd10', primaryAttributes: ['strength', 'charisma'], proficiencies: [], startingEquipment: [] },
    { id: 'toreador', name: 'Toreador', description: 'Artistas sedentos', hitDie: 'd8', primaryAttributes: ['dexterity', 'charisma'], proficiencies: [], startingEquipment: [] },
    { id: 'tremere', name: 'Tremere', description: 'Feiticeiros de sangue', hitDie: 'd8', primaryAttributes: ['intelligence', 'wits'], proficiencies: [], startingEquipment: [] },
    { id: 'ventrue', name: 'Ventrue', description: 'Líderes nobres', hitDie: 'd10', primaryAttributes: ['charisma', 'manipulation'], proficiencies: [], startingEquipment: [] }
  ],
  races: [
    { id: 'vampire', name: 'Vampiro', description: 'Morto-vivo imortal', attributeModifiers: {}, traits: ['Sede de Sangue'], speed: 30 }
  ],
  diceTypes: ['d10']
};

// GURPS
export const GURPS_RULES: SystemRules = {
  name: 'GURPS 4ª Edição',
  type: 'GURPS',
  description: 'Sistema Genérico Universal de RPG',
  attributes: ['strength', 'dexterity', 'intelligence', 'health'],
  hpFormula: 'strength',
  acFormula: 'dexterity',
  initiativeFormula: 'dexterity + d6',
  maxLevel: 1,
  experienceTable: [0],
  classes: [
    { id: 'warrior', name: 'Guerreiro', description: 'Combatente treinado', hitDie: 'd6', primaryAttributes: ['strength', 'dexterity'], proficiencies: [], startingEquipment: [] },
    { id: 'scholar', name: 'Erudito', description: 'Intelectual', hitDie: 'd6', primaryAttributes: ['intelligence'], proficiencies: [], startingEquipment: [] },
    { id: 'rogue', name: 'Malandro', description: 'Furtivo e ágil', hitDie: 'd6', primaryAttributes: ['dexterity', 'intelligence'], proficiencies: [], startingEquipment: [] },
    { id: 'mage', name: 'Mago', description: 'Usuário de magia', hitDie: 'd6', primaryAttributes: ['intelligence'], proficiencies: [], startingEquipment: [] }
  ],
  races: [
    { id: 'human', name: 'Humano', description: 'Base genérica', attributeModifiers: {}, traits: [], speed: 30 }
  ],
  diceTypes: ['d6']
};

// 3D&T (Defensores de Tóquio 3ª Edição)
export const THREEDANDT_RULES: SystemRules = {
  name: '3D&T Alpha',
  type: 'THREEDANDT',
  description: 'Sistema brasileiro focado em anime e iniciantes',
  attributes: ['strength', 'dexterity', 'constitution', 'intelligence', 'willpower'],
  hpFormula: 'constitution * 5',
  acFormula: 'dexterity',
  initiativeFormula: 'dexterity + d6',
  maxLevel: 1,
  experienceTable: [0],
  classes: [
    { id: 'lutador', name: 'Lutador', description: 'Mestre em artes marciais', hitDie: 'd6', primaryAttributes: ['strength', 'dexterity'], proficiencies: [], startingEquipment: [] },
    { id: 'mago', name: 'Mago', description: 'Conjurador de magias', hitDie: 'd6', primaryAttributes: ['intelligence', 'willpower'], proficiencies: [], startingEquipment: [] },
    { id: 'ninja', name: 'Ninja', description: 'Espião furtivo', hitDie: 'd6', primaryAttributes: ['dexterity'], proficiencies: [], startingEquipment: [] },
    { id: 'paladino', name: 'Paladino', description: 'Guerreiro sagrado', hitDie: 'd6', primaryAttributes: ['strength', 'willpower'], proficiencies: [], startingEquipment: [] }
  ],
  races: [
    { id: 'humano', name: 'Humano', description: 'Versátil', attributeModifiers: {}, traits: [], speed: 30 },
    { id: 'youkai', name: 'Youkai', description: 'Criatura sobrenatural', attributeModifiers: { strength: 1, dexterity: 1 }, traits: ['Transformação'], speed: 30 },
    { id: 'meio_youkai', name: 'Meio-Youkai', description: 'Híbrido', attributeModifiers: { dexterity: 1 }, traits: ['Herança Mista'], speed: 30 }
  ],
  diceTypes: ['d6']
};

// Ordem Paranormal (já existente)
export const PARANORMAL_RULES: SystemRules = {
  name: 'Ordem Paranormal RPG',
  type: 'PARANORMAL',
  description: 'Horror investigativo brasileiro',
  attributes: ['strength', 'dexterity', 'constitution', 'intelligence', 'presence'],
  hpFormula: 'constitution + class_base_hp',
  acFormula: '10 + dexterity + defense_bonus',
  initiativeFormula: 'dexterity + d20',
  maxLevel: 20,
  experienceTable: [0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000, 55000, 66000, 78000, 91000, 105000, 120000, 136000, 153000, 171000, 190000],
  classes: [
    { id: 'combatente', name: 'Combatente', description: 'Especialista em combate físico', hitDie: 'd8', primaryAttributes: ['strength'], proficiencies: [], startingEquipment: [] },
    { id: 'ocultista', name: 'Ocultista', description: 'Conhecedor do paranormal', hitDie: 'd6', primaryAttributes: ['intelligence', 'presence'], proficiencies: [], startingEquipment: [] },
    { id: 'especialista', name: 'Especialista', description: 'Versátil e habilidoso', hitDie: 'd6', primaryAttributes: ['intelligence'], proficiencies: [], startingEquipment: [] }
  ],
  races: [
    { id: 'mundano', name: 'Mundano', description: 'Humano comum', attributeModifiers: { constitution: 1 }, traits: [], speed: 9 },
    { id: 'marcado', name: 'Marcado', description: 'Exposto ao Outro Lado', attributeModifiers: { presence: 2, constitution: -1 }, traits: ['Sensibilidade Paranormal'], speed: 9 }
  ],
  diceTypes: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20']
};

// Função para obter regras do sistema
export function getSystemRules(systemType: string): SystemRules {
  const systems: { [key: string]: SystemRules } = {
    DND5E: DND5E_RULES,
    PATHFINDER: PATHFINDER_RULES,
    CALL_OF_CTHULHU: CALL_OF_CTHULHU_RULES,
    TORMENTA20: TORMENTA20_RULES,
    VAMPIRO_MASCARA: VAMPIRO_MASCARA_RULES,
    GURPS: GURPS_RULES,
    THREEDANDT: THREEDANDT_RULES,
    PARANORMAL: PARANORMAL_RULES
  };

  return systems[systemType] || DND5E_RULES;
}

// Lista de todos os sistemas disponíveis
export const ALL_SYSTEMS = [
  { type: 'DND5E', name: 'D&D 5ª Edição', icon: '🐉', category: 'Fantasia' },
  { type: 'PATHFINDER', name: 'Pathfinder 2e', icon: '⚔️', category: 'Fantasia' },
  { type: 'TORMENTA20', name: 'Tormenta20', icon: '🇧🇷', category: 'Fantasia' },
  { type: 'CALL_OF_CTHULHU', name: 'Chamado de Cthulhu', icon: '🐙', category: 'Horror' },
  { type: 'PARANORMAL', name: 'Ordem Paranormal', icon: '👁️', category: 'Horror' },
  { type: 'VAMPIRO_MASCARA', name: 'Vampiro: A Máscara', icon: '🧛', category: 'Horror' },
  { type: 'GURPS', name: 'GURPS', icon: '🌐', category: 'Genérico' },
  { type: 'THREEDANDT', name: '3D&T Alpha', icon: '⭐', category: 'Anime' }
];
