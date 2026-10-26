# itch.io cross-platform release and compatibility QA

Official [game developer quick start](https://itch.io/docs/itch/integrating/quickstart.html), [Windows](https://itch.io/docs/itch/integrating/platforms/windows.html), [macOS](https://itch.io/docs/itch/integrating/platforms/macos.html), [Linux](https://itch.io/docs/itch/integrating/platforms/linux.html) and [HTML5](https://itch.io/docs/creators/html5) guides describe distinct conditions for a commercial game. [Machine requirements](cross-platform-release-qa-2026.json).

Windows games should use portable folders rather than self-installers, with an app launch manifest to declare special prerequisites such as DirectX, Visual C++ or .NET. macOS downloads should be correctly structured app bundles, preserve executable permissions and consider OS security prompts for installs outside the itch app. Linux games need appropriate portable packaging and compatible dynamic libraries without bundling system GPU drivers. The game launcher can use different executable paths by operating system and butler supports versioned distribution.

HTML5 needs independent desktop and mobile browser testing. A mobile-friendly flag is appropriate only after testing touch inputs, viewport, audio and launching on actual mobile devices. A valid index.html or package archive alone cannot certify that a game starts or works.

For each **advertised** target, release QA must establish startup, inputs, game saving, closing and compatibility. Targets not shipped are not mandatory. All five source-derived test matrices have an actual result of unknown: **zero games were built, installed, run or QA-tested in this Mercata research**. No gameplay completion, customer retention, launch cost or profitability figures are observed.
