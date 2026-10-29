# Steam eligibility: two official public rule lists and the Content Survey boundary

**Reviewed October 29, 2026.** [Structured source comparison](steam-content-eligibility-page-drift-and-ai-disclosure-2026.json) · [deterministic rule audit](../../site/steam-content-eligibility-crosswalk.mjs) · [regression tests](../../tests/steam-content-eligibility-crosswalk.test.mjs). Only Valve's public guidance was read; no Steamworks partner contract, unpublished review decision or customer data was accessed.

## An omission on the public landing page is not an exemption

On this review date, Valve's [Steam Direct public landing page](https://partner.steamgames.com/steamdirect) listed **14** content restrictions. Its more detailed [Steamworks onboarding guide](https://partner.steamgames.com/doc/gettingstarted/onboarding?l=english) listed **15**. The shared list covered safety, legal rights, unlawful or harmful materials, cryptocurrency/NFT issuance or exchange, and advertising-based business models. The additional onboarding item addresses content that may conflict with rules of payment processors, card networks, banks or internet providers, particularly some adult-only content.

The two current pages disagree in **list completeness**, but this is **not evidence of an amendment date**, rollback, waived contractual condition, or real enforcement frequency. The [executable crosswalk](../../site/steam-content-eligibility-crosswalk.mjs) detects the exact missing category without claiming which contract terms apply to a particular developer.

## Survey completion is a review prerequisite, not approval

Valve's [Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey?l=english&language=english) must be completed before store/build review. The official FAQ says disclosure is not permission to publish otherwise disallowed content. General, mature and generative-AI sections address different review surfaces; all mature content uploaded into builds must be disclosed even if currently inaccessible to players. Some approved survey fields require Steam Support intervention for later changes.

Pre-generated AI content consumed by players is reviewed under normal legality, intellectual-property and marketing-consistency obligations. Live-generated AI additionally requires disclosure of safeguards against illegal output. Valve currently says it will not distribute adult-only sexual content generated live during gameplay. These conditions are **not** a blanket ban on all AI-based games.

Valve describes possible supported payment routes for a live AI service with recurring inference costs: include costs in the base price, charge per interaction through microtransactions, use subscriptions, or sell DLC access. Those are examples, not promises of content approval, a particular fee rate, or profitability.

## Synthetic decision aid and economic unknowns

The machine model tests hypothetical ordinary, advertising-funded, AI-output and potentially payment-network-sensitive products. It distinguishes documented blockers from unresolved processor review, and **always returns unknown for actual Steam approval**. The categories cannot establish market rejection rates, lost revenue, specific payment processor decisions, legal publisher rights or after-cost publisher income. Eligibility and public documentation are independent of a signed Steam Distribution Agreement.
