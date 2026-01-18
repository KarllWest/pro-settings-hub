/**
 * Підтримувані ігрові дисципліни.
 */
export type GameType = 'cs2' | 'valorant' | 'dota2' | 'pubg' | 'fortnite';

/**
 * Організація (команда), до якої належить гравець.
 * id може бути number (з бази) або string (якщо це заглушка/fallback).
 */
export interface Team {
  id: number | string;
  name: string;
  logo_url: string;
  game: GameType;
  created_at?: string;
}

/**
 * Профіль професійного гравця.
 */
export interface Player {
  id: number | string;
  game: GameType;
  nickname: string;
  real_name: string;
  avatar_url: string;
  team_id: number | null;
  
  // Реляція з таблицею teams
  teams?: Team | null;

  // Соціальні мережі
  hltv_url?: string;
  faceit_url?: string;
  instagram_url?: string;
  dotabuff_url?: string;
  liquipedia_url?: string;

  /** * Налаштування гравця. 
   * При запиті через Supabase повертається як масив (зазвичай 1 елемент).
   */
  setups?: Setup[]; 
}

/**
 * Технічні налаштування (Config/Hardware).
 */
export interface Setup {
  id: number;
  player_id: number;
  
  // --- Основні ігрові параметри ---
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
  
  // --- JSONB Поля (Налаштування всередині гри) ---
  graphics_settings: Record<string, string | number | boolean>;
  
  viewmodel_settings: {
    fov?: number;
    offset_x?: number;
    offset_y?: number;
    offset_z?: number;
    presetpos?: number;
  } | Record<string, any>;

  keybinds: Record<string, string>;
  custom_binds: Array<{ name: string; key: string }>;
  config_commands: Array<{ command: string; value: string }>;
  
  // --- Hardware (Залізо) ---
  gear: {
    monitor?: string;
    monitor_link?: string;
    mouse?: string;
    mouse_link?: string;
    keyboard?: string;
    keyboard_link?: string;
    headset?: string;
    headset_link?: string;
    mousepad?: string;
    mousepad_link?: string;
    earphones?: string;
    earphones_link?: string;
    chair?: string;
    chair_link?: string;
  };
  
  pc_specs: {
    cpu?: string;
    gpu?: string;
    ram?: string;
    motherboard?: string;
    case?: string;
    cooling?: string;
    ssd?: string;
    psu?: string;
  };

  monitor_settings: Record<string, string | number>;
  hud_radar_settings: Record<string, string | number>;
}

/**
 * Профіль звичайного користувача (для авторизації та редагування свого профілю).
 */
export interface UserProfile {
  id: string; // UUID
  nickname: string;
  avatar_url?: string;
  steam_url?: string;
  updated_at?: string;
  
  // User Gear Info (спрощена версія)
  mouse_model?: string;
  mouse_hz?: string;
  mouse_dpi?: number;
  mouse_sens?: number;
  monitor_hz?: string;
  resolution?: string;
  
  // Права доступу
  is_admin?: boolean;
}