# Steam Deck and Steam Machine: controller-input QA is not a Verified badge

**Reviewed October 28, 2026.** [Structured public requirements](steam-deck-machine-input-qa-and-compatibility-gates-2026.json) · [synthetic device QA guard](../../site/steam-controller-compat-qa.mjs) · [tests](../../tests/steam-controller-compat-qa.test.mjs). No game was built or run, no controller was connected, and no official badge was requested.

## Independent hardware ratings and measurable requirements

[Valve's current compatibility review guide](https://partner.steamgames.com/doc/steamhardware/compat) explicitly treats Steam Deck and Steam Machine as **separately rated devices**. Their four public classes are **Verified**, **Playable**, **Unsupported**, and **Unknown**. An Unknown title may simply be unreviewed; it should not be classified as unplayable.

To pass the *input* portion of the Verified criteria, the default control mapping must access **all game functionality** without a user needing to turn on controller support in settings. On-screen button glyphs must match the **currently active physical device**, and any text field must either summon appropriate gamepad on-screen text input or provide a complete controller-only alternative. A launcher requiring a touchscreen or manually bringing up the keyboard is more consistent with **Playable** than friction-free Verified.

The performance section states a **30 FPS default target at 800p on Steam Deck** and **30 FPS at 1080p on Steam Machine**. Those are requirements for an actual app tested at supported default settings, not measurements or a guarantee that any named engine or game performs that well. Real game reviews also include additional display, seamlessness and platform-compatibility checks omitted from the small synthetic model.

## Legacy mappings versus action-native Steam Input

[Steam Input documentation](https://partner.steamgames.com/doc/features/steam_controller) supports configurable controller remapping and an optional [native ISteamInput interface](https://partner.steamgames.com/doc/api/isteaminput). Valve's [concept guide](https://partner.steamgames.com/doc/features/steam_controller/concepts) explains that legacy emulation sends low-level mouse/keyboard/gamepad events, whereas native action-based games can activate appropriate action sets and query glyphs for the controller currently in use. Native Steam Input is **not inherently mandatory** for a Verified badge if a developer supplies equivalent robust controller support; inaccurate device glyphs remain a compatibility risk.

Our [checklist helper](../../site/steam-controller-compat-qa.mjs) checks *reported hypothetical observations* for a chosen device and returns the failed criteria with **no official badge claim**. It refuses unspecified booleans, invalid framerates and unknown hardware categories. It intentionally requires an observer to assert all requirements rather than defaulting missing evidence to a pass.

## Workload and earnings boundary

The actual engineering and QA time for a new project depends on engine/controller integration, action manifests, menu and text-input surface count, platform target, framerate and input switching. A proper budget should separately time implementation, manual device QA, bug remediation and subsequent re-testing. These documents do **not** publish a representative per-device QA-hours sample. Likewise a game being Verified or Playable cannot prove it sold more copies or earned more profit than a similar game; the badge and consumer-selection processes are not randomized.

**Missing evidence:** verified device-test observations, median per-game QA cost, increased paid checkout conversions, net publisher receipts and compatibility-derived profit. No actual application or hardware measurement was conducted.
