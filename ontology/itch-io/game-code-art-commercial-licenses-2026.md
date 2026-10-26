# Commercial game licensing: code, executable and art are different permissions

Reviewed October 26, 2026. [Machine crosswalk](game-code-art-commercial-licenses-2026.json) · [component-level offline audit](../../site/itch-game-license-audit.mjs). This is public license research, **not** certification that any particular game has legally cleared its dependencies.

## Source code versus binary, art and music

The [MIT license](https://opensource.org/license/mit) permits selling and distributing copies of covered code while retaining applicable notices. [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) likewise permits source and binary redistribution subject to license and relevant attribution/change-notice conditions. The [GNU project's GPL FAQ](https://www.gnu.org/licenses/gpl-faq.html) confirms that authors can charge for GPL-covered copies, but buyers retain GPL redistribution rights and the distribution of covered binaries triggers applicable corresponding-source obligations. The exact GPL version, code combination and mode of distribution matter; a paid closed-source executable cannot simply assume GPL terms are irrelevant.

For music, sprites, textures, images and other media, software licenses on the game engine or app repository **do not grant automatic rights to separate assets**. [Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/) permits commercial reuse subject to attribution, license reference and changes notice. [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) does **not** give ordinary permission to commercially reuse an asset; a separate grant would need to be documented. Having freely downloaded an asset, or seeing code published to GitHub, is not evidence that the specific version can be sold within a game.

The [itch.io terms](https://itch.io/docs/legal/terms) require publishers to have distribution rights to uploaded work and grant itch.io a non-exclusive service license; they neither replace the underlying licenses of included assets nor give automatic clearance from other storefront conditions.

[Additional font and third-party asset inventory protocol](game-component-rights-register-2026.md): OFL 1.1 font bundling requires copyright/license notices and respects any Reserved Font Names on modified versions.

## A safe inventory for a commercial build

Before an actual release, identify each meaningful component's source, version, author/copyright holder, license identifier, permitted type of redistribution, credit/NOTICE files, source-code delivery conditions, and any separately granted commercial rights. Group game code, linked libraries, executable dependencies, font files, graphics, sounds, third-party IP and game metadata explicitly rather than treating “open-source game” as one license.

The [tested pure audit](../../site/itch-game-license-audit.mjs) can flag an ordinary CC BY-NC asset in a paid product, missing obligations, and GPL source-distribution review. It cannot decide complex derivative-work, trademark, linkage, sublicensing or license-compatibility questions. It never declares final legal clearance or a profitable game, and no source archives or seller data were examined.

The existing **open-source commercialization distinction** research task is complete: source-code permissions, paid binary distribution, asset licenses and itch.io store terms now have separately sourced requirements. The actual cost and legal compliance of a game remain unknown pending its concrete inventory.
