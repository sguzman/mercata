# Steam low-budget publishing: legal payee options, entity migration and known fee floor

**Reviewed October 29, 2026.** [Structured public-source audit](steam-sole-proprietor-versus-company-form-cash-gates-2026.json) · [synthetic checklist and budget](../../site/steam-legal-payee-budget-gates.mjs) · [tests](../../tests/steam-legal-payee-budget-gates.test.mjs). This is not legal or tax advice; no account, legal identity, signed agreement or bank records were accessed. Sources: Valve's [Onboarding FAQ](https://partner.steamgames.com/doc/gettingstarted/faq?language=english), [Onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding?l=english), and [Steam Direct fee](https://partner.steamgames.com/doc/gettingstarted/appfee?l=english).

## Being a Steamworks publisher does not universally require incorporation

Valve permits an individual who owns the publishing rights to enroll as a **sole proprietor under their own full legal name**, matching that name on bank and tax records. A brand, public studio name or DBA is not interchangeable with the contracting legal payee. The Onboarding FAQ presents forming a corporation as a jurisdiction- and business-dependent choice; **incorporation is not a universal Steam Direct prerequisite**.

A publisher choosing to create an incorporated business must form it **before Steamworks digital paperwork**. A partnership may also be eligible, with additional individual-partner tax details where it is outside the United States and taxed at the partner rather than entity level. Steamworks requires valid bank and tax information before release regardless of legal form. These public requirements say nothing conclusive about a particular user's legal capacity, local licenses, income taxes or liability exposure.

## Changing the legal payee is not a storefront rebrand

Valve's FAQ describes changing the contracting legal company's name and matching bank/tax information as a **new partner onboarding**, followed by legal paperwork terminating the old entity's IP rights and moving games to the newly formed partner. This is materially different from editing a visible developer or publisher brand. It may carry time, legal and financial costs; **the public guidance gives no universal migration fee or completion deadline**.

## Published Steam application fee versus unknown complete startup budget

| Hypothetical registration path | New paid product AppIDs | Published Steam Direct application fees |
| --- | ---: | ---: |
| Individual / sole proprietor | 1 | USD 100 |
| Newly formed company | 1 | USD 100, plus unmeasured incorporation and administration |
| Partnership | 2 | USD 200, plus unmeasured legal and partner-tax documentation |

Valve describes the **USD 100 fee per product** as nonrefundable, with a separate possible recoupment after that same product reaches **USD 1,000 adjusted gross revenue** from relevant Steam receipts. Recoupment is not a promise of profit, of reaching that sales threshold, or of reimbursing labor. The figures above are a **published fee floor**, not full startup costs; bank setup, localization, development time, customer support, legal fees, withholding, taxes, marketing, FX and entity formation vary by jurisdiction and circumstances.

The [pure synthetic audit](../../site/steam-legal-payee-budget-gates.mjs) flags missing matching-name, rights, formation, tax validation and migration prerequisites without claiming a real developer is authorized to publish. It returns null for all actual local registration expenses, legal eligibility, tax outcomes, bank remittances and after-cost income. It neither creates an account nor identifies any private operator.
