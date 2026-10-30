# Source-verified Steam reporting is not complete publisher-income history

**Reviewed October 30, 2026.** [Structured scope audit](steam-gameselo-verified-partial-reporting-vs-modelled-lifetime-2026.json) · [synthetic span guard](../../site/steam-verified-reporting-span-guard.mjs) · [tests](../../tests/steam-verified-reporting-span-guard.test.mjs). This audits the **public gamesELO operator description**, not independently authenticated Steamworks account or bank statements.

## Four displayed verified reporting windows versus modelled lifetime estimates

The [gamesELO Indie revenue benchmark](https://gameselo.com/reports/steam-revenue) separates a changing selected cohort of modeled lifetime estimates from **four opt-in games** with operator-described financial reporting. It explicitly does not pool those short verified-labelled windows into the lifetime estimate histogram or provide a whole Steamworks partner history. The [public verified leaderboard](https://gameselo.com/leaderboard?tab=verified) and [operator methodology](https://gameselo.com/methodology) show the reported date coverage. These are **three documents from the same operator**; the benchmark and leaderboard reuse **the same four records**, not two independent samples.

A public October 30 read displayed:

| Publicly named game | First displayed date | Last displayed date | Days actually reported | Inclusive calendar span |
| --- | --- | --- | ---: | ---: |
| Particle Hearts | 2026-08-06 | 2026-10-13 | 29 | 69 |
| Neighborhorde | 2026-08-02 | 2026-10-17 | 26 | 77 |
| David. | 2026-08-02 | 2026-10-13 | 26 | 73 |
| SPINGUN | 2026-08-14 | 2026-10-28 | 22 | 76 |

The inclusive spans were recalculated from the displayed first/last dates. These observations are **not claims that every day inside each span was imported**, nor proof that the unreported 40–54 days had no paid sales. The public dashboard is dynamic and can backfill or revise amounts and day coverage; these values describe **one observed source read**, not a permanent seller ledger. The actual per-day source reports, contracts and audit trail were not accessed.

## Steam gross, Steam net, and derived payee income

The [operator's methodology](https://gameselo.com/methodology) says a verified report comes through a partner-authorized read-only Steam financial service. It defines *Steam net* as gross less refunds, chargebacks and sales taxes, **before** Valve's share. It then applies an assumed standard platform fraction for a derived **take-home** illustration. Neither net nor modeled take-home constitutes independently confirmed funds transferred to the game creator. The source also says DLC and in-game sales roll into the base game's gross, so these game-money observations cannot be substituted for gross *paid base-game copies*.

The provider says the financial key's scope reaches an entire Steamworks partner account, although it publishes only opt-in games. An opt-in verified group is therefore not a random sample of publishers, and public developer and publisher labels do not establish legal ownership or contractual proceeds. No authentication token was requested, supplied, logged or retained by Mercata.

## Why this does not measure a median salary, typical game revenue, or zero sales

Four **short, self-selected, incompletely covered** cash windows with disparate release dates cannot identify a fixed 30/90/365-day game earnings distribution, much less an actual legal-publisher income median. They cannot validate the report's much larger selected game catalogue's lifetime *estimated* gross revenue midpoint. A source's “verified” label documents provenance asserted by the source operator, **not independent inspection by this research project**. Zero reviews, absent game reports, absent calendar days or incomplete histories are **unknown**, not proven zero sales.

The [pure span guard](../../site/steam-verified-reporting-span-guard.mjs) validates only synthetic day-span arithmetic and excludes unapproved account identifiers. It never extrapolates missing days to zero, calculates a lifetime sales figure, or labels a modeled report as a merchant-verified total.

**Research status:** Publicly visible operator-described merchant reporting, not a reproducible complete paid-game cohort or population-level actual earnings census. Existing Steam income and zero-sale unknowns remain unresolved.
