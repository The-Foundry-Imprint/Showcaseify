import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import {
  Sparkles,
  Download,
  Link2,
  Code2,
  Video,
  Share2,
  LayoutGrid,
  FileImage,
  Layers,
  CheckSquare,
  ArrowLeftRight,
  Lock,
  Crown,
  Upload,
} from 'lucide-react'
import { ShowCard } from '../components/ShowCard'
import { parse, uid, Showcase } from '../services/aiParser'
import { saveProject } from '../lib/store'

const TEMPLATES = [
  { name: 'Progress dashboard', desc: 'Milestones and live metrics', icon: LayoutGrid },
  { name: 'Project showcase', desc: 'A polished project story', icon: FileImage },
  { name: 'Social carousel', desc: 'A concise, shareable recap', icon: Layers },
  { name: 'Client milestones', desc: 'A clear client update', icon: CheckSquare },
  { name: 'Before vs. After', desc: 'Show progress side by side', icon: ArrowLeftRight },
] as const

const LOOKS = [
  { name: 'After hours', swatches: ['#0b1016', '#1e293b', '#22d3ee'] },
  { name: 'Night bloom', swatches: ['#8b5cf6', '#e879f9', '#22d3ee'] },
  { name: 'Soft focus', swatches: ['#fda4af', '#bef264', '#f8fafc'] },
  { name: 'Studio mono', swatches: ['#f8fafc', '#a1a1aa', '#27272a'] },
] as const

const LAYOUTS = ['Minimal', 'Grid', 'Compact'] as const

const SAMPLE = `Northstar Studio — Q4 Launch Update
Status: On Track (82% Completed)
Tags: #SaaS #ProductDesign #Q4Launch

- Launch Readiness: 82% launch ready
- Monthly Recurring Revenue: $10k MRR
- Active Pilot Partners: 5 pilot partners
- [x] Shipped interactive analytics workspace
- [x] Integrated multi-currency checkout & webhooks
- [ ] Finalize public launch video & changelog`

type StudioShowcase = Showcase & {
  subtitle?: string
  layout?: 'Minimal' | 'Grid' | 'Compact'
}

const blank = (): StudioShowcase => ({
  id: uid(),
  title: 'Northstar Studio',
  subtitle: 'A thoughtful new platform for turning complex analytics into confident decisions.',
  status: 'INDEPENDENT PROJECT UPDATE',
  progress: 82,
  metrics: ['82% launch ready', '$10k MRR', '5 pilot partners'],
  milestones: [
    { text: 'Shipped interactive analytics workspace', done: true },
    { text: 'Integrated multi-currency checkout & webhooks', done: true },
    { text: 'Finalize public launch video & changelog', done: false },
  ],
  tags: ['SaaS', 'Product design', 'Q4 launch'],
  template: 'Project showcase',
  palette: 'After hours',
  layout: 'Grid',
  overlay: 0.45,
  blur: 2,
  plan: 'free',
})

export default function Create({ initial }: { initial?: Showcase }) {
  const { state } = useLocation()
  const incoming = (state as { template?: StudioShowcase } | null)?.template

  const [s, setS] = useState<StudioShowcase>(incoming ?? (initial as StudioShowcase) ?? blank())
  const [txt, setTxt] = useState(SAMPLE)
  const [busy, setBusy] = useState(false)
  const [showSourceBox, setShowSourceBox] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (incoming) setS(incoming)
  }, [incoming])

  const gen = async () => {
    setBusy(true)
    const parsed = await parse(txt)
    setS(prev => ({ ...prev, ...parsed }))
    setBusy(false)
  }
const exportRef = useRef<HTMLDivElement>(null)

const capturePng = async () => {
  const target = exportRef.current ?? ref.current
  if (!target) return ''
  return toPng(target, {
    width: 1080,
    height: 1350,
    canvasWidth: 1080,
    canvasHeight: 1350,
    pixelRatio: 1,
    cacheBust: true,
  })
}

const triggerDownload = async (href: string, filename: string) => {
  const safeName = `${(s.title || 'showcase').toLowerCase().replace(/[^a-z0-9-_]+/gi, '-')}-${filename}`

  // Attempt native file share sheet when supported (great on mobile/tablet browsers)
  try {
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
      const res = await fetch(href)
      const blob = await res.blob()
      const file = new File([blob], safeName, { type: blob.type || 'image/png' })
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: s.title })
        return
      }
    }
  } catch {
    // Fall back to direct file download below
  }

  const a = document.createElement('a')
  a.href = href
  a.download = safeName
  document.body.appendChild(a)
  a.click()
  a.remove()
}

const handlePng = async () => {
  const dataUrl = await capturePng()
  if (dataUrl) await triggerDownload(dataUrl, '1080x1350.png')
}

const handlePdf = async () => {
  const dataUrl = await capturePng()
  if (!dataUrl) return
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [1080, 1350] })
  pdf.addImage(dataUrl, 'PNG', 0, 0, 1080, 1350)
  pdf.save(`${(s.title || 'showcase').toLowerCase().replace(/[^a-z0-9-_]+/gi, '-')}-1080x1350.pdf`)
}

  const handleCopyLink = async () => {
    await saveProject(s)
    const url = `${window.location.origin}/p/${s.id}`
    await navigator.clipboard?.writeText(url)
    alert(`Live link copied: ${url}`)
  }

  const handleCopyEmbed = async () => {
    const url = `${window.location.origin}/p/${s.id}`
    const snippet = `<iframe src="${url}" width="100%" height="680" style="border:0;border-radius:16px;" loading="lazy"></iframe>`
    await navigator.clipboard?.writeText(snippet)
    alert('Embed IFrame code copied to clipboard!')
  }

  const handleShareSocial = () => {
    const text = encodeURIComponent(`${s.title} — ${s.metrics.join(' · ')}`)
    const url = encodeURIComponent(`${window.location.origin}/p/${s.id}`)
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer')
  }

  const handleBgUpload = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setS(prev => ({ ...prev, bg: String(reader.result) }))
    reader.readAsDataURL(file)
  }

  const handleSaveProject = async () => {
    await saveProject(s)
    alert('Saved to My projects!')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Studio Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1.5">
          <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-semibold">
            SHOWCASE STUDIO &nbsp;——&nbsp; 01 / 04
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Make good work <span className="text-cyan-400">visible.</span>
          </h1>
          <p className="text-sm text-white/60">
            Turn your latest progress into a story worth sharing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Private draft
          </span>
          <button
            type="button"
            onClick={handleSaveProject}
            className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/75 transition"
          >
            Autosaves when shared
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls Column */}
        <div className="lg:col-span-5 space-y-6 rounded-2xl border border-white/10 bg-[#080b0e]/90 p-5">
          {/* 01 Template Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES.map(tpl => {
              const Icon = tpl.icon
              const active = s.template === tpl.name
              return (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => setS(prev => ({ ...prev, template: tpl.name }))}
                  className={`text-left rounded-xl p-3.5 border transition ${
                    active
                      ? 'border-cyan-400/70 bg-cyan-500/10'
                      : 'border-white/10 bg-[#0c1014] hover:border-white/25'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 p-2 rounded-lg border ${
                        active
                          ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                          : 'border-white/10 bg-white/[0.03] text-white/60'
                      }`}
                    >
                      <Icon size={15} />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">{tpl.name}</div>
                      <div className="text-xs text-white/50 mt-0.5">{tpl.desc}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* 03 Find Your Look */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-white/90">
                03 &nbsp;Find your look
              </span>
              <button
                type="button"
                onClick={() => alert('Upgrade to Pro to upload a custom brand kit.')}
                className="inline-flex items-center gap-1.5 text-[11px] text-white/55 hover:text-cyan-300 transition"
              >
                <Lock size={11} />
                <span>Your own brand kit</span>
                <Crown size={12} className="text-cyan-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {LOOKS.map(look => {
                const selected = s.palette === look.name
                return (
                  <button
                    key={look.name}
                    type="button"
                    onClick={() => setS(prev => ({ ...prev, palette: look.name }))}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs transition ${
                      selected
                        ? 'border-cyan-400/70 bg-cyan-500/10 text-white font-semibold'
                        : 'border-white/10 bg-[#0c1014] text-white/75 hover:border-white/25'
                    }`}
                  >
                    <span>{look.name}</span>
                    <span className="flex items-center gap-1">
                      {look.swatches.map(hex => (
                        <span
                          key={hex}
                          className="h-3 w-3 rounded-sm border border-white/15"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Layout Segmented Pill + Custom Fonts */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/45">Layout</span>
                <div className="inline-flex rounded-lg border border-white/10 bg-[#0c1014] p-0.5">
                  {LAYOUTS.map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setS(prev => ({ ...prev, layout: mode }))}
                      className={`px-2.5 py-1 rounded-md text-xs transition ${
                        s.layout === mode
                          ? 'bg-white/15 text-white font-semibold'
                          : 'text-white/55 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert('Custom font imports are included in Pro.')}
                className="inline-flex items-center gap-1 text-[11px] text-white/50 hover:text-cyan-300"
              >
                <Lock size={11} />
                <span>Custom fonts</span>
                <Crown size={11} className="text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Toggleable Notes / JSON & Device Background Controls */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setShowSourceBox(v => !v)}
                className="text-cyan-400 hover:underline font-medium"
              >
                {showSourceBox ? 'Hide raw notes / JSON' : 'Edit raw notes / JSON'}
              </button>

              <label className="inline-flex items-center gap-1.5 text-white/70 hover:text-white cursor-pointer">
                <Upload size={13} className="text-cyan-400" />
                <span>Photo / File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleBgUpload(e.target.files?.[0])}
                  className="hidden"
                />
              </label>
            </div>

            {showSourceBox && (
              <div className="space-y-2">
                <textarea
                  value={txt}
                  onChange={e => setTxt(e.target.value)}
                  placeholder="Paste project notes, metrics, milestones, or JSON…"
                  className="w-full h-32 rounded-xl bg-[#0c1014] border border-white/10 p-3 text-xs text-white outline-none focus:border-cyan-400/60"
                />
                <div className="flex justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setTxt(SAMPLE)}
                    className="text-cyan-400 hover:underline"
                  >
                    Load sample update
                  </button>
                  <button
                    type="button"
                    onClick={handlePdf}
                    className="text-white/60 hover:text-white"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            )}

            {/* Primary Cyan CTA Button */}
            <button
              type="button"
              onClick={gen}
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:brightness-105 text-slate-950 font-bold py-3.5 px-4 flex items-center justify-between transition shadow-[0_0_24px_-4px_rgba(34,211,238,0.45)]"
            >
              <span className="inline-flex items-center gap-2 text-sm">
                <Sparkles size={16} />
                {busy ? 'Generating showcase…' : 'Make it a showcase'}
              </span>
              <span>→</span>
            </button>

            <p className="text-[11px] text-center text-white/40">
              Your text stays editable. Nothing is shared until you choose.
            </p>
          </div>
        </div>

        {/* Right Canvas & Export Toolbar */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-white">Your canvas</span>
              <span className="text-white/40">•</span>
              <span className="text-cyan-400">Live preview</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1216] hover:bg-white/10 border border-white/10 text-xs text-white/85 transition"
              >
                <Link2 size={13} />
                <span>Copy live link</span>
              </button>
              <button
                type="button"
                onClick={handleCopyEmbed}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1216] hover:bg-white/10 border border-white/10 text-xs text-white/85 transition"
              >
                <Code2 size={13} />
                <span>Embed</span>
              </button>
              <button
                type="button"
                onClick={handlePng}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1216] hover:bg-white/10 border border-white/10 text-xs text-white/85 transition"
              >
                <Download size={13} />
                <span>PNG</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Animated video export is a Pro feature.')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1216] hover:bg-white/10 border border-white/10 text-xs text-white/75 transition"
              >
                <Video size={13} />
                <span>
                  Export Animated Video <span className="text-cyan-400 font-semibold">(Pro)</span>
                </span>
              </button>
              <button
                type="button"
                onClick={handleShareSocial}
                aria-label="Share showcase"
                className="p-2 rounded-lg bg-[#0d1216] hover:bg-white/10 border border-white/10 text-white/75 transition"
              >
                <Share2 size={13} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/45 px-1">
            <span>
              <strong className="text-cyan-400 font-medium">Desktop</strong> · mobile ready
            </span>
            <span>
              <span className="text-amber-400">•</span> Private until you share
            </span>
          </div>

          <ShowCard
            ref={ref}
            s={s}
            onChange={setS}
            onSaveToProjects={handleSaveProject}
            onOpenModal={() => alert('Build your own interactive showcase on Showcaseify!')}
          />
        </div>
      </div>
      {/* Hidden 1080x1350 Social Post Export Frame (Prevents Text Clipping on Save) */}
    <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
      <div
        ref={exportRef}
        className="w-[1080px] h-[1350px] bg-[#070a0d] text-white p-12 flex flex-col justify-between relative overflow-hidden"
      >
        {s.bg && (
          <>
            <img
              src={s.bg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: `blur(${s.blur}px)` }}
            />
            <div className="absolute inset-0 bg-black" style={{ opacity: Math.max(s.overlay, 0.65) }} />
          </>
        )}

        <div className="relative z-10 flex flex-col justify-between h-full gap-8">
          <div className="rounded-3xl border border-white/15 bg-[#0c1015]/90 p-9 space-y-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold">
              <span>{s.status || 'PROJECT UPDATE'}</span>
              <span>{s.template}</span>
            </div>
            <h2 className="text-5xl font-extrabold leading-tight break-words">{s.title}</h2>
            {s.subtitle && (
              <p className="text-xl text-white/75 leading-relaxed break-words">{s.subtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {s.metrics.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/15 bg-[#0c1015]/90 p-6"
              >
                <div className="text-2xl font-extrabold text-cyan-300 break-words">{m}</div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/15 bg-[#0c1015]/90 p-8 space-y-4">
            <div className="flex items-center justify-between text-sm uppercase tracking-widest text-white/60">
              <span>Milestones</span>
              <span className="text-cyan-400 font-bold">{s.progress}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${s.progress}%` }} />
            </div>
            <div className="space-y-3 pt-2">
              {s.milestones.map((ms, idx) => (
                <div key={idx} className="flex items-start gap-3 text-lg">
                  <span className="font-bold text-cyan-400 shrink-0">{ms.done ? '✓' : '○'}</span>
                  <span className={`break-words ${ms.done ? 'line-through text-white/55' : 'text-white'}`}>
                    {ms.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-white/70 pt-2">
            <div className="flex flex-wrap gap-2">
              {s.tags.map(t => (
                <span key={t} className="px-3 py-1 rounded-lg bg-white/10">
                  #{t.replace(/^#/, '')}
                </span>
              ))}
            </div>
            <span className="font-semibold text-cyan-300">Powered by Showcaseify</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
