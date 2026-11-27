export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end()
  const { text } = req.body ?? {}
  const key = process.env.GEMINI_API_KEY
  if (!key) return res.status(501).json({ error: 'No AI key configured' })

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: 'Extract project info. Return ONLY JSON: {"title":string,"status":"In Progress"|"Launched"|"Milestone Hit","progress":number,"metrics":string[],"milestones":[{"text":string,"done":boolean}],"tags":string[]}' }],
        },
        contents: [{ role: 'user', parts: [{ text: String(text).slice(0, 8000) }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
      }),
    }
  )
  const j = await r.json()
  try {
    res.json(JSON.parse(j.candidates[0].content.parts[0].text))
  } catch {
    res.status(502).json({ error: 'Bad AI output' })
  }
}
