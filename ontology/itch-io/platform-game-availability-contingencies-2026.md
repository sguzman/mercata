# itch.io release survival and customer access: source-backed contingency plan

**Reviewed October 26, 2026.** [Machine action matrix](platform-game-availability-contingencies-2026.json). This is a **contingency design for a hypothetical game**, not a tested archive, live account recovery, website outage monitor or guaranteed buyer entitlement.

Official [access control documentation](https://itch.io/docs/creators/access-control) separates states that must not be conflated:

| Event | What official rules support | Publisher response |
|---|---|---|
| Public page removed from discovery (unlisted) | Page can remain reachable from its URL or profile, but its indexed discovery is restricted | Preserve links and distinguish traffic loss from lost purchase access |
| Disable **new** downloads and purchases | Public page remains visible; previous owners retain access to uploaded files | Keep files versioned; verify available owner downloads before changing state |
| Move a previously public page to **draft** | The operator warns people who formerly had access cannot visit the page until public again | Do not treat draft as a harmless pause for paying customers |
| Restricted project | Only approved access via keys/password, subject to revocation | Document owners' entitlement flow and potential revoked-key consequences |
| UK adult-content classification (July 2025) | Operator said UK-restricted titles' earlier purchasers could continue retrieving files from their library or app *for the time being* | Do not promise future unrestricted access or infer sales losses from tag-only restrictions |
| Platform shutdown/outage | No source-backed lifetime uptime guarantee | Maintain developer-owned game files, checksums and restore instructions; buyers are encouraged by itch.io to preserve their own DRM-free backups |

The [download-key guide](https://itch.io/docs/creators/download-keys) states that a key can follow a purchase, be issued manually, or be claimed through some zero-price bundles. An account export of keys is neither a count of paying people nor a safe public data source. Updates to uploaded files affect what current owners can retrieve, and deleting older binaries can defeat the practical benefit of surviving ownership.

## Evidence-gated publisher controls

The research plan requires a versioned copy of publisher-owned source/art, each released binary/build channel, file hashes, a restore test, and a clear mapping of which versions still work on supported platforms. In an actual launch, separately audit whether third-party licensed media and libraries can be redistributed from a second website. Any public instructions to prior owners must not promise redemption on another store without an actual entitlement facility.

No seller account, purchased game file, customer list, checkout or recovery process was accessed in this investigation. The machine data records zero executed restoration tests and no backup verified; it does not mistake a plan for operational resilience. Neither outage frequency nor lost revenue is known.

This satisfies the fixed task **to plan for backup, delisting, geographic restrictions and purchaser-file availability**. It does not resolve actual game backup quality, individual rights, alternative hosting costs or customer retrieval outcomes.
