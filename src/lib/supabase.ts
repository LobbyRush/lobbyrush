import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lobby {
  id: string;
  rank: string;
  game_mode: string;
  lobby_code: string;
  description: string;
  players_needed: number;
  created_at: string;
  expires_at: string;
}

export const RANKS = [
  'Demir 1', 'Demir 2', 'Demir 3',
  'Bronz 1', 'Bronz 2', 'Bronz 3',
  'Gümüş 1', 'Gümüş 2', 'Gümüş 3',
  'Altın 1', 'Altın 2', 'Altın 3',
  'Platin 1', 'Platin 2', 'Platin 3',
  'Elmas 1', 'Elmas 2', 'Elmas 3',
  'Yücelik 1', 'Yücelik 2', 'Yücelik 3',
  'Ölümsüzlük 1', 'Ölümsüzlük 2', 'Ölümsüzlük 3',
  'Radyant',
];

export const GAME_MODES = [
  'Rekabetçi',
  'Derecesiz',
  'Spike Hücum',
  'Ölüm Kalım Savaşı',
  'Tırmanış',
  'Takımlı Ölüm Kalım',
  'Tam Gaz',
  'Premier',
];

export const RANK_COLORS: Record<string, string> = {
  'Demir': '#8B8B8B',
  'Bronz': '#CD7F32',
  'Dümüş': '#C0C0C0',
  'Altın': '#FFD700',
  'Platin': '#00CED1',
  'Elmas': '#B9F2FF',
  'Yücelik': '#00FF7F',
  'Ölümsüzlük': '#FF4655',
  'Radyant': '#FFFFA0',
};

export function getRankColor(rank: string): string {
  const tier = Object.keys(RANK_COLORS).find(t => rank.startsWith(t));
  return tier ? RANK_COLORS[tier] : '#ffffff';
}

export function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}
