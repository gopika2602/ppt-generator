import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type FavouriteType = 'theme'|'background'|'font'|'font_style'|'text_color'|'effect'|'setting';
export type Favourite = { item_type: FavouriteType; item_id: string; metadata?: Record<string, unknown> };

export async function loadFavourites(user: User): Promise<Favourite[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('user_favourites').select('item_type,item_id,metadata').eq('user_id', user.id);
  if (error) throw error;
  return data as Favourite[];
}

export async function setFavourite(user: User, favourite: Favourite, active: boolean) {
  if (!supabase) throw new Error('Connect PEACE SLIDES to Supabase to save personal favourites.');
  const key = { user_id: user.id, item_type: favourite.item_type, item_id: favourite.item_id };
  if (active) {
    const { error } = await supabase.from('user_favourites').upsert({ ...key, metadata: favourite.metadata || {} }, { onConflict: 'user_id,item_type,item_id', ignoreDuplicates: true });
    if (error) throw error;
  } else {
    const { error } = await supabase.from('user_favourites').delete().match(key);
    if (error) throw error;
  }
}

export async function loadRecentDesigns(user: User): Promise<string[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('user_preferences').select('recent_designs').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  return Array.isArray(data?.recent_designs) ? data.recent_designs.filter((x): x is string => typeof x === 'string') : [];
}

export async function loadPreferences(user: User): Promise<Record<string, unknown>> {
  if (!supabase) return {};
  const { data, error } = await supabase.from('user_preferences').select('preferences').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  return data?.preferences && typeof data.preferences === 'object' ? data.preferences as Record<string, unknown> : {};
}

export async function savePreferences(user: User, preferences: Record<string, unknown>) {
  if (!supabase) return;
  const { data: existing, error: readError } = await supabase.from('user_preferences').select('preferences').eq('user_id', user.id).maybeSingle();
  if (readError) throw readError;
  const { error } = await supabase.from('user_preferences').upsert({ user_id: user.id, preferences: { ...(existing?.preferences as Record<string, unknown>||{}), ...preferences }, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function saveRecentDesigns(user: User, recent: string[]) {
  if (!supabase) return;
  const { error } = await supabase.from('user_preferences').upsert({ user_id: user.id, recent_designs: recent.slice(0, 5), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (error) throw error;
}
