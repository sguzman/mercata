# A conditional floor on Steam's 2025 game gross: nested Valve-attributed thresholds

**Reviewed October 29, 2026.** [Machine-readable bounds](steam-gdc-2025-nested-annual-gross-revenue-floor-2026.json) · [deterministic threshold arithmetic](../../site/steam-annual-threshold-floor.mjs) · [tests](../../tests/steam-annual-threshold-floor.test.mjs).

Two public accounts of **Valve's March 2026 GDC presentation** report distinct but nested thresholds for calendar-year 2025 Steam game revenue:
- [Game Developer's report](https://www.gamedeveloper.com/business/valve-says-5-836-titles-earned-over-100-000-on-steam-in-2025): **5,863 games exceeding $100,000** in 2025.
- [GameDiscoverCo's report](https://newsletter.gamediscover.co/p/what-steams-2026-biz-update-tells): **2,395 games exceeding $500,000** in 2025.

These are **Valve-attributed presentation counts**, not direct audited access to the underlying publisher ledgers. The derived bound below assumes both presentations use a consistent **annual gross game revenue** basis, game definition and calendar year. No gross amount for any individual game was obtained.

## A useful lower bound, without double-counting games

Because the $500,000 group is contained in the $100,000 group on matching definitions, the minimum possible sum is the high-group count multiplied by $500,000, **plus** the remaining medium-group count multiplied by $100,000:

| Mutually exclusive 2025 game revenue group | Games | Strict lower gross contribution |
| --- | ---: | ---: |
| Above $500,000 | 2,395 | Above **$1,197,500,000** |
| Above $100,000 but not above $500,000 | 5,863 - 2,395 = 3,468 | Above **$346,800,000** |
| **Games above $100,000 combined** | **5,863** | **Above $1,544,300,000** |

This is a **conditional floor for those reported annual game-gross categories**, **not** an estimate of the total 2025 Steam revenue. It excludes games below the threshold and tells nothing about the platform's full gross denominator, net money received by partners, salaries or profit. The top-tier group represents **2,395 / 5,863 ≈ 40.8%** of the *above-$100,000 game subset* — **not** 40.8% of every title on Steam.

The [pure guard](../../site/steam-annual-threshold-floor.mjs) enforces nested counts and nonnegative safe integer arithmetic, preventing both the overlapping groups from being added twice and the success-selected subset from being mistaken for all game publishers.

## Why this still does not answer the income question

The thresholds count **games generating revenue in 2025, regardless of their original launch year**. A back-catalog game and a new 2025 release may each appear. The figure 5,863 cannot be divided by 2025 new releases to calculate a first-release success rate. It also cannot support a median for new solo developers. Game owners, legal publisher payees, Steam’s retained share, taxes, refunds, regional price realization, contractual royalties and production labor are separate unknowns.

Valve's [2025 Year In Review](https://steamcommunity.com/groups/steamworks/announcements/detail/528746884222682053) reports a **76% revenue-weighted paid share across non-Valve games**, but provides no suitable total gross for the GDC threshold-defined subset and cannot be applied as each game's negotiated share. A rigorous all-game total or publisher income distribution needs the entire game-level ledger population and appropriate legal and cost denominators.

**Result:** The two publicly reported threshold counts now imply a reproducible **strict lower bound above $1.5443 billion** for a particular nested annual-revenue subset, conditional on common measurement. Steam-wide annual gross, zero paid-order rate, developer receipts, and after-cost income remain unknown.
