# itch.io game hosting is not custom multiplayer-server hosting

Reviewed October 26, 2026. [Machine cost and architecture model](multiplayer-hosting-boundary-2026.json).

The [operator's April 2021 support reply](https://itch.io/t/1307413/does-itchio-host-cloud-servers) states that itch.io does not accept uploading custom code that executes on its infrastructure as a dedicated game server. A [2025 moderator response](https://itch.io/t/4760481/can-this-site-handle-basically-hot-seat-multiplayer) repeats that this includes simple remote shared-world or turn-based games. Itch.io *does* host game pages, uploads, download files and [browser-playable static HTML/JavaScript builds](https://itch.io/docs/creators/html5). **The hosted game package and live multiplayer gameplay backend are different services.**

A [2022 forum response](https://itch.io/t/2090071/is-it-okay-to-use-an-external-server) indicates a hosted browser client may connect to separately supplied external services. That does **not** prove a particular deployment's HTTPS, CORS, networking or security works; such runtime behavior requires testing.

For a first commercial release, assess game architecture before setting a cost assumption. An **offline single-player** game has no inherent custom online multiplayer-server cost. A **LAN/peer-hosted** game may avoid a publisher-owned always-on dedicated server, but could still have networking, NAT, relay or support costs. An **online dedicated-server game** requires the publisher or an external service to supply execution, maintenance, incident response and any relevant storage and bandwidth. Price, capacity, uptime and actual sales are all currently **unmeasured**.

Therefore a zero-dollar itch.io **listing fee** is not equivalent to a guaranteed zero-cost online service. No hosting contract, public server, game client, multiplayer play session or buyer data was accessed. This document does not invent a median server expense or imply that most itch.io games require servers.
