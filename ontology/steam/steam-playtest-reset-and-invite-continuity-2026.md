# Steam Playtest reset: cohort discontinuity and published prerequisites

**Reviewed October 29, 2026.** Primary public authority: [Valve Steamworks Playtest documentation](https://partner.steamgames.com/doc/features/playtest?l=english), sections on friend invitations, reset, and re-enabling a Playtest. This is a policy-process audit, not a report of actual tester outcomes.

[Structured requirements](steam-playtest-reset-and-invite-continuity-2026.json) · [pure reset-readiness function](../../site/steam-playtest-reset-guards.mjs) · [synthetic regression tests](../../tests/steam-playtest-reset-guards.test.mjs).

## Suspension is not reset

When a developer makes a Playtest unavailable, its build stops launching, but previously granted testers retain their access if the Playtest is subsequently re-enabled **without a reset**. Marking a Playtest *Not Playable* does not automatically revoke keys; pausing friend invites stops **new invitations** but leaves already-sent invitations active. The latter may bring in network-selected participants and does not form a random sample of Steam buyers.

By contrast, the documented Playtest **reset is irreversible** and removes access for existing participants and people waiting for admission. It disables **all Playtest product keys** (even unactivated ones), archives pending friend invites, and can notify recent players by email. These effects are specific to the free Playtest AppID and must not be confused with refunds, ownership or access to a separate paid base game.

## Required state before reset

| Control | Documented required setting |
| --- | --- |
| Playtest status | Not Playable |
| Store visibility | Hidden |
| Signup type | Limited |
| Friend invitations | Paused or disabled |
| Packaging | Playtest must not share a package with other apps |
| Publication | All Playtest store settings and Steamworks settings published |

A developer cannot obtain a valid reset merely by deactivating playability while leaving open signups or enabled friend invitations. In the [invented fixture](steam-playtest-reset-and-invite-continuity-2026.json), a preflight with 100 participants, 35 waiting requesters and 42 issued keys models **zero** retained grants and active Playtest keys *if* all prerequisites hold and reset is executed. Those counts are made up expressly for unit tests; the function never accesses a real Steam account or performs a reset.

## Research consequences

An enrollment panel measured before and after **reset** has undergone selection and population discontinuity, unlike a stop-and-reopen episode preserving grants. Neither model identifies gameplay activation, post-test purchases, conversion effects, developer income or profit. Commercial conversion would require authorization, a user-privacy-preserving join with actual paid main-game orders, consistent time horizons and careful treatment of nonresponders.

Valve's experimental friend-invite mechanism permits 1–3 invites per eligible participant and requires at least 30 days of Steam friendship. Friend referrals are neither randomly recruited potential buyers nor guaranteed active testers. This is an operational constraint, not a measured acceptance or sales rate.
