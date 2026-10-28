# Steam Families: why players are not paid buyers

**Reviewed October 28, 2026.** [Structured evidence](family-sharing-players-versus-paid-licenses-2026.json). This study distinguishes player accounts, permanent licenses, borrowers, and payment events. It does **not** measure adoption or real earnings.

According to [Steam Families for developers](https://partner.steamgames.com/doc/features/families?l=english&language=english) and the [Steam consumer FAQ](https://help.steampowered.com/en/faqs/view/054C-3167-DD7F-49D4), a family can have up to six members. A game stays **owned by the purchaser** while other members may borrow it. One copy supports one simultaneous game session among members; to play the same game at the same time, two family members need **two owned copies**. Several members can play it in turn and retain separate achievements or saves. Thus player accounts and owned copies are not interchangeable.

Sharing is generally on by default but publishers may opt out, and third-party account/subscription requirements, regional restrictions, OS compatibility and private-game settings can prevent sharing. Steam's FAQ also excludes Free to Play games and their purchased DLC from sharing. Adults may pay for a child's purchase request while ownership goes to the child, introducing another **payer-versus-license-holder** distinction.

## Developer checks and data limits

Valve documents `ISteamApps::BIsSubscribedFromFamilySharing` and `ISteamApps::GetAppOwner` for client checks, and the more secure backend `ISteamUser/CheckAppOwnership` for legitimate entitlement validation. A shared copy yields `permanent=false`, with its original owner's ID; borrowed access should never generate permanent backend rights. These interfaces are **not finance records**, and actual customer identifiers were not accessed or collected.

A release-cohort study must keep separate: (1) gross Steam orders and refund-adjusted paid sales, (2) permanent licenses including gifts and external keys, (3) temporary borrowers, and (4) distinct people/accounts who played during a defined period. Counting multiple borrowers as additional orders inflates revenue estimates; equating a purchaser with the current license holder can also fail. The [synthetic validator](../../site/steam-family-license-units.mjs) demonstrates the unit difference without data about real individuals.

**Still unknown:** total unique purchasers, actual family borrowing prevalence, the players-per-paid-copy ratio, game-specific adoption and any developer revenue effect of Family Sharing. All of these need legitimate permissioned evidence.
