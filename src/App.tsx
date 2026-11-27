import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Home as HomeI, Wand2, CreditCard, User, Sparkles } from 'lucide-react'
import Create from './pages/Create'
import Public from './pages/Public'
import { Home, Subscription, Me } from './pages/Simple'

const tabs = [
  ['/', 'Home', HomeI],
  ['/create', 'Create', Wand2],
  ['/subscription', 'Plans', CreditCard],
  ['/me', 'Me', User],
] as const

function Shell() {
  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/40 border-b border-white/10 flex items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 text-white">
            <Sparkles size={16} />
          </span>
          <b className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">
            Showcaseify
          </b>
        </NavLink>
        <span className="text-xs font-medium glass px-3 py-1 rounded-full text-cyan-300 border border-cyan-400/20">
          Free
        </span>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/me" element={<Me />} />
      </Routes>

      <nav className="fixed bottom-0 inset-x-0 z-30 glass rounded-none border-t border-white/10 flex justify-around py-2.5 backdrop-blur-xl bg-zinc-950/85">
        {tabs.map(([to, l, I]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs transition-colors ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-white/60 hover:text-white'
              }`
            }
          >
            <I size={20} />
            {l}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/p/:id" element={<Public />} />
        <Route path="*" element={<Shell />} />
      </Routes>
    </BrowserRouter>
  )
}
