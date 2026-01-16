export interface Team {
  id: number;
  name: string;
  logo_url: string;
  region: string;
}

export interface Setup {
  id: number;
  mouse: string;
  dpi: number;
  sensitivity: number;
  resolution: string;
  crosshair_code: string;
  // 👇 НОВІ ПОЛЯ
  hertz: string;
  aspect_ratio: string;
  scaling_mode: string;
}

export interface Player {
  id: number;
  nickname: string;
  real_name: string;
  avatar_url: string;
  hltv_url?: string;
  faceit_url?: string;
  instagram_url?: string;
  teams: {
    id: number;
    name: string;
    logo_url: string;
  } | null;
  setups: Setup[]; 
}