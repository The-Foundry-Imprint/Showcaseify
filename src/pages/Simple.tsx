import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Wand2, ExternalLink, Trash2, Check } from 'lucide-react'
import { ShowCard } from '../components/ShowCard'
import { uid, Showcase } from '../services/aiParser'
import { listProjects, deleteProject } from '../lib/store'

const STARTER_TEMPLATES: Showcase[] = [
  {
    id: 'tpl-payflow',
    title: 'PayFlow Merchant Checkout v2.4 — Sprint 6 Update',
    status: 'On Track',
    progress: 85,
    metrics: ['Conversion +14.8%', 'Success 99.4%', 'Load 420ms', '140 Stores'],
    milestones: [
      { text: 'Built one-tap saved card and bank transfer selector on mobile', done: true },
      { text: 'Added automatic idempotency keys and retry queue for webhooks', done: true },
      { text: 'Completed load testing up to 2,500 concurrent checkouts/min', done: true },
      { text: 'Finalize multi-currency display formatting for international buyers', done: false },
      { text: 'Roll out v2.4 to 100% of production traffic by Friday', done: false },
    ],
    tags: ['Fintech', 'CheckoutUX', 'Paystack', 'Performance'],
    template: 'Progress Dashboard',
    palette: 'Dark Neon',
    overlay: 0.45,
    blur: 2,
    plan: 'free',
  },
  {
    id: 'tpl-pulse',
    title: 'Pulse CRM — Public Launch & Q4 Growth Metrics',
    status: 'Launched',
    progress: 100,
    metrics: ['$12.5k MRR', '99.9% Uptime', '+42% MoM', '320 Teams'],
    milestones: [
      { text: 'Closed private beta with 40 founding design agencies', done: true },
      { text: 'Launched Stripe & Paystack multi-currency subscriptions', done: true },
      { text: 'Featured #2 Product of the Day on launch week', done: true },
      { text: 'Shipped automated Slack & WhatsApp deal alerts', done: true },
    ],
    tags: ['SaaS', 'BuildInPublic', 'Growth', 'Launch'],
    template: 'Project Showcase Card',
    palette: 'Cyber Cyan',
    overlay: 0.45,
    blur: 2,
    plan: 'free',
  },
  {
    id: 'tpl-studio',
    title: 'Kora Mobile Banking — Client Design Sign-Off',
    status: 'Milestone Hit',
    progress: 75,
    metrics: ['48 Screens', '4.9★ TestFlight', '-35% Dropoff'],
    milestones: [
      { text: 'Delivered interactive Figma prototype & dark mode tokens', done: true },
      { text: 'Completed biometric onboarding & virtual card flows', done: true },
      { text: 'Usability testing with 25 Lagos & London beta users', done: true },
      { text: 'Developer handoff & Lottie micro-animation assets', done: false },
    ],
    tags: ['UIUX', 'ClientUpdate', 'MobileApp', 'Fintech'],
    template: 'Client Milestones',
    palette: 'Minimal Mono',
    overlay: 0.45,
    blur: 2,
    plan: 'free',
  },
  {
    id: 'tpl-ai',
    title: 'VoxNote AI — Weekly Indie Hacker Changelog',
    status: 'In Progress',
    progress: 60,
    metrics: ['1,850 Users', '18k Notes', '0.8s Latency'],
    milestones: [
      { text: 'Whisper v3 voice-to-structured-card pipeline live', done: true },
      { text: 'Added 4K PNG & multi-page PDF device exports', done: true },
      { text: 'Custom background photo blur & overlay controls', done: false },
      { text: 'Team workspace roles & custom domain mapping', done: false },
    ],
    tags: ['AI', 'IndieHacker', 'Changelog', 'ShipFast'],
    template: 'Social Carousel',
    palette: 'Dark Neon',
    overlay: 0.45,
    blur: 2,
    plan: 'free',
  },
]

const FILTERS = ['All', 'Progress Dashboard', 'Project Showcase Card', 'Client Milestones', 'Social Carousel']

export function Home() {
  const nav = useNavigate()
  const [filter, setFilter] = useState('All')
  const saved = listProjects()

  // Merge user's saved projects with starter templates so Home always looks rich
  const allCards = [...saved, ...STARTER_TEMPLATES]
  const visible = filter === 'All' ? allCards : allCards.filter(c => c.template === filter)

  const useTemplate = (tpl: Showcase) => {
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
