# Steam first-release waiting periods: updated source comparison


> **Later October 29, 2026 source check:** Official English public pages again conflict (21-day Onboarding versus 30-day Steam Direct landing). The October 28 findings below are historical snapshots, not a currently resolved single rule. See [the dated cross-source recheck](steam-first-release-source-conflict-and-concurrent-approval-gates-2026.md).

**Rechecked October 28, 2026.** [Structured findings](current-first-release-wait-recheck-2026.json) and [synthetic scheduling helper](../../site/steam-release-floor.mjs). No Steamworks partner account or release control was accessed.

The earliest Mercata [onboarding checkpoint](entry-review-and-reporting-2026.md) recorded a real source-text discrepancy: **30 days** on [Valve's Steam Direct page](https://partner.steamgames.com/steamdirect), versus **21 days** on an earlier public reading of the [Steamworks Onboarding guide](https://partner.steamgames.com/doc/gettingstarted/onboarding). A fresh reading of those *same two official URLs* on October 28, 2026 shows **30 days on both**. Valve's [2017 Steam Direct announcement](https://store.steampowered.com/news/posts/?enddate=1497372843&feed=steam_blog) also described a 30-day first-developer wait.

**October 28 historical conservative planning floor (not a currently unified rule):** reserve at least **30 calendar days from the app-fee payment** for first releases, and have a public Coming Soon page for at least **14 calendar days**. The two clocks can run **in parallel**; they must not automatically be added to get 44 days. Store-page and build review approvals impose additional independent conditions; passing the date alone does not publish the game.

The earlier 21-day wording is a **historical observation that reappeared in the current October 29 English onboarding page**. It is not justified to say the two official pages still agree or that 21 days is obsolete. We do not know when or why the page content diverged, whether a browser cache or localization played a role, or whether an individual partner account can see a different eligibility condition. We did not ask Valve or sign in.

The helper computes a conservative **calendar-date lower bound** from four synthetic dates: fee paid, Coming Soon page publicly visible, store review approved, and build review approved. It does **not** calculate a guaranteed go-live date or pretend that reviewers automatically approve on schedule.

**Remaining unknowns:** contractual exceptions, partner-specific release eligibility, exact period of the previously observed 21-day text and actual onboarding/review delays.
