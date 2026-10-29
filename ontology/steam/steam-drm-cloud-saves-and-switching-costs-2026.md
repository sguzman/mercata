# Steam switching costs: DRM, save files, owned licenses and off-store copies

**Reviewed October 28, 2026.** [Structured evidence](steam-drm-cloud-saves-and-switching-costs-2026.json). Official developer documentation, not a benchmark of piracy, customer lock-in, cross-store migration or income.

## Separate what the customer actually has

A Steam buyer may have several different kinds of relationship with a game:

- **Steam license / AppID entitlement** — an authorized right to launch the Steam-distributed product; a library entry is not proof of a purchase on another PC storefront.
- **Installed executable** — a developer may ship a Steam DRM-wrapped build or elect to distribute an alternative DRM-free build.
- **Save files** — data managed locally or through Steam Cloud, whose usability elsewhere depends on actual file format, game version, OS and developer support.
- **Community reputation** — Steam reviews, achievements, playtime and wishlist history attached to Steam's platform services, not portable paid orders.

These relationships cannot be summarized as a single “lock-in percentage” or converted into buyer income without data.

## DRM wrapper: modest technical protection, not guaranteed anti-piracy

[Valve's Steam DRM guide](https://partner.steamgames.com/doc/features/drm?l=english) says its wrapper verifies ownership and launches Steam, but deters mainly very casual file-copy piracy. Valve does **not** describe the wrapper as strong protection against a determined person. Using multiplayer, achievements or similar authenticated features may increase the perceived value of legitimate purchases, but that advice is **not a controlled estimate of incremental sales**.

The [official ownership/authentication guide](https://partner.steamgames.com/doc/features/auth) supports signed session tickets, encrypted app tickets, and authenticated checks of AppID ownership. Valve even documents how a developer could grant a separately downloadable **DRM-free build** on its own website to verified Steam owners, or optionally offer it via free DLC. These are possible developer choices, **not an automatic promise that every Steam game is DRM-free or transferable** to another store.

## Steam Cloud is not a save-format guarantee

[Valve's Steam Cloud documentation](https://partner.steamgames.com/doc/features/cloud?l=english) describes Auto-Cloud and Remote Storage API integration and allows players to disable cloud syncing globally or per game. Cross-OS save synchronization depends on chosen file roots and platform overrides. It does not prove that a game's files are readable by a different executable, version, storefront or future game. Valve also notes that overly large or fragmented save files can affect bandwidth and shutdown or startup time.

Steam app-transfer documentation explains why historical reviews and wishlists can accompany an AppID when its Steam managing partner changes. That is a **Steam-internal app transfer**, not a claim that a review can be exported as a user-authored review on another marketplace.

## Evidence and cost boundary

A meaningful switching-cost study would need a sampled set of comparable paid games and their actual DRM configurations, portable save formats, Steam-to-external customer transition outcomes, technical support labor, and consumer surveys or observable repurchase behavior with valid permissions. The current official documents establish possible mechanisms but **no representative cost of switching, piracy rate, storefront transferability distribution, customer retention effect or extra developer profit**.

No game executable, Steam user account, save file, private app metadata, or buyer record was accessed.
