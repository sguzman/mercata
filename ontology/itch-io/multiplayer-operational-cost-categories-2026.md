# Live multiplayer operations and cost boundaries (October 27, 2026)

**Population / unit.** A hypothetical independently published multiplayer game on itch.io; units are operational responsibility and possible monthly resource charges, **not** a typical publisher's measured costs.

The [HTML5 guide](https://itch.io/docs/creators/html5) describes hosting browser game files and client assets. Earlier [moderated server-hosting discussions](https://itch.io/t/1307413/does-itchio-host-cloud-servers) distinguish static uploads from independently operated multiplayer backends. An [October 2026 publisher project](https://waseemk1204.itch.io/killbook) describes a browser client with externally hosted live servers. That case is a self-description, not independently audited technical operation or pricing.

## Cost and QA accounting required for an online release

| Obligation | What would need to be measured | Required QA |
| --- | --- | --- |
| Compute and capacity | instance-hours, peak sessions, resources | Peak-load and idle behavior |
| Bandwidth | ingress/egress GB, request counts | Bursts and provider allowance |
| Uptime and incidents | outage minutes, recovery work | Monitoring, failure recovery and support |
| Moderation and abuse | event volume and review hours | Reporting and privacy safeguards |
| Maintenance and security | update, patch and deploy hours | Backup/restore and dependency updates |
| Provider dependency | billing plan, caps, deprecation | Contract terms and exit plan |

A fully offline solo game has zero **incremental dedicated multiplayer-server fees** under that precise definition. A LAN-only design need not include a dedicated public match server, but still incurs client engineering and testing. A networked design requires its own architecture/cost assessment. Each actual monthly fee and all typical cash and labor amounts remain **unknown** until invoices, tests and time logs exist.

This completes a documented operating-risk and research-collection matrix, not a functioning multiplayer deployment, observed sale, audited hosting bill or profit forecast. [Machine-readable obligations](multiplayer-operational-cost-categories-2026.json).
