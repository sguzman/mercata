# itch.io project, file, channel and build units — count one thing at a time

**Reviewed October 26, 2026.** [Machine entity ontology](project-file-build-identity-2026.json) · [Pure metadata checker](../../site/itch-project-unit-audit.mjs). No store accounts or paid transaction data were accessed.

itch.io's [creator page guide](https://itch.io/docs/creators/getting-started) distinguishes one **project page** from its uploaded files, which can include a free demo, multiple platform releases, separately priced bonus content and future file updates. The same publisher account can operate several pages and can publish games, assets or other digital products. These are different identity units. Listing statistics count pages matching a filter; they do **not** directly count unique people or publishers who sold a game.

[Butler's build guide](https://itch.io/docs/butler/pushing.html) describes **channels** (such as Linux, Windows or preview) and successive **builds** that update the same project's uploads. Uploading the third revision of a Linux channel is **not** three games or three paid orders. [HTML5 project guidance](https://itch.io/docs/creators/html5) additionally distinguishes an embedded playable browser artifact from a downloadable game file, and current documentation says embedded HTML5 play receives optional donations rather than native mandatory paid access. Browser plays are **not** paid units.

[Download-key documentation](https://itch.io/docs/creators/download-keys) covers access keys for owners and other authorized cases. They are not universally one key per human or proof a cash payment settled; manually granted access, gifted access and other file-entitlement routes must be separated from transactions.

## Counting rules

For analysis, create different fields for pages, publisher accounts, file uploads, platform channels and build revisions. A page may include a *game* and a *demo* but contribute one project page. A title may distribute its game through several builds but still be one commercial product concept. Conversely, a bundle grants multiple game entitlements yet is one buyer checkout route, not independent paid orders for each title. Neither a listed positive price nor a valid build implies any actual paid orders.

The [offline audit](../../site/itch-project-unit-audit.mjs) checks referenced page/channel IDs and prevents duplicate file/build identifiers within a structured metadata example. It deliberately returns **null** for verified paid orders, active paid seller count, distinct buyer persons and seller profitability. Those require separate authorized first-party transactions and cost records.

This completes the fixed **listing-versus-build identity task**. It does not solve the **paid 2D market population**, actual buyer count, distinct active publishers or 30/90/365-day commercial sales cohort, which remain unknown.
