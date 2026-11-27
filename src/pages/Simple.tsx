import { useState } from 'react'
import { Link } from 'react-router-dom'
import { listProjects, deleteProject } from '../lib/store'
const FEED = ['Progress Dashboard', 'SaaS Launch', 'Client Milestone', 'Social Carousel']
export const Home = () => <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{FEED.map((f, i) =>
  <div key={f} className="glass p-4"><h3 className="font-bold">{f} #{i + 1}</h3>
    <p className="text-sm text-white/60">Load public projects from Supabase here.</p>
    <Link to="/create" className="text-cyan-400 text-sm">Use this template</Link></div>)}</div>
export const Subscription = () => <div className="p-4 grid md:grid-cols-3 gap-4">{[['Free', '$0'], ['Pro', '$19/mo'], ['Agency', '$49/mo']].map(([n, p]) =>
  <div key={n} className="glass p-5"><h3 className="text-xl font-bold">{n}</h3><p className="text-2xl my-2">{p}</p>
    <button className="grad rounded-xl px-4 py-2 font-bold" onClick={() => alert('Wire Stripe/Paystack checkout here')}>Choose {n}</button></div>)}</div>
export function Me() {
  const [l, setL] = useState(listProjects())
  return <div className="p-4 grid sm:grid-cols-2 gap-4">{l.length === 0 && <p>No saved projects yet. Create one and copy its link.</p>}
    {l.map(p => <div key={p.id} className="glass p-4"><b>{p.title}</b>
      <div className="flex gap-3 text-sm mt-2"><Link to={`/p/${p.id}`} className="text-cyan-400">Open</Link>
        <button onClick={() => { deleteProject(p.id); setL(listProjects()) }}>Delete</button></div></div>)}</div>
}
