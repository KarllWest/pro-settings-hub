export interface Team {
  id: number;
  name: string;
  logo_url: string;
  region: string;
}

export interface Keybinds {
  jump: string;
  crouch: string;
  walk: string;
  primary_weapon: string;
  secondary_weapon: string;
  knife: string;
  flashbang: string;
  smoke_grenade: string;
  molotov: string;
  he_grenade: string;
}

export interface Setup {
  id: number;
  player_id: number;
  mouse: string;
  dpi: number;
  sensitivity: number;
  resolution: string;
  hertz: string;
  aspect_ratio: string;
  scaling_mode: string;
  crosshair_code: string;
  launch_options: string;
  custom_binds: CustomBind[];
  zoom_sensitivity: number;
  
  viewmodel_settings: {
    fov: number;
    offset_x: number;
    offset_y: number;
    offset_z: number;
    presetpos: number;
  };

  graphics_settings: {
    boost_player_contrast: string;
    model_texture_detail: string;
    shader_detail: string;
    particle_detail: string;
    texture_filtering_mode: string;
    ambient_occlusion: string;
    high_dynamic_range: string;
    fidelity_fx: string;
    nvidia_reflex: string;
    global_shadow_quality: string;
  };

  keybinds: Keybinds;
}

export interface Player {
  id: number;
  nickname: string;
  real_name: string;
  avatar_url: string;
  hltv_url: string | null;
  faceit_url: string | null;
  instagram_url: string | null;
  team_id: number | null;
  teams?: Team;
  setups: Setup[]; // Supabase може повертати масив, навіть якщо там 1 елемент
}

export interface CustomBind {
  name: string;
  key: string;
}