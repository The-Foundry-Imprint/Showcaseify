import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { Sparkles, Download, Link2, FileJson } from 'lucide-react'
import { ShowCard } from '../components/ShowCard'
import { parse, uid, Showcase } from '../services/aiParser'
import { saveProject } from '../lib/store'

const SAMPLE = `Project: PayFlow Merchant Checkout v2.4 — Sprint 6 Update
Status: On Track (85% Completed)
Tags: #Fintech #CheckoutUX #Paystack #Performance

- Checkout Conversion: +14.8%
- Payment Success Rate: 99.4%
- Average Load Time: 420ms
- [x] Built one-tap saved card and bank transfer selector on mobile
- [x] Added automatic idempotency keys and retry queue for webhook events
- [ ] Roll out v2.4 to 100% of production traffic by Friday`

const blank = (): Showcase => ({
  id: uid(),
  title: 'Your project',
  status: 'In Progress',
  progress: 0,
  metrics: [],
  milestones: [],
  tags: [],
  template: 'Project Showcase Card',
  palette: 'Dark Neon',
  overlay: 0.45,
  blur: 2,
  plan: 'free',
})

export default function Create({ initial }: { initial?: Showcase }) {
  const { state } = useLocation()
  const incoming = (state as { template?: Showcase } | null)?.template
  const [s, setS] = useState<Showcase>(incoming ?? initial ?? blank())
  const [txt, setTxt] = useState('')
  const [busy, setBusy] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (incoming) setS(incoming)
  }, [incoming])

  const gen = async () => {
    setBusy(true)
    const p = await parse(txt)
    setS({ ...s, ...p } as Showcase)
    setBusy(false)
  }
  const img = async () => toPng(ref.current!, { pixelRatio: s.plan === 'free' ? 1 : 3 })
  const dl = (href: string, name: string) => {
    const a = document.createElement('a')
    a.href = href
    a.download = name
    a.click()
  }
  const png = async () => dl(await img(), `${s.title}.png`)
  const pdf = async () => {
    const d = await img()
    const p = new jsPDF()
    p.addImage(d, 'PNG', 10, 10, 190, 237)
    p.save(`${s.title}.pdf`)
  }
  const json = () => dl('data:application/json,' + encodeURIComponent(JSON.stringify(s, null, 2)), `${s.title}.json`)
  const share = async () => {
    await saveProject(s)
    const u = `${location.origin}/p/${s.id}`
    await navigator.clipboard?.writeText(u)
    alert('Link copied: ' + u)
  }
  const bg = (f?: File) => {
    if (!f) return
    const r = new FileReader()
    r.onload = () => setS({ ...s, bg: String(r.result) })
    r.readAsDataURL(f)
  }

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 p-4">
      <div className="glass p-5 rounded-3xl space-y-3 border border-white/10">
        <textarea
          value={txt}
          onChange={e => setTxt(e.target.value)}
          placeholder="Paste notes or JSON…"
          className="w-full h-40 bg-black/30 rounded-xl p-3 text-sm outline-none border border-white/10 focus:border-cyan-400/50"
        />
        <button onClick={() => setTxt(SAMPLE)} className="text-xs text-cyan-400 hover:underline">
          Load sample
        </button>
        <div className="pt-1">
          <label className="text-xs text-white/60 block mb-1">Background Photo (from Photos / Files)</label>
          <input type="file" accept="image/*" onChange={e => bg(e.target.files?.[0])} className="text-sm" />
        </div>
        <label className="text-xs text-white/70 block">
          Overlay ({Math.round(s.overlay * 100)}%)
          <input type="range" min={0} max={1} step={0.05} value={s.overlay} onChange={e => setS({ ...s, overlay: +e.target.value })} className="w-full" />
        </label>
        <label className="text-xs text-white/70 block">
          Blur ({s.blur}px)
          <input type="range" min={0} max={12} value={s.blur} onChange={e => setS({ ...s, blur: +e.target.value })} className="w-full" />
        </label>
        <select value={s.palette} onChange={e => setS({ ...s, palette: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-sm">
          {['Dark Neon', 'Cyber Cyan', 'Minimal Mono', 'Pastel Glass'].map(p => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <button onClick={gen} disabled={busy} className="grad w-full rounded-xl py-3 font-bold flex justify-center items-center gap-2">
          <Sparkles size={18} />
          {busy ? 'Parsing…' : 'Generate'}
        </button>
      </div>
      <div className="space-y-3 flex flex-col items-center">
        <div className="flex gap-2 flex-wrap">
          {[
            [png, Download, 'PNG'],
            [pdf, Download, 'PDF'],
            [json, FileJson, 'JSON'],
            [share, Link2, 'Copy link'],
          ].map(([f, I, l]: any) => (
            <button key={l} onClick={f} className="glass px-3 py-2 rounded-xl text-xs font-medium flex gap-1.5 items-center hover:bg-white/10">
              <I size={14} />
              {l}
            </button>
          ))}
        </div>
        <ShowCard ref={ref} s={s} onChange={setS} />
      </div>
    </div>
  )
}
