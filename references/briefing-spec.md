# Briefing spec — full rules

Audience: Milan — mechanical engineer / CNC machinist at Planmeca in Finland, invests in Finnish stocks, learning Finnish. Primary index: **OMXH25 (OMX Helsinki 25)**. Target: 2–5 minute morning read, weekdays.

Always insert today's date in search queries. For fast-moving stories search the most recent hour/day.

---

## Section 1 — Global economic news

Cover, in 3–5 bullets with numbers:

- ECB interest rate decisions: deposit rate, main refinancing, marginal lending.
- Euribor 3m / 6m / 12m — with direction (up/down vs previous).
- Eurozone inflation trends and recession signals.
- U.S. Federal Reserve moves and S&P 500 / Nasdaq direction.
- Global trade: tariffs, trade wars, sanctions.

Sources: ECB official releases, Euribor-rates.eu or equivalent, Reuters, Bloomberg, FT.

---

## Section 2 — Finland & OMXH25

### A. Index overview

- OMXH25 level, daily / weekly / monthly change, YoY return.
- Top movers (winners and losers, % change).
- Sector performance: Energy, Industrials, Financials, Tech, Materials.

### B. Company watchlist

Track all 25 constituents; highlight the core names. See `omxh25-watchlist.md`.

### C. Analyst rating changes — IMPORTANT

Include whenever an OMXH25 company is upgraded or downgraded:

```
📊 RATING CHANGE:
| Company | Action | New Rating | Price Target | Analyst Firm | Date |
| Nokia | ⬆ Upgraded | Buy | €12.50 | Goldman Sachs | Oct 15, 2026 |
| Fortum | ⬇ Downgraded | Hold | €20.00 | Morgan Stanley | Oct 14, 2026 |
```

Trusted firms only:

- **Tier 1 (global):** Goldman Sachs, Morgan Stanley, J.P. Morgan, UBS, Barclays, Deutsche Bank, Citi, BofA/Merrill Lynch, HSBC, Jefferies.
- **Tier 2 (Nordic specialists):** Nordea Markets, SEB, Danske Bank, Handelsbanken, DNB Markets, Carnegie, Pareto Securities, Inderes.
- **Tier 3 (other reputable):** Santander, Bernstein, Kepler Cheuvreux, Berenberg.

Rules:

- Always name the analyst firm — never "analysts say".
- Always include the date the rating was issued.
- Include the price target, old → new if changed.
- If several firms rated the same stock in a week, list all of them.
- Search pattern: "<company name> analyst rating upgrade downgrade <current month year>".
- Do NOT include unknown, small, or unverifiable firms.

### D. Upcoming earnings — IMPORTANT

Any OMXH25 company reporting within the next 2 weeks:

```
📅 EARNINGS CALENDAR:
| Company | Report Date | Quarter | Consensus EPS |
| Nokia | Oct 22, 2026 | Q3 2026 | €0.06 |
```

Search "<company> earnings date Q[x] <year>"; verify against company IR pages and Yahoo Finance / MarketScreener.

### E. Upcoming dividends — IMPORTANT

Any ex-date or payment date within ~30 days:

```
💰 DIVIDEND ALERT (next 30 days):
| Company | Ex-Date | Payment Date | Dividend/Share | Yield |
| Nordea | Nov 5, 2026 | Nov 12, 2026 | €0.92 | 5.4% |
```

Most Finnish companies pay in March–May; interim dividends exist. Search "<company> dividend date <year>" or check IR pages. If nothing is due: "No OMXH25 dividends due in the next 30 days."

### F. Finnish economy

Finnish GDP, unemployment, inflation when updated; government budget/fiscal news; Bank of Finland (Suomen Pankki) forecasts.

Sources: TradingEconomics (Finland), Kauppalehti (public headlines only), Yle Uutiset (talous), OECD Finland snapshot, Bank of Finland bulletins, Inderes.fi, Yahoo Finance, MarketScreener.

Output: index summary table + stock table (Price | Day% | YoY%) + rating / earnings / dividend tables when applicable.

---

## Section 3 — Geopolitics + key social posts

### A. Geopolitical developments

- Russia–Ukraine: military developments, sanctions, energy/oil impact.
- Middle East / Iran: war status, Strait of Hormuz shipping, ceasefire talks.
- US–China trade tensions, tariffs.
- Any other event with direct market impact.

Always connect to economic/market consequences, not just military detail. 2–4 paragraphs.

### B. Market-moving posts — IMPORTANT

Accounts to track: Donald Trump (Truth Social), Elon Musk (X), Jerome Powell / Fed officials, Christine Lagarde / ECB, Jamie Dimon, Jensen Huang.

```
📱 KEY POSTS:
🟠 TRUTH SOCIAL — Trump (Oct 14, 8:32 PM ET):
"Iran has ONE LAST CHANCE to make a deal..."
→ Impact: Oil futures jumped 2.1% in after-hours trading

🔵 X — Elon Musk (Oct 14, 3:15 PM ET):
Commented on DOGE finding "$2B in duplicate contracts"
→ Impact: Government efficiency narrative — minor positive for defense stocks
```

Rules:

- Maximum 3–5 posts per briefing, only the most impactful.
- Always explain market impact, not just the quote.
- Paraphrase rather than quoting verbatim where possible.
- Include approximate posting time with timezone.
- Trump posts on tariffs, Iran, trade deals, or sanctions → always include.
- Musk posts on Tesla production, AI, DOGE savings, or crypto → include if market-moving.
- If no market-moving posts in the last 24h, skip this subsection entirely.
- Exclude memes, personal attacks, non-economic commentary.

Search: "Trump Truth Social <topic> <date>", "Elon Musk X post <topic> <date>", plus Reuters/Bloomberg for market reaction. Al Jazeera, BBC, AP for geopolitics.

---

## Section 4 — Technology & future trends

- AI developments: new models, corporate adoption, agentic AI.
- Impact on manufacturing jobs and the skills gap.
- Robotics and automation in factories.
- AI in networking/telecom (Nokia relevance).
- Tech layoffs and job-market shifts.

Special angle: always connect to manufacturing/machinist relevance — how CNC + AI/PLC skills create employability advantage. 2–3 developments, one sentence each on why it matters.

Sources: TechCrunch, Wired, Ars Technica, Nvidia GTC, industry reports, manufacturing-focused AI news.

---

## Section 5 — Market impact summary — CRITICAL

Connect all news from Sections 1–4 to concrete impacts:

- Which OMXH25 stocks are affected, by name?
- The Finnish economy broadly?
- Someone investing on OMX Helsinki?
- Manufacturing / machining in Finland?

Format: table Factor | Impact on portfolio/Finland.

Must include:

- One clear bottom-line sentence.
- One actionable insight (e.g. "Watch Nokia Q3 earnings Oct 22").
- Risk flags when relevant (e.g. "If the ceasefire collapses, oil could spike to $130").
- References to rating changes, earnings, and dividends from Section 2.

---

## Operating rules

### Accuracy & cross-checking

- Always search multiple sources before presenting a number or fact.
- If sources conflict, note the conflict.
- Never fabricate or guess missing data.
- Paywalled sources (e.g. Kauppalehti premium): use public info only and note the limitation.

### Analyst ratings accuracy

- NEVER invent ratings or price targets.
- Verify firm, date, and target from at least one source.
- Exclude questionable or unknown firms.
- Preferred verification: MarketScreener, Yahoo Finance, TipRanks, Bloomberg.

### Freshness

- Use today's date in queries.
- Prefer sources updated within 24h.
- Social posts: last 24h unless they triggered a lasting market move.

### Paywall handling

- Do not assume access to premium content.
- Use public headlines/summaries; cross-reference free sources (Yle, Reuters, TradingEconomics).
- State clearly when details are paywalled.

---

## Tone & style

- Concise; no padding.
- Clear English, simple sentences.
- Headers, tables, bullets for scannability.
- Explain WHY it matters, not just headlines.
- Personal relevance: Finnish investing + machining career.
- Emojis sparingly for section headers (🌍 🇫🇮 🛢️ 📡 📊 🤖 📱 💰).

---

## Data source priority

| Priority | Source | Use for |
|---|---|---|
| 1 | ECB official site | Rate decisions, policy statements |
| 1 | Euribor-rates.eu | Daily Euribor |
| 1 | TradingEconomics | OMXH25 index, quotes, macro |
| 1 | Yahoo Finance | Prices, analyst targets, earnings dates |
| 1 | Inderes.fi | Finnish analyst ratings (free summaries) |
| 2 | Reuters, Bloomberg | Breaking market/economic news |
| 2 | MarketScreener | Rating history, quotes |
| 2 | Yle Uutiset | Finnish economic news |
| 2 | Kauppalehti | Finnish business headlines |
| 2 | Bank of Finland | Finnish GDP, inflation, forecasts |
| 2 | Truth Social / X via news aggregators | Trump, Musk posts |
| 3 | Al Jazeera, BBC, AP | Geopolitics |
| 3 | IranIntl, straits.live | Hormuz shipping data |
| 3 | OECD Finland | Economic snapshot |
| 3 | Wikipedia current events | Timeline verification |
| 4 | J.P. Morgan, IEA | Oil forecasts, energy analysis |
| 4 | TipRanks | Rating consensus |
| 4 | Company IR pages | Earnings, dividends |

---

## Recurring context (treat as background, verify before reuse)

1. **Iran war & Hormuz crisis** (from Feb 28, 2026) — US–Israel strikes, Hormuz closure, ceasefire cycles, oil $60 → $120 peak → $80–105 range, Islamabad Memorandum (June 17, 2026). Impact: energy costs, inflation, ECB policy.
2. **UAE left OPEC** (April 28, 2026) — OPEC fracturing; long-term supply implications.
3. **Nokia AI transformation** — Nvidia $1B investment (Oct 2025), AI-RAN partnership with T-Mobile, stock €4.48 low → €15.00 high → ~€8.73 pullback, Q3 earnings Oct 22, 2026.
4. **ECB rate policy** — deposit rate held at 2.00%; oil-driven inflation creates hike risk; elevated Euribor pressures Finnish mortgages.
5. **Finland's recovery** — GDP +0.8% in 2026 (OECD), unemployment >10%, 2027 budget €92.5B, 95% non-fossil electricity, defence/medtech demand; weak German exports and energy import exposure.
6. **AI in manufacturing** — 52,000+ tech layoffs in Q1 2026, but a growing manufacturing skills gap: CNC + AI literacy is a premium combination; agentic AI moving onto production floors.

These are prior-conversation storylines, not verified current facts — re-check any figure before repeating it.

---

## What not to do

- No generic disclaimers ("as always, do your own research…").
- Don't repeat unchanged news.
- Don't include news irrelevant to Finland, investing, or manufacturing.
- Don't fabricate targets, prices, or ratings — always search first.
- Don't assume paywalled access.
- Don't skip the Market Impact section.
- Keep the English simple; keep the read under 5 minutes.
- No social posts without market impact.
- No ratings without firm and date.
- Never miss upcoming earnings or dividend dates.
