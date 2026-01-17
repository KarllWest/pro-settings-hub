/**
 * Підтримувані ігрові дисципліни.
 * Додайте сюди нову гру, щоб розширити підтримку по всьому додатку.
 */
export type GameType = 'cs2' | 'valorant' | 'dota2' | 'pubg' | 'fortnite';

/**
 * Організація (команда), до якої належить гравець.
 */
export interface Team {
  id: number;
  name: string;
  logo_url: string;
  game: GameType;
  created_at?: string;
}

/**
 * Профіль професійного гравця.
 */
export interface Player {
  id: number;
  game: GameType;
  nickname: string;
  real_name: string;
  avatar_url: string;
  team_id: number | null;
  
  // Реляція з таблицею teams (з'являється після .select('*, teams(*)'))
  teams?: Team | null;

  // Соціальні мережі
  hltv_url?: string;
  faceit_url?: string;
  instagram_url?: string;
  dotabuff_url?: string;
  liquipedia_url?: string;

  /** * Налаштування гравця. 
   * При запиті через Supabase зазвичай повертається як масив.
   */
  setups?: Setup[]; 
}

/**
 * Технічні налаштування (Config/Hardware).
 * Використовує Record для гнучких JSONB полів з бази даних.
 */
export interface Setup {
  id: number;
  player_id: number;
  
  // --- Основні ігрові параметри ---
  mouse: string;
  dpi: number;
  /** В CS2/Valorant - чутливість, у Dota 2 - Camera Speed */
  sensitivity: number; 
  zoom_sensitivity: number;
  resolution: string;
  aspect_ratio: string;
  scaling_mode: string;
  hertz: string;
  crosshair_code: string;
  launch_options: string;
  
  // --- JSONB Поля (Налаштування всередині гри) ---
  /** Налаштування якості графіки (Shadows, Textures тощо) */
  graphics_settings: Record<string, string | number | boolean>;
  /** Позиція моделі зброї (тільки для шутерів) */
  viewmodel_settings: {
    fov?: number;
    offset_x?: number;
    offset_y?: number;
    offset_z?: number;
    presetpos?: number;
  } | Record<string, any>;
  /** Основні клавіші управління */
  keybinds: Record<string, string>;
  /** Складні або кастомні команди (Jumpthrow тощо) */
  custom_binds: Array<{ name: string; key: string }>;
  /** Додаткові консольні команди */
  config_commands: Array<{ command: string; value: string }>;
  
  // --- Hardware (Залізо) ---
  /** Моделі девайсів та посилання на магазини/огляди */
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
  
  /** Характеристики системного блоку */
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

  /** Фізичні налаштування монітора (Brightness, Contrast, Black eQualizer) */
  monitor_settings: Record<string, string | number>;
  /** Налаштування інтерфейсу та мінікарти (особливо важливо для Dota 2) */
  hud_radar_settings: Record<string, string | number>;
}