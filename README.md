# Finnish Market Briefing

An **OMXH25 morning briefing** for a Finnish investor — and the automation that publishes it every weekday.

It exists in two forms:

1. **A skill** you can install into an agent (DeepSeek Harness, or any tool that reads `.agents/skills`), so asking "news" produces a briefing with live research.
2. **A GitHub Actions pipeline** that generates the briefing on a schedule, commits it, and publishes it to GitHub Pages — your PC can be off.

Live site: <https://milan6633.github.io/finnish-market-briefing/>

---

## Use it as a skill

```bash
git clone https://github.com/Milan6633/finnish-market-briefing .agents/skills/finnish-market-briefing
```

Then say **"news"**, "morning briefing", "market update", or ask "why is Nokia moving?".

The skill files are:

| File | Purpose |
|---|---|
| `SKILL.md` | Routing description, run procedure, output contract, hard rules |
| `references/briefing-spec.md` | Full spec: sections, rating-firm tiers, formats, sources |
| `references/omxh25-watchlist.md` | The 25 constituents and core names |
| `references/output-template.md` | Blank briefing skeleton |

It works with any agent that supports the `SKILL.md` convention; no keys are needed, because the agent searches the web itself.

---

## How the automation works

```
03:30 UTC Mon–Fri
   └─ GitHub Actions
        ├─ scripts/generate.mjs
        │    ├─ Yahoo Finance   → OMXH25 index + 25 constituent quotes
        │    ├─ ECB Data Portal → deposit / main refinancing / marginal lending
        │    ├─ euribor-rates.eu → 3m / 6m / 12m Euribor + daily change
        │    └─ Google News RSS  → macro, Finland, ratings, earnings,
        │                          dividends, geopolitics, Trump/Musk, tech
        ├─ model writes the briefing (GitHub Models, or DeepSeek if key set)
        ├─ commits briefings/YYYY-MM-DD.md
        └─ deploys the site + archive to GitHub Pages
```

### Schedule and daylight saving

GitHub cron is UTC; Finland shifts between EET (UTC+2) and EEST (UTC+3). `30 3 * * 1-5` lands at **06:30 in summer** and **05:30 in winter**. If you prefer a fixed local hour, change the cron in `.github/workflows/briefing.yml`.

### Enable it on your fork

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. *(Optional)* Add a repository secret `DEEPSEEK_API_KEY` for better prose; otherwise it uses GitHub Models with the built-in `GITHUB_TOKEN` (`models: read`), which is free but rate-limited.
3. Run the **Daily briefing** workflow once from the Actions tab to generate the first entry.

Optional repository variable `MODEL` overrides the model id.

---

## Honest limitations

- **The model does not browse.** In automation it only sees the DATA block the script assembles. Missing data is reported as unavailable, never invented.
- **Analyst ratings** are extracted only from headlines that name a firm and a date. If none qualify, the briefing says so.
- **Earnings and dividend dates** are covered only to the extent headlines report them. Treat them as leads, not a confirmed calendar.
- **Quotes** come from Yahoo's public chart endpoint; they can be delayed or briefly unavailable, and two constituents (Kojamo, Cargotec) may not resolve.
- **Headlines** are unverified third-party RSS titles used for personal, non-commercial briefing generation.
- The **skill** version is stronger than the automated one, because a live agent can search and cross-check every claim.

Nothing here is investment advice.

---

## Local run

```bash
node scripts/generate.mjs --dry-run   # print the data pack, no model call
GITHUB_TOKEN=... node scripts/generate.mjs
```

Requires Node 22+.

## Layout

```
SKILL.md                     skill instructions
references/                  skill detail files
scripts/generate.mjs         data collection + model call
.github/workflows/briefing.yml
index.html                   static archive site (GitHub Pages)
briefings/                   one markdown file per weekday
```

## License

MIT — see [LICENSE](LICENSE).
