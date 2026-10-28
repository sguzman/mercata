# SteamOS, Steam Deck and Steam Machine: compatibility requirements and QA costs

**Reviewed October 28, 2026.** [Structured findings](steamos-deck-compatibility-qa-2026.json). An official-document QA protocol, **not** a real benchmark or a measured commercial return.

## Hardware review categories

[Valve's compatibility review](https://partner.steamgames.com/doc/steamhardware/compat?l=english) distinguishes **Verified**, **Playable**, **Unsupported**, and **Unknown**. Verified satisfies the published seamless-play criteria; Playable may require configuration. Unsupported reflects identified incompatibility; Unknown is *unreviewed*, not proven broken. Hardware ratings affect storefront presentation but **do not determine ordinary Steam release eligibility**.

The current Deck Verified review expects a workable default **30 fps at 800p**, controller access to all gameplay, correct input glyphs, controller-navigable launchers and keyboard flows, plus readable interface text. Valve states a **9-pixel minimum glyph height** at 1280×800 and recommends 12 pixels where possible. Steam Machine uses a separate **30 fps at 1080p** performance target. These are policy thresholds; no actual game was tested.

## Native Linux, Proton and cloud saves

[Developing for Linux](https://partner.steamgames.com/doc/store/application/platforms/linux?l=english) requires matching native build SDKs and Linux runtime selection. [Proton](https://partner.steamgames.com/doc/steamhardware/proton?l=english) can run compatible Windows applications on SteamOS, but unsupported APIs, codecs and middleware can cause failure. Easy Anti-Cheat and BattlEye compatibility requires appropriate developer configuration rather than being assumed automatically. Valve may test native Linux first and switch to Windows/Proton if the native build has major issues.

[Steam Cloud](https://partner.steamgames.com/doc/features/cloud?l=english) offers configured Auto-Cloud paths or integration through Remote Storage APIs. For real QA, tests should cover save-file locations, cloud conflicts, Windows/Linux paths, device switching, suspend/resume and incomplete sync.

## Research implications

The economic question is whether adding controller support, text scaling, Proton compatibility, native Linux builds or cloud-save resilience **increases net game revenue after development and support labor**. The official materials provide no causal estimate. A valid study needs game-specific device benchmarks, effort logs, maintenance costs, sales outcomes and comparable control groups.

**This checkpoint tested no game, measured no FPS, gathered no paid orders and estimated no platform ROI.** Those remain unknown.
