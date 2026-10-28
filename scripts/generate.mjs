#!/usr/bin/env node
/**
 * Generates one Finnish market briefing and writes it to briefings/YYYY-MM-DD.md
 *
 * Data: Yahoo Finance chart API (quotes), ECB Data Portal (policy rates),
 * euribor-rates.eu (Euribor), Google News RSS (headlines).
 * Writer: DeepSeek API when DEEPSEEK_API_KEY is set, otherwise GitHub Models
 * via GITHUB_TOKEN (requires `models: read`).
 *
 * The model cannot browse. It only sees the DATA block built below, and is
 * instructed to say "unavailable" instead of inventing numbers.
 *
 * Usage: node scripts/generate.mjs [--dry-run]
 */
import { mkdir, writeFile, readdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const BRIEFINGS = join(ROOT, 'briefings')
const DRY = process.argv.includes('--dry-run')
const UA = 'Mozilla/5.0 (compatible; finnish-market-briefing/1.0)'
const TZ = 'Europe/Helsinki'

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date())

const COMPANIES = [
  ['Nokia', 'NOKIA.HE', true], ['Nordea', 'NDA-FI.HE', true], ['Sampo', 'SAMPO.HE', true],
  ['KONE', 'KNEBV.HE', true], ['Neste', 'NESTE.HE', true], ['Fortum', 'FORTUM.HE', true],
  ['UPM-Kymmene', 'UPM.HE', true], ['Wärtsilä', 'WRT1V.HE', true], ['Metso', 'METSO.HE', true],
  ['Konecranes', 'KCR.HE', true], ['Valmet', 'VALMT.HE', true], ['Outokumpu', 'OUT1V.HE', true],
  ['Stora Enso', 'STERV.HE', false], ['Orion', 'ORNBV.HE', false], ['Huhtamäki', 'HUH1V.HE', false],
  ['Kesko', 'KESKOB.HE', false], ['Elisa', 'ELISA.HE', false], ['Kojamo', 'KOJAMO.HE', false],
  ['Metsä Board', 'METSB.HE', false], ['Puuilo', 'PUUILO.HE', false], ['Qt Group', 'QTCOM.HE', false],
  ['TietoEVRY', 'TIETO.HE', false], ['Cargotec', 'CGCBV.HE', false], ['Kemira', 'KEMIRA.HE', false],
  ['Nokian Renkaat', 'TYRES.HE', false],
]

const QUERIES = [
  ['macro', 'ECB OR "Federal Reserve" OR inflation OR tariffs', 1],
  ['finland', '"OMX Helsinki" OR OMXH25 OR "Finnish economy"', 2],
  ['ratings', '(Nokia OR Nordea OR Fortum OR Neste OR Kone OR Sampo OR Wärtsilä OR Metso OR UPM OR Valmet OR Outokumpu) (upgraded OR downgraded OR "price target" OR rating)', 7],
  ['earnings', '(Nokia OR Nordea OR Sampo OR Fortum OR Metso OR Kone OR Wärtsilä) (earnings OR "Q3 2026" OR "Q4 2026")', 7],
  ['dividends', '(dividend OR "ex-dividend") (Nokia OR Nordea OR Sampo OR Fortum OR UPM OR Kesko)', 7],
  ['geopolitics', 'Iran OR Hormuz OR Ukraine OR Russia sanctions OR "Red Sea"', 1],
  ['posts', '(Trump OR Musk) (tariff OR Iran OR Tesla OR DOGE OR crypto OR AI)', 1],
  ['tech', 'AI manufacturing OR CNC OR robotics OR "industrial automation"', 1],
]

const pct = (a, b) => (a != null && b != null && b !== 0 ? ((a / b) - 1) * 100 : null)
const fmt = (v, d = 2) => (v == null || Number.isNaN(v) ? 'n/a' : v.toFixed(d))

async function get(url, timeout = 25000) {
  const r = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json, application/xml, text/xml, */*' },
    signal: AbortSignal.timeout(timeout),
  })
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`)
  return r.text()
}

async function quote(symbol) {
  try {
    const raw = await get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d`)
    const res = JSON.parse(raw)?.chart?.result?.[0]
    const meta = res?.meta
    const closes = res?.indicators?.quote?.[0]?.close ?? []
    const stamps = res?.timestamp ?? []
    const pairs = []
    for (let i = 0; i < closes.length; i++) {
      if (closes[i] != null && stamps[i] != null) pairs.push({ t: stamps[i], c: closes[i] })
    }
    if (!meta || pairs.length < 25) return null
    const off = meta.gmtoffset ?? 0
    const dayKey = (sec) => new Date((sec + off) * 1000).toISOString().slice(0, 10)
    const lastPrice = meta.regularMarketPrice ?? pairs[pairs.length - 1].c
    const lastBar = pairs[pairs.length - 1]
    // When the newest bar belongs to the session the live price is in (its close
    // is still undefined), the previous close is that bar; otherwise it is the
    // bar before it. Comparing straight to closes[-2] silently skips a session.
    const prev = dayKey(lastBar.t) === dayKey(meta.regularMarketTime ?? lastBar.t)
      ? pairs[pairs.length - 2].c
      : lastBar.c
    const back = (n) => pairs[Math.max(0, pairs.length - n)]?.c
    return {
      symbol,
      price: lastPrice,
      currency: meta.currency ?? 'EUR',
      day: pct(lastPrice, prev),
      week: pct(lastPrice, back(6)),
      month: pct(lastPrice, back(22)),
      yoy: pct(lastPrice, pairs[0].c),
      asOf: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : null,
    }
  } catch (e) {
    console.warn(`quote ${symbol}: ${e.message}`)
    return null
  }
}

async function ecbRate(series) {
  try {
    const raw = await get(`https://data-api.ecb.europa.eu/service/data/FM/${series}?format=jsondata&lastNObservations=1`, 45000)
    const j = JSON.parse(raw)
    const dataset = j?.dataSets?.[0]?.series
    const key = dataset ? Object.keys(dataset)[0] : null
    if (!key) return null
    const obs = dataset[key].observations
    const first = obs[Object.keys(obs)[0]]
    const level = Array.isArray(first) ? first[0] : null
    const period = j?.structure?.dimensions?.observation?.[0]?.values?.[0]?.id ?? null
    return level == null ? null : { level, period }
  } catch (e) {
    console.warn(`ecb ${series}: ${e.message}`)
    return null
  }
}

async function euribor(months) {
  const id = { 3: 2, 6: 3, 12: 4 }[months]
  try {
    const html = await get(`https://www.euribor-rates.eu/en/current-euribor-rates/${id}/euribor-rate-${months}-months/`)
    const rows = [...html.matchAll(/<tr><td>(\d{1,2}\/\d{1,2}\/\d{4})<\/td><td class="text-right">([\d.]+) %<\/td><\/tr>/g)]
    if (!rows.length) return null
    const latest = Number(rows[0][2])
    const previous = rows[1] ? Number(rows[1][2]) : null
    const [mm, dd, yyyy] = rows[0][1].split('/')
    return { level: latest, date: `${yyyy}-${mm}-${dd}`, change: previous == null ? null : latest - previous }
  } catch (e) {
    console.warn(`euribor ${months}m: ${e.message}`)
    return null
  }
}

function decode(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')
    .trim()
}

async function headlines(query, days, limit = 8) {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${query} when:${days}d`)}&hl=en-US&gl=US&ceid=US:en`
    const xml = await get(url, 30000)
    const items = []
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const block = m[1]
      const title = decode(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')
      const date = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? ''
      const source = decode(block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? '')
      if (!title) continue
      items.push({ title: title.replace(/\s+-\s+[^-]{2,40}$/, ''), source, date: date ? new Date(date) : null })
      if (items.length >= limit) break
    }
    return items
  } catch (e) {
    console.warn(`news "${query}": ${e.message}`)
    return []
  }
}

function headlineLines(items) {
  if (!items.length) return ['- (none found)']
  return items.map((i) => {
    const d = i.date ? i.date.toISOString().slice(0, 10) : 'date n/a'
    return `- [${d}] ${i.title}${i.source ? ` (${i.source})` : ''}`
  })
}

async function buildData() {
  const idx = await quote('^OMXH25')
  const rows = []
  for (let i = 0; i < COMPANIES.length; i += 6) {
    const batch = COMPANIES.slice(i, i + 6)
    const results = await Promise.all(batch.map(async ([name, ticker, core]) => ({ name, ticker, core, q: await quote(ticker) })))
    rows.push(...results)
  }
  const [dfr, mrr, mlfr] = await Promise.all([
    ecbRate('D.U2.EUR.4F.KR.DFR.LEV'),
    ecbRate('D.U2.EUR.4F.KR.MRR_FR.LEV'),
    ecbRate('D.U2.EUR.4F.KR.MLFR.LEV'),
  ])
  const [e3, e6, e12] = await Promise.all([euribor(3), euribor(6), euribor(12)])
  const news = {}
  for (const [key, q, days] of QUERIES) news[key] = await headlines(q, days)

  const seen = new Set()
  for (const k of Object.keys(news)) {
    news[k] = news[k].filter((n) => {
      const key = n.title.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }
  return { idx, rows, dfr, mrr, mlfr, e3, e6, e12, news }
}

function dataPack(d) {
  const L = []
  L.push(`DATE: ${today} (Europe/Helsinki)`)
  L.push('')
  L.push('## POLICY RATES (ECB Data Portal, official)')
  L.push(`- Deposit facility: ${d.dfr ? `${fmt(d.dfr.level)}% (as of ${d.dfr.period})` : 'unavailable'}`)
  L.push(`- Main refinancing: ${d.mrr ? `${fmt(d.mrr.level)}% (as of ${d.mrr.period})` : 'unavailable'}`)
  L.push(`- Marginal lending: ${d.mlfr ? `${fmt(d.mlfr.level)}% (as of ${d.mlfr.period})` : 'unavailable'}`)
  L.push('')
  L.push('## EURIBOR (euribor-rates.eu; change vs previous publication)')
  for (const [label, e] of [['3m', d.e3], ['6m', d.e6], ['12m', d.e12]]) {
    L.push(e ? `- ${label}: ${fmt(e.level, 3)}% on ${e.date} (${e.change == null ? 'change n/a' : `${e.change >= 0 ? '+' : ''}${fmt(e.change, 3)}`})` : `- ${label}: unavailable`)
  }
  L.push('')
  L.push('## OMXH25 INDEX')
  L.push(d.idx
    ? `- Level ${fmt(d.idx.price)} | day ${fmt(d.idx.day)}% | week ${fmt(d.idx.week)}% | month ${fmt(d.idx.month)}% | YoY ${fmt(d.idx.yoy)}%`
    : '- unavailable')
  L.push('')
  L.push('## CONSTITUENT QUOTES (Yahoo Finance, EUR, day/week/month/YoY)')
  L.push('| Company | Ticker | Price | Day % | Week % | Month % | YoY % |')
  L.push('|---|---|---:|---:|---:|---:|---:|')
  for (const r of d.rows) {
    L.push(r.q
      ? `| ${r.name}${r.core ? ' *' : ''} | ${r.ticker} | ${fmt(r.q.price)} | ${fmt(r.q.day)} | ${fmt(r.q.week)} | ${fmt(r.q.month)} | ${fmt(r.q.yoy)} |`
      : `| ${r.name}${r.core ? ' *' : ''} | ${r.ticker} | unavailable | n/a | n/a | n/a | n/a |`)
  }
  L.push('(* = core watchlist name)')
  L.push('')
  const sections = [
    ['MACRO HEADLINES', 'macro'], ['FINLAND / HELSINKI HEADLINES', 'finland'],
    ['RATING / TARGET HEADLINES', 'ratings'], ['EARNINGS HEADLINES', 'earnings'],
    ['DIVIDEND HEADLINES', 'dividends'], ['GEOPOLITICS HEADLINES', 'geopolitics'],
    ['TRUMP / MUSK HEADLINES', 'posts'], ['TECH / MANUFACTURING HEADLINES', 'tech'],
  ]
  for (const [title, key] of sections) {
    L.push(`## ${title}`)
    L.push(...headlineLines(d.news[key]))
    L.push('')
  }
  return L.join('\n')
}

function renderDigest(d) {
  const L = []
  L.push(`# 🌍 Market Briefing — ${today}`)
  L.push('')
  L.push('> **Data-only edition.** No model key is configured, so this is a straight digest of verified numbers and sourced headlines — no narrative synthesis.')
  L.push('')
  L.push('## 🌍 Global')
  L.push('')
  L.push('| Rate | Level | As of |')
  L.push('|---|---:|---|')
  L.push(`| ECB deposit facility | ${d.dfr ? `${fmt(d.dfr.level)}%` : 'unavailable'} | ${d.dfr?.period ?? '—'} |`)
  L.push(`| ECB main refinancing | ${d.mrr ? `${fmt(d.mrr.level)}%` : 'unavailable'} | ${d.mrr?.period ?? '—'} |`)
  L.push(`| ECB marginal lending | ${d.mlfr ? `${fmt(d.mlfr.level)}%` : 'unavailable'} | ${d.mlfr?.period ?? '—'} |`)
  L.push(`| Euribor 3m | ${d.e3 ? `${fmt(d.e3.level, 3)}%` : 'unavailable'} | ${d.e3?.date ?? '—'} |`)
  L.push(`| Euribor 6m | ${d.e6 ? `${fmt(d.e6.level, 3)}%` : 'unavailable'} | ${d.e6?.date ?? '—'} |`)
  L.push(`| Euribor 12m | ${d.e12 ? `${fmt(d.e12.level, 3)}%` : 'unavailable'} | ${d.e12?.date ?? '—'} |`)
  L.push('')
  L.push(`**OMXH25:** ${d.idx ? `${fmt(d.idx.price)} · day ${fmt(d.idx.day)}% · week ${fmt(d.idx.week)}% · month ${fmt(d.idx.month)}% · YoY ${fmt(d.idx.yoy)}%` : 'unavailable'}`)
  L.push('')
  L.push('## 🇫🇮 OMXH25 constituents')
  L.push('')
  L.push('| Company | Ticker | Price | Day % | Week % | Month % | YoY % |')
  L.push('|---|---|---:|---:|---:|---:|---:|')
  for (const r of d.rows) {
    L.push(r.q
      ? `| ${r.name}${r.core ? ' *' : ''} | ${r.ticker} | ${fmt(r.q.price)} | ${fmt(r.q.day)} | ${fmt(r.q.week)} | ${fmt(r.q.month)} | ${fmt(r.q.yoy)} |`
      : `| ${r.name}${r.core ? ' *' : ''} | ${r.ticker} | unavailable | n/a | n/a | n/a | n/a |`)
  }
  L.push('')
  const ranked = d.rows.filter((r) => r.q && r.q.day != null).sort((a, b) => b.q.day - a.q.day)
  if (ranked.length) {
    const winners = ranked.slice(0, 3)
    const losers = ranked.slice(-3).reverse()
    L.push('**Top movers (day):** ' + [
      ...winners.map((r) => `${r.name} ${fmt(r.q.day)}%`),
      ...losers.map((r) => `${r.name} ${fmt(r.q.day)}%`),
    ].join(' · '))
    L.push('')
  }
  const sections = [
    ['Global macro headlines', 'macro'], ['Finland headlines', 'finland'],
    ['Rating / target headlines', 'ratings'], ['Earnings headlines', 'earnings'],
    ['Dividend headlines', 'dividends'], ['Geopolitics headlines', 'geopolitics'],
    ['Trump / Musk headlines', 'posts'], ['Tech / manufacturing headlines', 'tech'],
  ]
  for (const [title, key] of sections) {
    L.push(`## ${title}`)
    L.push('')
    L.push(...headlineLines(d.news[key]))
    L.push('')
  }
  L.push('---')
  L.push('')
  L.push('Headlines are unverified RSS titles. Add a `DEEPSEEK_API_KEY` repository secret for the full narrated briefing.')
  return L.join('\n')
}

function loadSpec() {
  try {
    const raw = readFileSync(join(ROOT, 'SKILL.md'), 'utf8')
    return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  } catch {
    return 'Produce a concise Finnish market briefing for an OMXH25 investor.'
  }
}

async function askModel(pack) {
  const spec = loadSpec()
  const system = `${spec}

---
AUTOMATION RUNTIME — READ CAREFULLY
You are running unattended inside GitHub Actions. You have NO web access and cannot browse.
The DATA block below is everything you know. Rules:
- Use only figures, names and dates present in DATA. Never invent a number, rating, target, date or headline.
- If something the spec asks for is missing (e.g. no rating headlines), write "No verified data available" for that item or omit the row. Do not guess.
- Headlines are unverified third-party RSS titles. Only report what a headline states, keep the source name, and never infer a number from a headline you cannot read.
- Never output a rating row unless the headline names the analyst firm and the date.
- Output ONLY the briefing markdown, starting with a level-1 heading. No preamble, no code fences, no closing commentary.`

  const user = `DATA:\n${pack}\n\nProduce today's briefing now.`

  const deepseekKey = process.env.DEEPSEEK_API_KEY
  if (!deepseekKey) throw new Error('DEEPSEEK_API_KEY is not set')
  const url = 'https://api.deepseek.com/chat/completions'
  const model = process.env.MODEL || 'deepseek-chat'
  const key = deepseekKey

  const body = {
    model,
    temperature: 0.3,
    max_tokens: 4000,
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
  }

  let lastErr
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(180000),
      })
      const text = await r.text()
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${text.slice(0, 300)}`)
      const json = JSON.parse(text)
      const content = json?.choices?.[0]?.message?.content
      if (!content) throw new Error('Empty completion')
      return content.replace(/^```(?:markdown)?\s*/i, '').replace(/```\s*$/, '').trim()
    } catch (e) {
      lastErr = e
      console.warn(`model attempt ${attempt} failed: ${e.message}`)
      await new Promise((res) => setTimeout(res, 5000 * attempt))
    }
  }
  throw lastErr
}

async function writeOutput(markdown) {
  await mkdir(BRIEFINGS, { recursive: true })
  const file = join(BRIEFINGS, `${today}.md`)
  await writeFile(file, `${markdown}\n`, 'utf8')

  const files = (await readdir(BRIEFINGS)).filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort().reverse()
  const index = files.map((f) => ({ date: f.slice(0, 10), file: f }))
  await writeFile(join(BRIEFINGS, 'index.json'), JSON.stringify({ updated: new Date().toISOString(), briefings: index }, null, 2), 'utf8')
  console.log(`wrote ${file} (${files.length} total)`)
}

async function main() {
  console.log(`generating briefing for ${today}`)
  const data = await buildData()
  const pack = dataPack(data)
  if (DRY) {
    console.log(pack)
    return
  }
  const markdown = await (async () => {
    try {
      return await askModel(pack)
    } catch (e) {
      console.warn(`model unavailable (${e.message}); writing data-only digest`)
      return renderDigest(data)
    }
  })()
  if (!markdown.startsWith('#')) throw new Error('Model returned unexpected output')
  await writeOutput(markdown)
}

main().catch((e) => {
  console.error(`FAILED: ${e.message}`)
  process.exit(1)
})
