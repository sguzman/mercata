# Steam discount eligibility: separate the release, price-rise and prior-discount clocks

**Reviewed October 30, 2026.** [Structured audit](steam-discount-history-firstpaid-eligibility-2026.json) · [synthetic calendar model](../../site/steam-discount-sequence-cooldown.mjs) · [regression tests](../../tests/steam-discount-sequence-cooldown.test.mjs).

## Official rules, with distinct cooldowns

Steam's [current first-party discounting rules](https://partner.steamgames.com/doc/marketing/discounts?language=english) describe **three independent thirty-day gates**: (1) following the paid release, except for a valid preconfigured launch discount; (2) following any increase to the base price in any currency; and (3) between the end of one regular/launch discount and the start of another regular discount. The first two cannot be bypassed by a Steam-wide seasonal sale.

An **official seasonal sale discount** is exempt from the third, ordinary discount-to-discount gate, including when a preceding discount ended recently. Conversely a previous official seasonal sale does not create the normal cooldown for the next regular discount. This is specific to *official Steam seasonal-sale discounts entered through their designated workflow*: a **custom discount coinciding with a seasonal sale** has no special exemption. Valve separately requires minimum local prices and platform permissions which this research cannot verify.

The current [official Steam guide](https://partner.steamgames.com/doc/marketing/discounts?language=english) limits an introductory launch discount to **10–40%** and **7–14 days**, starting with the release. Ordinary custom discounts are **10–95%** and **1–14 days**. Official seasonal sale periods follow their own calendar and can be longer than fourteen days. Calendar days alone cannot establish price-threshold eligibility or the actual Steamworks configuration.


The synthetic checker also rejects a prior discount that would overlap the modeled base-price increase, or start inside the 30-day price-increase cooldown. An earlier promotion cannot be counted as valid history merely because the *later* proposal clears that increase. This is limited to the single supplied last price-increase date, not a complete price-change history.

The synthetic checker now requires an explicit `official_seasonal_event_verified: true` **fixture attestation** before allowing the seasonal exception. For a previous seasonally discounted title, its prior-discount record must independently carry the same hypothetical attestation. A bare `discount_kind: 'official_seasonal'` string is **not enough**: an unverified event produces an unresolved result rather than a false approval or an invented failed discount. Even an attested synthetic fixture does not independently validate Steam's event calendar or the account's participation.

## In & Out public example, without an invented approval

The [public Steam listing](https://store.steampowered.com/app/4230140/) dates *In & Out*'s paid release to **August 31, 2026**. The [developer's October 2 announcement](https://www.reddit.com/r/puzzlevideogames/comments/1wvnlbm/) reports a **75% discount**. The announcement falls **32 calendar days** after the published paid release, clearing the *release-only* 30-day waiting period on a date basis. At 75%, it **cannot be a launch discount** under the present 40% ceiling.

However, the public self-report does **not** authenticate the prior discount schedule or historical package configuration. A hypothetical launch discount ending on September 13 would create an ordinary discount-to-discount cooldown until October 13. Without an authenticated prior-discount end date, **whether an October 2 custom promotion was eligible cannot be determined** from release-date arithmetic alone. In particular, this example makes no claim that Valve approved a specific discount or that the author violated a policy.

The simultaneous community-pack update, outreach and other exposure leave the observed paid sales increments [discussed in the prior case study](steam-inout-four-checkpoint-discount-outreach-2026.md) noncausal.

## Software test contract

The new **first-paid synthetic fixture checker** preserves three-valued results: `true` means conditional compliance with known calendar rules and an *attested complete* prior-discount history, `false` means a known rule fails, and `null` means the prior discount history is incomplete. Even `true` is **not verified store eligibility**. Tests cover the independent cooldowns, prior price-increase chronology, official-seasonal exception, launch caps, date-boundaries, missing prior history and hypothetical duplicate discounts.

The earlier [release-date-only checker](../../site/steam-sale-date-eligibility.mjs) remains available but is explicitly a preliminary gate that assumes no disqualifying previous promotion history. Neither checker estimates publisher cash, price elasticity, or zero-sale rates.
