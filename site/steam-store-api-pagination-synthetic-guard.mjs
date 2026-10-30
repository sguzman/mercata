// Synthetic page-chain audit. No API request, no credentials, no actual numeric Steam AppIDs.
const keys=new Set(['fixture_id','max_results','include_games','if_modified_since','pages']);
const pageKeys=new Set(['page_id','requested_last_appid','items','declared_final_page']);
const itemKeys=new Set(['fixture_appid','last_modified','price_change_number']);
const app=s=>typeof s==='string'&&/^fixture-app-[0-9]{6}$/.test(s)&&Number(s.slice(12))>0;
const pageId=s=>typeof s==='string'&&/^fixture-page-[a-z0-9-]+$/.test(s);
export function auditSyntheticSteamStorePages(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!keys.has(k))||
  typeof input.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(input.fixture_id)||
  !Number.isSafeInteger(input.max_results)||input.max_results<1||input.max_results>50000||
  input.include_games!==true||
  !(input.if_modified_since===null||Number.isSafeInteger(input.if_modified_since)&&input.if_modified_since>0)||
  !Array.isArray(input.pages)||input.pages.length<1||input.pages.length>20)
  throw new TypeError('Expected bounded synthetic current-game-list pages');
 const pageIds=new Set(),appIds=new Set();let last=null,count=0;
 for(const [idx,entry] of input.pages.entries()){
  if(!entry||typeof entry!=='object'||Array.isArray(entry)||Object.keys(entry).some(k=>!pageKeys.has(k))||
   !pageId(entry.page_id)||pageIds.has(entry.page_id)||!Array.isArray(entry.items)||
   entry.items.length>input.max_results||typeof entry.declared_final_page!=='boolean'||
   entry.requested_last_appid!==last||(entry.declared_final_page&&idx!==input.pages.length-1)||
   (!entry.declared_final_page&&entry.items.length===0))
   throw new TypeError('Incomplete, malformed or incorrectly continued page chain');
  pageIds.add(entry.page_id);
  for(const item of entry.items){
   if(!item||typeof item!=='object'||Array.isArray(item)||Object.keys(item).some(k=>!itemKeys.has(k))||
    !app(item.fixture_appid)||appIds.has(item.fixture_appid)||
    last!==null&&item.fixture_appid<=last||
    !Number.isSafeInteger(item.last_modified)||item.last_modified<0||
    !Number.isSafeInteger(item.price_change_number)||item.price_change_number<0)
    throw new TypeError('Duplicate, out-of-order or untrusted synthetic game metadata');
   appIds.add(item.fixture_appid);last=item.fixture_appid;count++;
  }
 }
 const chainComplete=input.pages.at(-1).declared_final_page===true;
 return Object.freeze({
  internally_valid_synthetic_cursor_chain:true,
  supplied_pages:input.pages.length,
  supplied_distinct_items:count,
  declared_terminal_page_seen:chainComplete,
  modified_only_delta:input.if_modified_since!==null,
  declared_full_current_game_frame:chainComplete&&input.if_modified_since===null,
  full_historical_first_paid_frame:null,
  actual_completed_merchant_paid_orders:null,
  zero_paid_sale_app_fraction:null,
  verified_publisher_income:null,
  api_call_executed:false,
  credential_used:false
 });
}
