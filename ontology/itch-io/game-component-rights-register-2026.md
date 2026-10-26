# Commercial game third-party asset and license tracking

**Reviewed October 26, 2026.** [Machine inventory requirements](game-component-rights-register-2026.json) · [pure pre-release completeness audit](../../site/itch-game-component-rights-audit.mjs). This is a source-based **tracking protocol**, not legal clearance of any real game.

A game may ship code libraries, middleware, fonts, sprites, audio tracks and narrative assets under different grants. For every such released asset, record the actual creator or rights holder, source URL, exact version/asset, license identifier, the reason commercial redistribution is permitted, and the required license and attribution file. Track which content is actually included in a published ZIP or executable. The overall [itch.io terms](https://itch.io/docs/legal/terms) give the operator a non-exclusive service license but do **not** override third-party rights.

## A font is not simply generic game art

The [OSI's full text of the SIL Open Font License 1.1](https://opensource.org/license/OFL-1.1) permits bundling licensed fonts with commercial games, subject to keeping the font copyright notice and license accessible. A modified version cannot use a *Reserved Font Name* without the copyright holder's explicit permission. The license also forbids selling the font by itself. These are font-file obligations; bundling an OFL font does **not** make all unrelated game code open-source. Check the actual font version's license text and RFNs, not just a display name.

For code, [MIT](https://opensource.org/license/mit) and [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) allow commercial redistribution with applicable notices. [GPL](https://www.gnu.org/licenses/gpl-faq.html) permits charging for distribution while keeping the covered source and downstream recipient rights. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) may permit commercial art/music with correct credit; [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) does not give ordinary commercial reuse permission without another grant. Software library terms do not automatically extend to a separately licensed soundtrack, image or trademark.

## Tracking outcome

The offline auditor flags absent source/holder/version data, unverified commercial permission, missing license/NOTICE records, and altered fonts bearing reserved names. It never issues a binding legal determination. It requires an actual asset list and marks licensing **unknown** if no inventory is supplied. Actual source copyright ownership, media reuse terms and commercial rights have **not** been verified for a real game.

This fulfils the fixed research task to specify **how to track third-party code, middleware, fonts, music and sprite rights**, while leaving actual release-specific clearance, costs and effects on paid-game earnings unknown.
