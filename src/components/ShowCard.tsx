import { forwardRef } from 'react'
import { Sparkles, Check, ArrowUpRight } from 'lucide-react'
import type { Showcase } from '../services/aiParser'

type ThemeSpec = {
  border: string
  glow: string
  accentText: string
  accentBg: string
  surface: string
}

const THEMES: Record<string, ThemeSpec> = {
  'After hours': {
    border: 'border-cyan-500/40',
    glow: 'shadow-[0_0_40px_-12px_rgba(6,182,212,0.25)]',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500',
    surface: 'from-cyan-950/30 via-[#090d10] to-[#07090b]',
  },
  'Night bloom': {
    border: 'border-fuchsia-500/40',
    glow: 'shadow-[0_0_40px_-12px_rgba(217,70,239,0.22)]',
    accentText: 'text-fuchsia-400',
    accentBg: 'bg-fuchsia-500',
    surface: 'from-violet-950/35 via-[#0b0910] to-[#07090b]',
  },
  'Soft focus': {
    border: 'border-rose-300/35',
    glow: 'shadow-[0_0_40px_-12px_rgba(251,113,133,0.18)]',
    accentText: 'text-rose-300',
    accentBg: 'bg-rose-400',
    surface: 'from-rose-950/25 via-[#0c0a0d] to-[#07090b]',
  },
  'Studio mono': {
    border: 'border-white/15',
    glow: '',
    accentText: 'text-zinc-200',
    accentBg: 'bg-zinc-200',
    surface: 'from-zinc-900/60 via-[#090b0d] to-[#07090b]',
  },
}

type Props = {
  s: Showcase
  onChange?: (s: Showcase) => void
  onSaveToProjects?: () => void
  onOpenModal?: () => void
}

export const ShowCard = forwardRef<HTMLDivElement, Props>(
  ({ s, onChange, onSaveToProjects, onOpenModal }, ref) => {
    const edit = !!onChange
    const set = (patch: Partial<Showcase>) => onChange?.({ ...s, ...patch })
    const theme = THEMES[s.palette] ?? THEMES['After hours']
    const layout = (s as Showcase & { layout?: 'Minimal' | 'Grid' | 'Compact' }).layout ?? 'Grid'

    const toggleMilestone = (idx: number) => {
      if (!edit) return
      const next = s.milestones.map((m, i) => (i === idx ? { ...m, done: !m.done } : m))
      const doneCount = next.filter(m => m.done).length
      const pct = next.length ? Math.round((doneCount / next.length) * 100) : s.progress
      set({ milestones: next, progress: pct })
    }

    return (
      <div ref={ref} className="w-full space-y-4">
        {/* Main Showcase Card */}
        <div
          className={`relative overflow-hidden rounded-2xl border ${theme.border} ${theme.glow} bg-gradient-to-br ${theme.surface} transition-all`}
        >
          {s.bg && (
            <>
              <img
                src={s.bg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: `blur(${s.blur}px)` }}
              />
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: s.overlay }}
              />
            </>
          )}

<div className="relative z-10 p-4 sm:p-6 space-y-4 sm:space-y-5 min-w-0">
          {/* Hero / Visual Banner Block */}
          <div className="relative rounded-xl border border-white/10 bg-[#0d1115]/90 p-4 sm:p-6 min-h-[160px] flex flex-col justify-between min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] ${theme.accentText}`}>
                <span className={`h-2 w-2 shrink-0 rounded-full ${theme.accentBg}`} />
                <span>{s.status || 'PROJECT UPDATE'} / {String(s.progress).padStart(2, '0')}</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {s.plan === 'pro' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950">
                    PRO
                  </span>
                )}
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/75">
                  {s.template}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-1.5 min-w-0">
              <h2
                contentEditable={edit}
                suppressContentEditableWarning
                onBlur={e => set({ title: e.currentTarget.textContent?.trim() || s.title })}
                className="text-xl sm:text-3xl font-bold tracking-tight text-white break-words outline-none focus:ring-1 focus:ring-cyan-400/50 rounded"
              >
                {s.title}
              </h2>
              <p
                contentEditable={edit}
                suppressContentEditableWarning
                onBlur={e =>
                  set({
                    subtitle: e.currentTarget.textContent?.trim() || '',
                  } as Partial<Showcase>)
                }
                className="text-xs sm:text-sm text-white/65 break-words outline-none"
              >
                {(s as Showcase & { subtitle?: string }).subtitle ||
                  'Turn raw sprint notes, metrics, and milestones into a crisp shareable showcase.'}
              </p>
            </div>
          </div>

          {/* Metrics & Milestones Row */}
          {layout !== 'Minimal' && (
            <div className={`grid ${layout === 'Grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-3 sm:gap-4 min-w-0`}>
              {/* Metrics & Tags */}
              <div className="rounded-xl border border-white/10 bg-[#0b0e12]/90 p-3.5 sm:p-4 space-y-3 min-w-0">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-white/50">
                  Key Metrics
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(s.metrics.length ? s.metrics : [`${s.progress}% complete`, 'On schedule']).map(
                    (m, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 min-w-0"
                      >
                        <div className="text-xs sm:text-sm font-bold text-white leading-snug break-words">
                          {m}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {s.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {s.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-white/75 break-all"
                      >
                        #{tag.replace(/^#/, '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Milestones */}
              <div className="rounded-xl border border-white/10 bg-[#0b0e12]/90 p-3.5 sm:p-4 space-y-3 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-white/50">
                    Milestones
                  </span>
                  <span className={`text-xs font-semibold shrink-0 ${theme.accentText}`}>
                    {s.progress}%
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full ${theme.accentBg} transition-all duration-300`}
                    style={{ width: `${Math.min(100, Math.max(0, s.progress))}%` }}
                  />
                </div>

                <ul className="space-y-2 pt-1 min-w-0">
                  {s.milestones.map((ms, idx) => (
                    <li key={idx} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleMilestone(idx)}
                        className="w-full flex items-start gap-2 text-left text-xs text-white/85 hover:text-white transition min-w-0"
                      >
                        <span
                          className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center shrink-0 border transition ${
                            ms.done
                              ? `${theme.accentBg} border-transparent text-slate-950`
                              : 'border-white/25 bg-white/5'
                          }`}
                        >
                          {ms.done && <Check size={11} strokeWidth={3} />}
                        </span>
                        <span className={`min-w-0 break-words leading-snug ${ms.done ? 'line-through text-white/50' : ''}`}>
                          {ms.text}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
              <div className="mt-8 space-y-2 max-w-2xl">
                <h2
                  contentEditable={edit}
                  suppressContentEditableWarning
                  onBlur={e => set({ title: e.currentTarget.textContent?.trim() || s.title })}
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-white outline-none focus:ring-1 focus:ring-cyan-400/50 rounded"
                >
                  {s.title}
                </h2>
                <p
                  contentEditable={edit}
                  suppressContentEditableWarning
                  onBlur={e =>
                    set({
                      subtitle: e.currentTarget.textContent?.trim() || '',
                    } as Partial<Showcase>)
                  }
                  className="text-sm text-white/65 outline-none"
                >
                  {(s as Showcase & { subtitle?: string }).subtitle ||
                    'Turn raw sprint notes, metrics, and milestones into a crisp shareable showcase.'}
                </p>
              </div>
            </div>

            {/* Metrics & Milestones Row */}
            {layout !== 'Minimal' && (
              <div className={`grid ${layout === 'Grid' ? 'sm:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {/* Metrics & Tags */}
                <div className="rounded-xl border border-white/10 bg-[#0b0e12]/85 p-4 space-y-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-white/45">
                    Key Metrics
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(s.metrics.length ? s.metrics : [`${s.progress}% complete`, 'On schedule']).map(
                      (m, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
                        >
                          <div className="text-sm sm:text-base font-bold text-white">{m}</div>
                        </div>
                      )
                    )}
                  </div>

                  {s.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {s.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-white/75"
                        >
                          #{tag.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interactive Milestones */}
                <div className="rounded-xl border border-white/10 bg-[#0b0e12]/85 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-white/45">
                      Milestones
                    </span>
                    <span className={`text-xs font-semibold ${theme.accentText}`}>
                      {s.progress}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full ${theme.accentBg} transition-all duration-300`}
                      style={{ width: `${Math.min(100, Math.max(0, s.progress))}%` }}
                    />
                  </div>

                  <ul className="space-y-2 pt-1 max-h-44 overflow-y-auto">
                    {s.milestones.map((ms, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => toggleMilestone(idx)}
                          className="w-full flex items-start gap-2.5 text-left text-xs sm:text-sm text-white/85 hover:text-white transition"
                        >
                          <span
                            className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center shrink-0 border transition ${
                              ms.done
                                ? `${theme.accentBg} border-transparent text-slate-950`
                                : 'border-white/25 bg-white/5'
                            }`}
                          >
                            {ms.done && <Check size={11} strokeWidth={3} />}
                          </span>
                          <span className={ms.done ? 'line-through text-white/50' : ''}>
                            {ms.text}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Footer Attribution & Save Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={onOpenModal}
                className="inline-flex items-center gap-1.5 text-white/70 hover:text-cyan-300 transition"
              >
                <Sparkles size={13} className={theme.accentText} />
                <span>
                  {s.plan === 'free' ? 'Powered by Showcaseify' : 'Showcaseify Pro'}
                </span>
              </button>

              {onSaveToProjects && (
                <button
                  type="button"
                  onClick={onSaveToProjects}
                  className="inline-flex items-center gap-1.5 text-white/75 hover:text-white font-medium transition"
                >
                  <span>Save to My projects</span>
                  <ArrowUpRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Summary Strip (STORY / STYLE / PROGRESS / SHARING) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-3 px-1 text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-white/40">Story</div>
            <div className="font-semibold text-white/90 mt-0.5 truncate">{s.template}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-white/40">Style</div>
            <div className="font-semibold text-white/90 mt-0.5">{s.palette}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-white/40">Progress</div>
            <div className="font-semibold text-white/90 mt-0.5">{s.progress}% complete</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-white/40">Sharing</div>
            <div className="font-semibold text-white/90 mt-0.5">Private draft</div>
          </div>
        </div>
      </div>
    )
  }
)
