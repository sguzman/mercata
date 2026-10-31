// Dated public aggregate tag counts, not game rows or initially-paid release counts.
// One game can belong to multiple tags; snapshots can differ across provider refreshes.
const only=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>keys.includes(k));
const count=n=>Number.isSafeInteger(n)&&n>0;
const isoDay=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&
 Number.isFinite(Date.parse(s+'T00:00:00Z'))&&
 new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;

const oneDecimal=n=>Math.round((n+Number.EPSILON)*10)/10;
export function auditPublicSteamTagReleaseYearSupply(input={}){
 if(!only(input,['provider','observed_on','year_totals','tag_rows'])||
  input.provider!=='GameCharts'||!isoDay(input.observed_on)||!input.observed_on.startsWith('2026-')||
  !Array.isArray(input.year_totals)||input.year_totals.length!==2||
  !Array.isArray(input.tag_rows)||input.tag_rows.length<2||input.tag_rows.length>10)
  throw new TypeError('Two adjacent annual catalog totals and bounded public tag aggregates required');
 const totals=new Map();
 for(const r of input.year_totals){
  if(!only(r,['year','store_game_releases'])||!Number.isInteger(r.year)||
    ![2024,2025].includes(r.year)||totals.has(r.year)||!count(r.store_game_releases))
   throw new TypeError('Unique 2024/2025 game release denominators required');
  totals.set(r.year,r.store_game_releases);
 }
 if(totals.size!==2)throw new TypeError('Both year denominators required');
 const tags=new Set(),sourceIds=new Set(),rows=[];
 for(const r of input.tag_rows){
  if(!only(r,['tag','release_count_2024','release_count_2025','provider_share_pct_2024','provider_share_pct_2025','source_id'])||
    typeof r.tag!=='string'||!/^[A-Za-z][A-Za-z ]{1,38}$/.test(r.tag)||tags.has(r.tag)||
    typeof r.source_id!=='string'||!/^steam-gamecharts-[a-z0-9-]+$/.test(r.source_id)||sourceIds.has(r.source_id)||
    !Number.isSafeInteger(r.release_count_2024)||r.release_count_2024<0||
    !Number.isSafeInteger(r.release_count_2025)||r.release_count_2025<0||
    r.release_count_2024>totals.get(2024)||r.release_count_2025>totals.get(2025)||
    !Number.isFinite(r.provider_share_pct_2024)||!Number.isFinite(r.provider_share_pct_2025))
    throw new TypeError('Invalid or duplicate public tag aggregate');
  const pct24=oneDecimal(100*r.release_count_2024/totals.get(2024));
  const pct25=oneDecimal(100*r.release_count_2025/totals.get(2025));
  if(Math.abs(pct24-r.provider_share_pct_2024)>0.1000001||
     Math.abs(pct25-r.provider_share_pct_2025)>0.1000001)
   throw new RangeError('Reported tag shares disagree with stated release-year denominators');
  tags.add(r.tag);sourceIds.add(r.source_id);
  rows.push(Object.freeze({
   tag:r.tag,source_id:r.source_id,reported_2024_releases:r.release_count_2024,
   reported_2025_releases:r.release_count_2025,
   reported_2024_share_percent:r.provider_share_pct_2024,
   reported_2025_share_percent:r.provider_share_pct_2025,
   additional_tagged_release_records_2025:r.release_count_2025-r.release_count_2024,
   relative_annual_count_change_percent:r.release_count_2024?
    100*(r.release_count_2025/r.release_count_2024-1):null,
   reported_share_change_percentage_points:
    oneDecimal(r.provider_share_pct_2025-r.provider_share_pct_2024)
  }));
 }
 return Object.freeze({
  kind:'public_provider_year_tag_release_count_comparison_not_paid_sales',
  provider:input.provider,observed_on:input.observed_on,
  overall_2024_store_game_releases:totals.get(2024),
  overall_2025_store_game_releases:totals.get(2025),
  year_comparable_as_provider_release_year_labels:true,
  tags_are_nonexclusive_and_can_change_over_time:true,
  tag_pages_may_have_different_refresh_times:true,
  row_count:rows.length,rows,
  unique_games_across_selected_tags:null,
  exact_simultaneous_tag_overlap:null,
  original_paid_release_counts_by_tag:null,
  refund_adjusted_sales_by_tag:null,
  representative_creator_income_by_tag:null,
  exact_zero_paid_sale_fraction_by_tag:null,
  caveat:'Source-reported tags are presently assigned and can overlap. Provider counts are revised and source pages need not share an instant. No historical original paid status, individual sales, duplicate-free genre union or legally attributed revenue is measured.'
 });
}
