# itch.io — browser play, paid downloads and release economics

Research date: 2026-10-26. [Machine crosswalk](release-format-access-2026.json).

## Commercial distinction

The [HTML5 publishing guide](https://itch.io/docs/creators/html5) states that embedded browser-playable games accept **donations** but are not natively sold as mandatory paid browser access. The alternative is to publish as a **downloadable** game and sell its files. The same title may have free-demo content, paid downloads and bonus-file tiers; those are separate economic units. A browser play is not a checkout, a free demo is not a purchased game, and a voluntary contribution is not a required sale.

## Technical constraints

An HTML5 ZIP requires `index.html` in its root and asset paths compatible with the host's case-sensitive filenames. The documented default extraction limits are **1,000 files**, **500 MB total**, **200 MB in a single file** and **240 characters per path**. Embedded play has inline and fullscreen options; on mobile the game launches fullscreen, and creators should mark it mobile-friendly only after verifying mobile operation. These are publishing requirements, **not actual device compatibility test results**. <https://itch.io/docs/creators/html5>

## Page and access states

[First-page guidance](https://itch.io/docs/creators/getting-started) recommends a 315:250 cover-image ratio and three to five screenshots. [Access controls](https://itch.io/docs/creators/access-control) distinguish draft, restricted, public, unlisted public, future release and public-but-new-downloads-disabled states. A publicly accessible page can still be excluded from discovery; an eligible search listing does not imply a paid transaction.

[Download keys](https://itch.io/docs/creators/download-keys) grant access after purchases, manual issuance and certain claims. Free downloads do not create a purchase entitlement. Files may be updated on the page for existing owners; individually priced files can have distinct entitlement thresholds. A download key or bundled claim cannot be treated as unique customer revenue.

## Commercial QA protocol

The accompanying [pure ZIP manifest audit](../../site/itch-html5-audit.mjs) validates source-defined static size/path limits using an explicit manifest input, but it cannot extract archives, run JavaScript, or establish actual device compatibility. Before a real product launch, independent automated browser QA would need to verify loading, inputs, save data, fullscreen, mobile layouts, sound and actual downloads. This report does **not** claim to have executed that QA against a game.

## Unanswered market questions

No representative conversion rate, mean game revenue, typical hours of development, paid 2D audience size or browser-to-download funnel was established. Those values remain null in the machine crosswalk.
