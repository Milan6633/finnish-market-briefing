---
name: finnish-market-briefing
description: "Daily market briefing for a Finnish OMXH25 investor. Use when the user says \"news\", \"news update\", \"briefing\", \"morning briefing\", \"what's happening\", or \"market update\"; asks for a market update or a stock deep-dive (\"why is Nokia moving?\"); or wants market claims fact-checked. Covers ECB/Euribor macro, OMXH25 and all 25 constituents, analyst rating changes, earnings and dividend dates, Finnish macro, geopolitics, market-moving posts, and manufacturing/AI trends."
---

# Finnish Market Briefing

Produce a concise 2–5 minute briefing for a Finnish investor who tracks **OMXH25 (OMX Helsinki 25)** and works in manufacturing.

## First run in a session

- Read `references/briefing-spec.md` — full rules, formats, source priority, recurring themes.
- Read `references/omxh25-watchlist.md` — the 25 constituents when building the stock table.
- `references/output-template.md` holds the empty table shapes when a template helps.

## Procedure

1. **Pin the date and time** (Europe/Helsinki). Every freshness decision uses it.
2. **Global macro** — ECB deposit / main refinancing / marginal lending rates and last decision; Euribor 3m / 6m / 12m with direction; eurozone inflation and recession signals; Fed and S&P 500 / Nasdaq direction; tariffs, trade, sanctions. 3–5 bullets, numbers only, no filler.
3. **OMXH25** — index level, day / week / month / YoY change; top winners and losers; sector performance. Then a table of all 25 constituents (Price | Day % | YoY %), highlighting the core names.
4. **Analyst ratings** — search "<company> analyst rating upgrade downgrade <month year>" for the core names. Keep only reputable firms (see spec's Tier 1/2/3 list). Every row: company, action, new rating, price target (old → new if changed), firm, date. Unknown or unverifiable firms are excluded.
5. **Earnings** — any OMXH25 company reporting in the next 2 weeks. Table: Company | Report Date | Quarter | Consensus EPS. Verify against IR pages and a quote site.
6. **Dividends** — any ex-date or payment date within 30 days. Table: Company | Ex-Date | Payment Date | Dividend/Share | Yield. If none, state it explicitly.
7. **Geopolitics** — Russia–Ukraine, Middle East / Iran / Hormuz, US–China. 2–4 short paragraphs, always tied to energy, inflation, ECB, or OMXH25 consequences.
8. **Market-moving posts** — max 3–5 from the last 24h: Trump, Musk, Powell/Fed officials, Lagarde/ECB, Dimon, Huang. Paraphrase; give approximate time + timezone; explain the market reaction. Skip the whole subsection if nothing qualifies.
9. **Tech & manufacturing** — 2–3 AI / robotics / CNC developments, each with one sentence on why it matters for a machinist and an investor (Nokia angle where relevant).
10. **Market Impact Summary (CRITICAL)** — table Factor | Impact on portfolio/Finland; then one bottom-line sentence, one actionable insight with a date, and risk flags. Explicitly reference the ratings, earnings, and dividends above.

## Output shape

- Headers: 🌍 Global · 🇫🇮 Finland & OMXH25 · 🛢️ Geopolitics & posts · 🤖 Tech & manufacturing · 📊 Market impact.
- Markdown tables for index, stocks, ratings, earnings, dividends, impacts.
- Simple English, scannable, insight over headlines. No padding and no generic disclaimers.

## Hard rules

- **Search before you claim.** Never fabricate or guess a price, rate, rating, target, or date. If a figure cannot be verified, omit it or mark it "unverified".
- **Ratings need firm + date + target.** Never write "analysts say". Counts: posts ≤ 5; Section 1 bullets 3–5.
- **Note limits:** paywalls, stale sources, and conflicting figures between sources.
- **Freshness:** prefer sources updated within 24h; for war, oil, and markets prefer the last hour/day.
- Do not repeat unchanged news from an earlier briefing unless it has moved.
- Do not skip the Market Impact section.

## Special modes

- **Breaking news:** lead with the story, give a timeline, immediate market impact, relevant posts, scenario analysis (escalation/de-escalation), and close with "Say 'news update' anytime for the latest."
- **Stock deep-dive:** price vs 52-week high/low, YTD, catalysts, all recent ratings (firm/date/target), next earnings + consensus, next dividend + yield, bull vs bear case, risks, dated upcoming catalysts.
- **Fact-check:** table Claim | Verdict (✅ CONFIRMED / ⚠️ PARTIALLY CORRECT or UNVERIFIED / ❌ INCORRECT) | Notes. Search each claim separately and supply the correct figure when found.

## When data is missing

Say the gap once and move on. If markets are closed, say so and report the last session. Never fill a gap with invention.
