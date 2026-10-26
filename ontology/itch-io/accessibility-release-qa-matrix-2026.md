# Game accessibility — source-backed release QA plan

**Reviewed October 26, 2026.** [Machine checklist](accessibility-release-qa-matrix-2026.json) · [offline completeness evaluator](../../site/itch-accessibility-review.mjs). This is a **design/completeness plan**, not a game tested for accessibility, an independent certification, legal compliance assessment or evidence of game sales uplift.

The community-authored [Game Accessibility Guidelines basic list](https://gameaccessibilityguidelines.com/basic/) calls out remappable controls, readable captions for important speech, alternative cues for information carried by sound or color, readable UI contrast and font size, adjustable input, pacing and remembered settings. [Microsoft's game accessibility guidance](https://learn.microsoft.com/en-us/windows/uwp/gaming/accessibility-for-games) provides concrete inspection examples across menus, HUD, dialogue, graphics and controls. Their advice is not proof that any particular game fulfills it; a downloadable Linux/Windows build and HTML5/touch build can differ.

The [itch.io indexing guide](https://itch.io/docs/creators/getting-indexed) permits creators to classify verified accessibility options in metadata, while the [creator quality guidelines](https://itch.io/docs/creators/quality-guidelines) require truthful project representation. Incorrect claims, superficial accessibility badges and untested platform tags must not be used as marketing shortcuts.

## Review coverage

The machine checklist contains fourteen acceptance prompts, grouped into **motor controls, hearing/audio equivalents, vision/legibility, sensory safety, cognitive pacing, saved settings and truthful listings**. It requires the tester to declare whether each check applies to each actual release target (keyboard, gamepad, touch, browser or downloaded executable). A missing feature is a failed/incomplete check, not a marketing success.

For an actual build, record tester-visible evidence (reproducible steps, build version, device/resolution, result, unresolved issue, intended fix and time spent). Only then can a specific build's accessibility review status be evaluated. No such game, measured QA hours, participant testing or deployment was supplied to this research. The **plan task** is complete; the execution, certification and game-specific cost figures are not.

## Commercial relevance, bounded

Improved access plausibly reduces barriers for some players, but these guidelines do **not** provide paid demand, unique potential customers, a price premium, conversion improvement or profit rate for an itch.io game. Requiring adjustments can add asset, control mapping, QA and support labor; those hours and costs need to be measured on a real project before inclusion in the profitability model. No individual player's medical data is needed or solicited for the study.

The offline evaluator only checks a user-supplied results set against declared applicability. It cannot interact with a game, infer disability status or claim an accessible release without actual test evidence.
