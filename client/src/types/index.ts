export type SystemType = 
  | 'DND5E' 
  | 'PATHFINDER' 
  | 'CALL_OF_CTHULHU' 
  | 'TORMENTA20' 
  | 'VAMPIRO_MASCARA' 
  | 'GURPS' 
  | 'THREEDANDT' 
  | 'PARANORMAL'
  | 'CUSTOM';

export interface SystemRules {
  name: string;
  type: SystemType;
  description: string;
  attributes: string[];
  hpFormula: string;
  acFormula: string;
  initiativeFormula: string;
  maxLevel: number;
  experienceTable: number[];
  classes: RPGClass[];
  races: RPGRace[];
  diceTypes: string[];
}

export interface RPGClass {
  id: string;
  name: string;
  description: string;
  hitDie: string;
  primaryAttributes: string[];
  proficiencies: string[];
  startingEquipment: string[];
}

export interface RPGRace {
  id: string;
  name: string;
  description: string;
  attributeModifiers: any;
  traits: string[];
  speed: number;
}

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

export interface User {
  id: string;
  username: string;
  role: 'master' | 'player';
}

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  systemType: SystemType;
  ownerId: string;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'action' | 'system';
}

export interface DiceRoll {
  id: string;
  timestamp: Date;
  rollerId: string;
  rollerName: string;
  diceNotation: string;
  result: number;
  rolls: number[];
  modifier: number;
  reason: string;
  visibility: 'public' | 'gm-only';
}
