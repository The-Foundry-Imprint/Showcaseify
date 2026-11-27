import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Wand2, ExternalLink, Trash2, Check, Crown, Lock } from 'lucide-react'
import { ShowCard } from '../components/ShowCard'
import { uid, Showcase } from '../services/aiParser'
import { listProjects, deleteProject } from '../lib/store'
import { DEMO_SHOWCASES, DemoShowcase } from '../data/demoShowcases'

const TEMPLATE_FILTERS = [
  'All',
  'Progress dashboard',
  'Project showcase',
  'Executive Brief',
  'Client milestones',
  'Social carousel',
  'Before vs. After',
] as const

const ACCESS_FILTERS = ['All Plans', 'Free', 'Pro'] as const

export function Home() {
  const nav = useNavigate()
  const [templateFilter, setTemplateFilter] = useState<string>('All')
  const [accessFilter, setAccessFilter] = useState<(typeof ACCESS_FILTERS)[number]>('All Plans')
  const [userPlan] = useState<'free' | 'pro' | 'agency'>('free')

  const saved = listProjects()
  const allCards: DemoShowcase[] = [...saved, ...DEMO_SHOWCASES]

  const visible = allCards.filter(item => {
    const matchesTemplate = templateFilter === 'All' || item.template === templateFilter
    const matchesAccess =
      accessFilter === 'All Plans' ||
      (accessFilter === 'Free' && item.plan === 'free') ||
      (accessFilter === 'Pro' && item.plan === 'pro')
    return matchesTemplate && matchesAccess
  })

  const useTemplate = (tpl: DemoShowcase) => {
    if (tpl.plan === 'pro' && userPlan === 'free') {
      const goUpgrade = window.confirm(
        `"${tpl.title}" is a Pro template. Upgrade to Pro to unlock all advanced & executive templates—or view Plans now?`
      )
      if (goUpgrade) nav('/subscription')
      return
    }

    const cloned: Showcase = {
      ...tpl,
      id: uid(),
      milestones: tpl.milestones.map(m => ({ ...m })),
      metrics: [...tpl.metrics],
      tags: [...tpl.tags],
    }
    nav('/create', { state: { template: cloned } })
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Flashy Hero Banner */}
      <div className="relative overflow-hidden glass p-6 sm:p-8 rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-violet-950/50 via-[#090d12] to-cyan-950/40 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-400/25 px-3 py-1 rounded-full">
              <Sparkles size={12} /> 30 Live Showcases & Templates
            </span>
            <span className="text-xs text-white/60 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              Free + Pro Aesthetic Editions
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Make every update look{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">
              unforgettable.
            </span>
          </h1>
          <p className="text-sm text-white/65">
            Explore flashy project cards, sleek executive briefs, and visual milestones backed by rich photography—clone free templates or unlock Pro layouts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/create"
            className="grad inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
          >
            <Wand2 size={16} /> Create New Visual
          </Link>
          <Link
            to="/subscription"
            className="glass border border-amber-400/30 text-amber-300 hover:bg-white/10 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl font-semibold text-xs transition"
          >
            <Crown size={14} /> Unlock Pro
          </Link>
        </div>
      </div>

      {/* Plan Filter + Template Category Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {TEMPLATE_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setTemplateFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                templateFilter === f
                  ? 'grad text-white font-semibold'
                  : 'glass text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 p-1 rounded-full self-start">
          {ACCESS_FILTERS.map(mode => (
            <button
              key={mode}
              onClick={() => setAccessFilter(mode)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                accessFilter === mode
                  ? 'bg-cyan-400 text-slate-950'
                  : 'text-white/65 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-white/50 flex items-center justify-between">
        <span>Showing {visible.length} showcases</span>
        <span>Includes Free starter & Pro executive/3D templates</span>
      </div>

      {/* 30-Demo Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visible.map(item => {
          const isProLocked = item.plan === 'pro' && userPlan === 'free'
          return (
            <div
              key={item.id}
              className="glass p-4 rounded-3xl border border-white/10 flex flex-col justify-between gap-4 hover:border-cyan-400/35 transition"
            >
              <ShowCard s={item} />

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    item.plan === 'pro'
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                      : 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30'
                  }`}
                >
                  {item.plan === 'pro' ? 'Pro Template' : 'Free Template'}
                </span>

                <div className="flex items-center gap-2">
                  {saved.some(s => s.id === item.id) && (
                    <Link
                      to={`/p/${item.id}`}
                      className="glass px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white inline-flex items-center gap-1"
                    >
                      <ExternalLink size={13} /> Live
                    </Link>
                  )}
                  <button
                    onClick={() => useTemplate(item)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition ${
                      isProLocked
                        ? 'bg-white/10 hover:bg-white/15 text-amber-300 border border-amber-400/30'
                        : 'grad text-white hover:opacity-95'
                    }`}
                  >
                    {isProLocked ? <Lock size={13} /> : <Wand2 size={13} />}
                    {isProLocked ? 'Unlock Pro' : 'Use template'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Hero Banner */}
      <div className="glass p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 via-zinc-900/60 to-cyan-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-400/20 px-2.5 py-1 rounded-full">
            <Sparkles size={12} /> Community Showcases & Templates
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Turn raw updates into visual cards
          </h1>
          <p className="text-sm text-white/60 max-w-xl">
            Browse real project dashboards, sprint updates, and launch cards—or clone any template into the AI studio in one click.
          </p>
        </div>
        <Link
          to="/create"
          className="grad shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-violet-600/20 hover:opacity-95 transition"
        >
          <Wand2 size={16} /> Create New Visual
        </Link>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              filter === f
                ? 'grad text-white font-semibold'
                : 'glass text-white/70 hover:text-white border border-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Showcase Card Feed */}
      <div className="grid md:grid-cols-2 gap-6">
        {visible.map(item => (
          <div
            key={item.id}
            className="glass p-4 rounded-3xl border border-white/10 flex flex-col items-center gap-4 hover:border-cyan-400/30 transition"
          >
            <ShowCard s={item} />
            <div className="w-full max-w-xl flex items-center justify-between gap-2 pt-1">
              <span className="text-xs text-white/50">{item.template}</span>
              <div className="flex items-center gap-2">
                {saved.some(s => s.id === item.id) && (
                  <Link
                    to={`/p/${item.id}`}
                    className="glass px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white inline-flex items-center gap-1"
                  >
                    <ExternalLink size={13} /> Live
                  </Link>
                )}
                <button
                  onClick={() => useTemplate(item)}
                  className="grad px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 hover:opacity-95 transition"
                >
                  <Wand2 size={13} /> Use this template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Subscription = () => {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      desc: 'Viral starter for solo builders',
      features: ['Unlimited text & JSON parsing', 'Custom device background upload', '1080p PNG & JSON device export', 'Unlimited public /p/:id links'],
    },
    {
      name: 'Pro',
      price: '$19/mo',
      desc: 'White-label power for creators & freelancers',
      features: ['Remove Showcaseify watermark', '4K Ultra-HD PNG & PDF exports', 'Custom brand logo & hex colors', 'Unlimited projects & analytics'],
      highlight: true,
    },
    {
      name: 'Agency',
      price: '$49/mo',
      desc: 'Multi-seat collaboration & lead capture',
      features: ['Everything in Pro', 'Up to 5 team members & roles', 'Custom "Book a Call" CTA button on cards'],
    },
  ]

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-1 pt-2">
        <h2 className="text-2xl font-extrabold">Simple, creator-friendly pricing</h2>
        <p className="text-sm text-white/60">Upgrade anytime to remove watermarks and unlock 4K device exports.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map(t => (
          <div
            key={t.name}
            className={`glass p-6 rounded-3xl flex flex-col justify-between space-y-5 border ${
              t.highlight ? 'border-cyan-400/50 bg-gradient-to-b from-violet-950/30 to-transparent' : 'border-white/10'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{t.name}</h3>
                {t.highlight && <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full grad">Popular</span>}
              </div>
              <p className="text-3xl font-extrabold">{t.price}</p>
              <p className="text-xs text-white/60">{t.desc}</p>
              <ul className="space-y-2 pt-2">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/80">
                    <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                t.highlight ? 'grad' : 'glass border border-white/15 hover:bg-white/10'
              }`}
              onClick={() => alert(`Checkout ready for ${t.name} (${t.price}) — connect Paystack/Stripe keys`)}
            >
              {t.name === 'Free' ? 'Current Plan' : `Upgrade to ${t.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Me() {
  const [l, setL] = useState(listProjects())
  const nav = useNavigate()

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="glass p-5 rounded-3xl border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">My Saved Showcases</h2>
          <p className="text-xs text-white/60">Reopen in studio, copy public links, or manage saved cards.</p>
        </div>
        <Link to="/create" className="grad px-4 py-2 rounded-xl text-xs font-bold">
          + New Card
        </Link>
      </div>

      {l.length === 0 ? (
        <div className="glass p-10 rounded-3xl text-center space-y-3 border border-white/10">
          <p className="text-sm text-white/60">No saved projects yet. Create one or clone a template from Home.</p>
          <Link to="/" className="inline-block text-cyan-400 text-sm font-semibold">
            Browse Home Templates →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {l.map(p => (
            <div key={p.id} className="glass p-4 rounded-3xl border border-white/10 flex flex-col items-center gap-3">
              <ShowCard s={p} />
              <div className="w-full max-w-xl flex items-center justify-between text-xs pt-1">
                <Link to={`/p/${p.id}`} className="text-cyan-400 font-semibold inline-flex items-center gap-1">
                  <ExternalLink size={13} /> Open Public Link
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => nav('/create', { state: { template: p } })}
                    className="text-white/80 hover:text-white font-medium"
                  >
                    Edit in Studio
                  </button>
                  <button
                    onClick={() => {
                      deleteProject(p.id)
                      setL(listProjects())
                    }}
                    className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-1"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
