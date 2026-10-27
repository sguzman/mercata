# Device/input-specific QA time and support effort ledger

Reviewed October 27, 2026. This strengthens the existing **study-touch-and-controller-input** task but does **not** complete its required *measurement of actual QA and support costs by device*.

The [HTML5 guide](https://itch.io/docs/creators/html5), [creator quality guidance](https://itch.io/docs/creators/quality-guidelines), [game accessibility baseline](https://gameaccessibilityguidelines.com/basic/) and [Microsoft gaming guidance](https://learn.microsoft.com/en-us/gaming/accessibility/) inform a release checklist for keyboard/mouse, gamepad and touch. The available source-linked [cross-platform QA](cross-platform-release-qa-2026.md), [accessibility](accessibility-release-qa-matrix-2026.md), and [support maintenance ledger](game-patch-support-workload-2026.md) remain distinct from game-specific execution evidence.

The new [pure JavaScript worklog evaluator](../../site/itch-input-device-worklog.mjs) totals **submitted elapsed work minutes** per device, input mode and activity. It rejects duplicate session identifiers and malformed records, and cannot infer real account ownership or paid buyer behavior. An optional, caller-supplied labor valuation produces illustrative work costs for the recorded sessions only; it never substitutes an assumed market hourly rate.

A single timed session must not be duplicated merely because it exercised two input methods. Record fresh sessions for testing keyboard/gamepad reconnection, focus switching, touch controls, rotation, save persistence, accessibility remapping and post-patch regression. Unsupported or unexercised combinations remain **unknown**, not passed. Test fixtures are synthetic and excluded from claimed field measurements.

**Status:** the instrument and detailed device checklist are supported, with no actual released game, input devices or authentic owner worklog observed. Consequently the task retains partial acceptance; population-average cost, actual incremental touch/controller labor, order conversions and net income remain null. [Machine methodology](input-method-qa-effort-ledger-2026.json).
