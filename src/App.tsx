import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Home as HomeI, Wand2, CreditCard, User } from 'lucide-react'
import Create from './pages/Create'
import Public from './pages/Public'
import { Home, Subscription, Me } from './pages/Simple'
const tabs = [['/', 'Home', HomeI], ['/create', 'Create', Wand2], ['/subscription', 'Plans', CreditCard], ['/me', 'Me', User]] as const
function Shell() {
  return <div className="pb-20">
    <header className="flex items-center justify-between p-4"><b className="text-xl bg-clip-text text-transparent grad">Showcaseify</b><span className="text-xs glass px-2 py-1">Free</span></header>
    <Routes>
      <Route path="/" element={<Home />} /><Route path="/create" element={<Create />} />
      <Route path="/subscription" element={<Subscription />} /><Route path="/me" element={<Me />} />
    </Routes>
    <nav className="fixed bottom-0 inset-x-0 glass rounded-none flex justify-around py-2">
      {tabs.map(([to, l, I]) => <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-cyan-400' : 'text-white/60'}`}><I size={20} />{l}</NavLink>)}
    </nav></div>
}
export default function App() {
  return <BrowserRouter><Routes><Route path="/p/:id" element={<Public />} /><Route path="*" element={<Shell />} /></Routes></BrowserRouter>
}
