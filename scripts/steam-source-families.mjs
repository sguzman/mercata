// Validate known reused Steam source families independently of the claimed research facts.
// A family's cited URL count cannot be treated as an independent game sample count.
import {auditPublicSources} from './source-provenance.mjs';
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
export function auditSteamSourceFamilies(evidence,claims,registry){
 if(!Array.isArray(evidence)||!Array.isArray(claims)||!registry||
    registry.platform!=='steam'||registry.schema_version!==1||
    !Array.isArray(registry.families)||!Array.isArray(registry.related_documents_not_independent_replications))
  throw new TypeError('Steam source family registry and evidence required');
 const publicAudit=auditPublicSources(evidence,claims,registry);
 const byId=new Map(evidence.map(x=>[x.id,x])),seen=new Set(),familyIds=new Set(),errors=[];
 const expected=['same_underlying_dataset_different_urls'];
 for(const f of registry.families){
  if(!nonempty(f.id)||familyIds.has(f.id)){errors.push('Duplicate or empty family ID');continue}
  familyIds.add(f.id);
  if(!expected.includes(f.relation)||!Number.isSafeInteger(f.documented_selected_games)||
     f.documented_selected_games<=0||!nonempty(f.observed_population)||!nonempty(f.independence))
   errors.push('Incomplete reused sample family: '+f.id);
  for(const id of f.source_ids||[]){
   if(seen.has(id))errors.push('Source in multiple primary families: '+id);
   seen.add(id);
   if(!byId.has(id))errors.push('Missing family source: '+id);
  }
 }
 const relatedIds=new Set();
 for(const rel of registry.related_documents_not_independent_replications){
  if(!nonempty(rel.source_id)||relatedIds.has(rel.source_id)||
     !byId.has(rel.source_id)||!familyIds.has(rel.related_family_id)||
     !nonempty(rel.relation)||!nonempty(rel.notes)||seen.has(rel.source_id))
   errors.push('Invalid related but distinct sample: '+rel.source_id);
  relatedIds.add(rel.source_id);
 }
 if(publicAudit.unregistered_duplicate_documents.length)
  errors.push('Unregistered normalized duplicate URL');
 if(publicAudit.invalid_source_family_records.length)
  errors.push('Invalid family records: '+publicAudit.invalid_source_family_records.join(', '));
 if(publicAudit.missing_claim_sources.length)
  errors.push('Claims reference unknown family evidence');
 if(registry.independent_study_count!==null||registry.authenticated_merchant_sales_records!==null)
  errors.push('Independent study and merchant sale totals must remain unidentified');
 return {valid:errors.length===0,errors,registered_reused_cohort_families:registry.families.length,
  related_distinct_sample_documents:relatedIds.size,
  source_references:evidence.length,claim_count:claims.length,
  unique_data_studies_in_entire_steam_dossier:null,
  verified_paid_order_count:null,
  limitation:'This graph tracks declared reused sources, not underlying dataset access or proof of independent sampling.'};
}
