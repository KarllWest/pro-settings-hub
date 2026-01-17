import { createClient } from '@supabase/supabase-js';

/**
 * Отримання змінних середовища через import.meta.env (стандарт Vite).
 * Переконайся, що файли .env або .env.local містять ці ключі.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Валідація наявності ключів для запобігання помилок "undefined" у запитах
if (!supabaseUrl || !supabaseKey) {
  const missing = !supabaseUrl ? 'VITE_SUPABASE_URL' : 'VITE_SUPABASE_ANON_KEY';
  console.error(`[Supabase Error]: Missing environment variable: ${missing}`);
  throw new Error(`Critical Error: Supabase ${missing} is not defined.`);
}

/**
 * Створення єдиного інстансу клієнта Supabase для всього додатку.
 * Використовується для запитів до таблиць 'players', 'teams' та 'setups'.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // Зберігати сесію адміна при перезавантаженні
    autoRefreshToken: true,
  },
});