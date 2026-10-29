# Steam platform reach versus actual paying game buyers

**Reviewed October 29, 2026.** [Structured first-party reach snapshot](steam-public-monthly-reach-versus-buying-customers-2026.json) · [metric compatibility guard](../../site/steam-audience-denominator-guards.mjs) · [tests](../../tests/steam-audience-denominator-guards.test.mjs).

[Valve's public Steamworks landing page](https://partner.steamgames.com/) displays **over 132 million monthly active users** and **one trillion daily impressions**. These are useful *platform-level promotional reach statements*, not an independently audited number of unique customers who purchased a game on Steam.

| Public reported metric | Observation and period | Valid interpretation | Not a valid inference |
| --- | --- | --- | --- |
| **Over 132 million** monthly active users | Seen October 29, 2026; underlying month **not specified** | Valve's undated platform-level MAU marketing claim | Number who bought a game in October 2026 or paid indie customers |
| **One trillion** daily impressions | Seen October 29, 2026; underlying day **not specified** | Rounded platform event volume across promoted/discovery surfaces | One trillion distinct humans, daily buyers or a title's own impressions |
| **8.2 million** 2025 Daily Deal purchasers | Valve-attributed GDC 2026 data [reported by Game Developer](https://www.gamedeveloper.com/business/valve-says-5-836-titles-earned-over-100-000-on-steam-in-2025) | Buyers of an **annual, selected promotional segment** | All 2025 Steam paying customers, let alone monthly buyers or indie-game buyers |

The [2025 Steam year-in-review](https://steamcommunity.com/groups/steamworks/announcements/detail/528746884222682053) separately records a peak of about **42 million concurrent users**. Concurrent clients, monthly active accounts, annual promotion buyers, daily impression events, **completed premium-game orders** and unique legal publisher payees are all **different statistical populations and units**.

## Why two large numbers cannot establish the addressable paying market

It would be invalid to divide the reported 8.2 million **annual** promotional buyers by Valve's **undated monthly** active population and describe the result as a fraction of Steam users who spend. Some users buy during other events; an annual selected-sale cohort may include accounts active in different months. Likewise one trillion daily impressions divided by monthly active users has mismatched time windows and duplicates individuals across impressions.

The [tested helper](../../site/steam-audience-denominator-guards.mjs) stores the three numerical magnitudes with their unit descriptions but refuses to output paying-customer fractions, unique per-person exposures, indie game purchases or income. It returns **null** for those economic fields. It never handles player account identifiers or scraped customer profiles.

## Minimum evidence for a buyer-size estimate

A usable market denominator requires an authoritative and dated platform-level **unique purchaser** count in a specified month or year, or consented merchant ledgers for an explicitly narrower and disclosed eligible product cohort. Segment boundaries matter: first-time premium indie purchasers, free-to-play accounts, DLC purchasers, Steam key activators, family players, daily-deal buyers and simultaneous logins cannot be added interchangeably. The population also needs geography, release eligibility, refunds and transferred ownership handled explicitly.

**Current finding:** Steam advertises substantial active-user and impression scale, but the **number of paying premium-indie buyers**, their purchase frequency, and a representative publisher's receipts or profit are still unknown. A current webpage snapshot is not evidence that its underlying metric was measured in October 2026.
