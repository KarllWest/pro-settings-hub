export interface Team {
  id: number;
  name: string;
  logo_url: string;
}

export interface Player {
  id: number;
  game: 'cs2' | 'valorant' | 'dota2'; // Важливо!
  nickname: string;
  real_name: string;
  avatar_url: string;
  team_id: number;
  teams?: Team;
  
  // Соцмережі
  hltv_url?: string;
  faceit_url?: string;
  instagram_url?: string;
  dotabuff_url?: string;
  liquipedia_url?: string;

  setups?: Setup[];
}

export interface Setup {
  id: number;
  player_id: number;
  mouse: string;
  dpi: number;
  sensitivity: number;
  zoom_sensitivity: number;
  resolution: string;
  aspect_ratio: string;
  scaling_mode: string;
  hertz: string;
  crosshair_code: string;
  launch_options: string;
  
  graphics_settings: any;
  viewmodel_settings: any;
  keybinds: any;
  custom_binds: any[];
  config_commands: any[];
  gear: any;
  pc_specs: any;
  monitor_settings: any;
  hud_radar_settings: any;
}