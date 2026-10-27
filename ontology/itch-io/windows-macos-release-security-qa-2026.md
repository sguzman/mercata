# Itch game builds versus Windows and macOS release security checks

Reviewed October 26, 2026. [Machine checklist](windows-macos-release-security-qa-2026.json). This closes existing **desktop packaging and QA design** tasks, without claiming that a game has ever been tested or signed.

**itch.io file delivery is not operating-system certification.** The [butler manual](https://itch.io/docs/butler/) documents uploading and updating versioned games. A successful game archive upload does not verify whether the executable has correct architecture, dependencies, file permissions, inputs, save handling, accessible configuration or an acceptable downloaded-app launch experience.

| Target | Recommended build checks | OS security/reader consequence |
|---|---|---|
| Windows desktop | Correct packaged EXE and dependent files; startup/quit; audio/controller/keyboard; saves; offline access when advertised; update and rollback | [Microsoft's May 2026 SmartScreen guidance](https://learn.microsoft.com/windows/apps/package-and-deploy/smartscreen-reputation) distinguishes reputation of the file hash and signing publisher. Even signed new executables may warn. EV certificates no longer automatically bypass warnings. Unsigned binaries may face reputation or Smart App Control policy blocks. |
| macOS desktop | App bundle, Info.plist, execution permissions, matching CPU/minimum OS, resources, gameplay, save/restart, signed release or unsigned behavior as applicable | [Apple's official notarization guidance](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution) requires appropriate Developer ID, signing, hardened runtime and notarization for the standard external distribution trust route. Test the **real Gatekeeper launch experience**. A notary ticket does not certify gameplay. |
| Linux desktop | Portable archive, executable permissions, required shared libraries, target distribution/graphics and input, save and patch behavior | Test on an actual compatible target, not just a local build directory or file listing. |
| HTML5 | Root index.html or supported HTML package, relative assets, browser input, audio startup, and persistence | Test every advertised browser/device class independently; HTML5 static hosting is not native code signing. |

macOS signing/notarization normally depends on Apple's developer tooling and valid credentials; this research **does not request or acquire a Mac or paid certificate**, and it does not assume Linux tooling alone can certify macOS execution. Windows signing may involve credential costs, but no actual seller quote was collected.

## Work and financial boundary

Record per-platform **packaging, signing/notary preparation, supported architecture, manual device QA, patch/update, save compatibility and support hours** with actual costs before claiming product readiness or net margin. A storefront screenshot, source code, downloaded archive, HTML validator or notarization result cannot substitute for a full launch and gameplay test. Actual working builds, signing costs, QA hours, returned buyers and sale conversion remain **unknown**.
