# Repeat paid purchases across a Steam game series

**Reviewed October 28, 2026.** [Structured study](series-repeat-payers-2026.json). This defines the question but has no customer financial records.

[Franchise pages](https://partner.steamgames.com/doc/store/franchise_pages?language=english) and [creator homepages](https://partner.steamgames.com/doc/store/creator_homepage?language=english) can notify followers of new games. **Followers aren't necessarily prior buyers**. [Complete the Set bundles](https://partner.steamgames.com/doc/store/application/bundles?language=english) charge only for content a recipient doesn't already own; gifts make the payer and license recipient potentially different people. Steam's [ownership verification](https://partner.steamgames.com/doc/features/auth) checks a license, which can originate in a gift, key or free offer and **is not proof of the account owner's paid checkout**.

To measure repeat paid buying, define a cohort of distinct verified *payers* of game A and ask how many of those same payers separately purchased game B within a fixed window, with explicit refunds, gifting, multi-app packages and transfers. The numerator must not count bundle items, duplicate grants or keys as separate base-game orders. Steam's public AppID fields and even aggregate [financial lines](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english) are insufficient to identify same-person purchases without appropriate authorization.

No user identities have been accessed or stored. A legitimate future study must obtain permission for appropriately minimized, privacy-protected aggregated overlaps. **The repeat payer fraction and after-cost developer benefit remain unknown.**
