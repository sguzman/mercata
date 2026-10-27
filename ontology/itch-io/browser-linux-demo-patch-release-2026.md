# Browser, Linux and demo/full-game release rules — itch.io

**Reviewed 26 October 2026.** [Structured QA and entitlement contract](browser-linux-demo-patch-release-2026.json). This is a source-based acceptance of existing *research-design tasks* only; no seller account, game build, download or purchase was tested.

## Browser release

The [HTML5 upload instructions](https://itch.io/docs/creators/html5) permit a standalone HTML file or ZIP containing a root `index.html`. The published default ZIP limits are **1,000 extracted files, 500 MB total extracted content, 200 MB per file and 240 characters per path**. References are case-sensitive and must use relative paths. External calls need HTTPS. These are publishing limits, not recommended targets.

An embedded HTML5 game accepts **donations**, not mandatory payment for browser access. Mobile Friendly should only be advertised after touch, adaptive viewport, audio, fullscreen, persistence and performance checks on a real supported device. Mobile embeds open fullscreen. A browser play or free download must not enter the paid-sales denominator.

## Linux release

The [itch Linux distribution guide](https://itch.io/docs/itch/integrating/platforms/linux.html) recommends portable folders/archives rather than distribution-specific .deb or .rpm packages, with a launcher, game binary, assets and any necessary libraries. Audit linked dependencies with `ldd`, check minimum GLIBC symbol versions, and test on the **oldest advertised target distributions**. Bundling graphics drivers or an incompatible GLIBC is not an ordinary fix. Verify executable bits, inputs, video/audio, save-location write permissions and offline play where promised. No actual Linux game was run in this study.

## Demo versus priced full game

The [first-page guide](https://itch.io/docs/creators/getting-started) allows **free demo files on the same project page**; a demo does not require a second project. The [pricing guide](https://itch.io/docs/creators/pricing) and [download-key guide](https://itch.io/docs/creators/download-keys) distinguish a minimum price on the project from **separately priced files**. An entitlement key may be manually issued without a purchase. Therefore, verify anonymous access to the demo, paid access to the full build, bonus price thresholds, file/channels labels, and promised save compatibility independently. Neither keys nor demo downloads establish mandatory-price orders.

## Updates and release continuity

The [butler push guide](https://itch.io/docs/butler/pushing.html) uploads a folder or ZIP to a named channel such as `linux-universal`; a subsequent push to the same channel updates the project file. It computes a delta patch, then the backend asynchronously makes an optimized patch. This can reduce transfer bandwidth but is **not** a measured saving for an unshipped game. The [itch app update documentation](https://itch.io/docs/itch/integrating/updates.html) states that the app checks at startup and every 30 minutes, uses patches for butler versions, and documents different download-statistics behavior when a publisher replaces existing filenames versus deleting them.

Keep the old built artifacts, a version/channel/hash ledger, and a tested recovery path. A channel update does **not automatically prove rollback safety or player-save preservation**. Count actual testing, patch debugging and support as developer costs only when hours and outcomes exist.

**Scope:** Applied to documented browser/Linux distribution and entitlement procedures as of review. Commercial QA hours, true file sizes, player compatibility, refunds, successful payment counts and income impacts are unknown.
