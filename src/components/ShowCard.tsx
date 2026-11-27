import { forwardRef } from 'react'
import type { Showcase } from '../services/aiParser'
const PAL: Record<string, string> = { 'Dark Neon': 'from-violet-600/40 to-cyan-500/30', 'Cyber Cyan': 'from-cyan-500/50 to-blue-700/30', 'Minimal Mono': 'from-zinc-700/40 to-zinc-900/40', 'Pastel Glass': 'from-pink-300/30 to-sky-300/30' }
type P = { s: Showcase; onChange?: (s: Showcase) => void }
export const ShowCard = forwardRef<HTMLDivElement, P>(({ s, onChange }, ref) => {
  const edit = !!onChange, set = (p: Partial<Showcase>) => onChange?.({ ...s, ...p })
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-3xl p-6 w-full max-w-xl aspect-[4/5] bg-gradient-to-br ${PAL[s.palette] ?? PAL['Dark Neon']} border border-white/10`}>
      {s.bg && <><img src={s.bg} className="absolute inset-0 w-full h-full object-cover" style={{ filter: `blur(${s.blur}px)` }} alt="" /><div className="absolute inset-0 bg-black" style={{ opacity: s.overlay }} /></>}
      <div className="relative z-10 h-full flex flex-col gap-4">
        <span className="self-start text-xs px-3 py-1 rounded-full bg-white/10">{s.status}</span>
        <h2 contentEditable={edit} suppressContentEditableWarning onBlur={e => set({ title: e.currentTarget.textContent || s.title })} className="text-3xl font-extrabold outline-none">{s.title}</h2>
        <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full grad transition-all" style={{ width: `${s.progress}%` }} /></div>
        <div className="flex flex-wrap gap-2">{s.metrics.map((m, i) => <span key={i} className="px-3 py-1 rounded-lg bg-black/30 text-sm font-semibold">{m}</span>)}</div>
        <ul className="space-y-2 overflow-auto">{s.milestones.map((m, i) => (
          <li key={i}><label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={m.done} onChange={() => {
            const ms = s.milestones.map((x, j) => j === i ? { ...x, done: !x.done } : x)
            set({ milestones: ms, progress: Math.round(100 * ms.filter(x => x.done).length / ms.length) }) }} />{m.text}</label></li>))}</ul>
        <div className="mt-auto flex items-end justify-between">
          <div className="flex gap-1 flex-wrap">{s.tags.map(t => <span key={t} className="text-xs text-white/60">#{t}</span>)}</div>
          {s.plan === 'free' && <a href="/create" className="text-[10px] text-white/70 bg-black/40 px-2 py-1 rounded">⚡ Built with Showcaseify – Create yours free</a>}
        </div>
        {s.cta && s.plan === 'agency' && <a href={s.cta.url} className="grad text-center rounded-xl py-2 font-bold">{s.cta.label}</a>}
      </div>
    </div>)
})
