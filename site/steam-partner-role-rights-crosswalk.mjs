// Official public Steamworks roles, represented as synthetic process states only.
// Never provide private partner accounts, app identifiers, payee names or agreement text.
const isRecord=x=>x&&typeof x==='object'&&!Array.isArray(x);
const keys=['arrangement','finance_invite_granted','user_view_financials','historic_financial_access_granted'];
export function auditSteamPartnerRoleFixture(x={}){
 if(!isRecord(x)||Object.keys(x).some(k=>!keys.includes(k)))
  throw new TypeError('Only synthetic arrangement and public role flags are permitted');
 const kind=x.arrangement;
 if(!['app_share','completed_app_transfer','storefront_credit_only'].includes(kind))
  throw new TypeError('Unknown Steamworks arrangement');
 const finance=x.finance_invite_granted??false,view=x.user_view_financials??false,historic=x.historic_financial_access_granted??false;
 if([finance,view,historic].some(v=>typeof v!=='boolean'))
  throw new TypeError('Permission flags must be booleans');
 if(kind!=='app_share'&&finance)throw new RangeError('Finance invite flag applies only to application sharing');
 if(kind!=='completed_app_transfer'&&historic)
  throw new RangeError('Historic transfer finance grant applies only to completed transfers');
 if(kind==='storefront_credit_only'&&view)
  throw new RangeError('A public credit cannot establish a private user financial permission');
 const shared=kind==='app_share',transferred=kind==='completed_app_transfer';
 return {
  kind:'synthetic_public_documentation_role_separation_not_a_rights_or_income_audit',
  arrangement:kind,
  recipient_has_app_management_access:shared||transferred?true:null,
  recipient_partner_payment_rights:transferred?true:null,
  original_partner_retains_payment_rights:shared?true:transferred?false:null,
  sharing_itself_changes_payment_rights:shared?false:null,
  sharing_itself_grants_pricing_rights:shared?false:null,
  recipient_partner_can_set_prices_and_discounts:transferred?true:null,
  pricing_control_requires_payment_rights:true,
  recipient_user_can_view_current_partner_financials:shared?finance&&view:transferred?view:null,
  recipient_user_can_view_historical_pretransfer_financials:transferred?historic&&view:null,
  recipient_has_historical_wishlist_reporting:transferred?true:null,
  appid_public_content_and_existing_customer_access_preserved_by_transfer:transferred?true:null,
  actual_copyright_owner:null,actual_signed_SDA_license_grants:null,
  actual_developer_publisher_royalty_split:null,real_partner_bank_receipts:null,
  individual_user_can_set_pricing:null,
  caveat:'Only documented Steamworks operational role consequences; legal IP rights and actual individual permissions require authorized private evidence.'
 };
}
