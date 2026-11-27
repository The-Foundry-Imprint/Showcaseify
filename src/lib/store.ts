import { createClient } from '@supabase/supabase-js'
import type { Showcase } from '../services/aiParser'
const url = import.meta.env.VITE_SUPABASE_URL, key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = url && key ? createClient(url, key) : null
const LS = 'showcaseify:projects'
const local = (): Showcase[] => { try { return JSON.parse(localStorage.getItem(LS) || '[]') } catch { return [] } }

export async function saveProject(p: Showcase) {
  const all = local().filter(x => x.id !== p.id); localStorage.setItem(LS, JSON.stringify([p, ...all]))
  if (supabase) { const { data } = await supabase.auth.getUser(); await supabase.from('projects').upsert({ id: p.id, owner: data.user?.id ?? null, data: p, updated_at: new Date().toISOString() }) }
}
export async function getProject(id: string): Promise<Showcase | null> {
  const l = local().find(x => x.id === id); if (l) return l
  if (supabase) { const { data } = await supabase.from('projects').select('data').eq('id', id).maybeSingle(); return data?.data ?? null }
  return null
}
export const listProjects = () => local()
export const deleteProject = (id: string) => localStorage.setItem(LS, JSON.stringify(local().filter(x => x.id !== id)))
