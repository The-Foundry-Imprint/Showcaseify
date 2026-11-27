export type Milestone = { text: string; done: boolean }
export type Showcase = {
  id: string; title: string; status: string; progress: number
  metrics: string[]; milestones: Milestone[]; tags: string[]
  template: string; palette: string; bg?: string; overlay: number; blur: number
  plan: 'free' | 'pro' | 'agency'; cta?: { label: string; url: string }
}
export const uid = () => Math.random().toString(36).slice(2, 10)

export function parseLocal(input: string): Partial<Showcase> {
  try { const j = JSON.parse(input); if (j && typeof j === 'object') return j } catch {}
  const lines = input.split('\n').map(l => l.trim()).filter(Boolean)
  const title = (lines[0] || 'Untitled project').replace(/^#+\s*/, '').slice(0, 80)
  const pct = input.match(/(\d{1,3})\s*%\s*(complete|done|finished|progress)?/i)
  const metrics = [...input.matchAll(/[+\-]?\$?\d[\d,.]*\s?[kKmM%]?\+?\s?(MRR|ARR|uptime|growth|users|customers|revenue)?/gi)]
    .map(m => m[0].trim()).filter(m => /[%$kKmM]|MRR|ARR|uptime|growth|users/i.test(m)).slice(0, 4)
  const milestones = lines.filter(l => /^([-*•]|\[[ xX]\]|\d+\.)/.test(l)).map(l => ({
    text: l.replace(/^([-*•]|\[[ xX]\]|\d+\.)\s*/, ''), done: /\[[xX]\]|✓|✅|done|shipped|launched/i.test(l) }))
  const status = /launch/i.test(input) ? 'Launched' : /milestone/i.test(input) ? 'Milestone Hit' : 'In Progress'
  const tags = [...new Set([...input.matchAll(/#(\w+)/g)].map(m => m[1]))].slice(0, 4)
  const progress = pct ? Math.min(100, +pct[1]) : milestones.length ? Math.round(100 * milestones.filter(m => m.done).length / milestones.length) : 0
  return { title, status, progress, metrics, milestones, tags }
}

// Set VITE_AI_ENDPOINT (e.g. /api/parse) to use a real LLM.
export async function parse(input: string): Promise<Partial<Showcase>> {
  const ep = import.meta.env.VITE_AI_ENDPOINT
  if (ep) { try { const r = await fetch(ep, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: input }) }); if (r.ok) return await r.json() } catch {} }
  await new Promise(r => setTimeout(r, 900))
  return parseLocal(input)
}
