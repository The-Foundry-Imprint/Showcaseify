import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShowCard } from '../components/ShowCard'
import { getProject } from '../lib/store'
import type { Showcase } from '../services/aiParser'
export default function Public() {
  const { id } = useParams(), [s, setS] = useState<Showcase | null | undefined>(undefined)
  useEffect(() => { getProject(id!).then(setS) }, [id])
  if (s === undefined) return <p className="p-8">Loading…</p>
  if (!s) return <p className="p-8">This showcase doesn't exist or isn't public.</p>
  return <div className="min-h-screen grid place-items-center p-4 pb-20"><ShowCard s={s} />
    {s.plan === 'free' && <Link to="/create" className="fixed bottom-0 inset-x-0 grad text-center py-3 font-bold">Want to create a showcase like this? Build yours on Showcaseify in 30 seconds.</Link>}</div>
}
