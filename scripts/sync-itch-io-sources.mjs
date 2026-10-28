// Keep current itch.io source metadata counts aligned to the published dossier.
// This rewrites current summaries only; original historical research checkpoints remain untouched.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {publicSourceDocumentKey} from '../site/itch-source-register-audit.mjs';

export const auditFiles = Object.freeze([
 'ontology/itch-io/research-synthesis-2026.json',
 'ontology/itch-io/research-synthesis-2026.md',
 'ontology/itch-io/public-source-and-private-purchase-reuse-gates-2026.json',
 'ontology/itch-io/public-source-and-private-purchase-reuse-gates-2026.md',
 'ontology/itch-io/source-reuse-record-completeness-2026.json',
 'ontology/itch-io/source-reuse-record-completeness-2026.md',
 'ontology/itch-io/source-url-identity-audit-2026.json',
 'ontology/itch-io/source-url-identity-audit-2026.md'
]);

export function itchSourceStats(dossier) {
 if(!dossier || !Array.isArray(dossier.evidence) || !Array.isArray(dossier.claims))
  throw new TypeError('A full published source and claim dossier is required');
 let exactDay=0, monthOnly=0, unknownDate=0;
 const urls=new Map();
 for(const source of dossier.evidence) {
  if(typeof source.url!=='string'||!source.url.startsWith('https://')||typeof source.id!=='string')
   throw new TypeError('Public source URL and identifier required');
  urls.set(source.url,[...(urls.get(source.url)||[]),source.id]);
  if(source.published_at===null)unknownDate++;
  else if(typeof source.published_at==='string' && /^\d{4}-\d{2}-\d{2}$/.test(source.published_at))exactDay++;
  else if(typeof source.published_at==='string' && /^\d{4}-\d{2}$/.test(source.published_at))monthOnly++;
  else throw new Error('Unexpected publication date precision in source record');
 }
 const duplicateUrlGroups=[...urls.entries()].filter(([,ids])=>ids.length>1)
  .map(([url,source_ids])=>({url,source_ids:source_ids.slice().sort()}))
  .sort((a,b)=>a.url.localeCompare(b.url,'en'));
 const repeatedUrlClaimIds=[];
 const byId=new Map(dossier.evidence.map(e=>[e.id,publicSourceDocumentKey(e.url)]));
 for(const claim of dossier.claims) {
  if(!Array.isArray(claim.source_ids))throw new TypeError('Claim source_ids must be an array');
  const keys=claim.source_ids.map(id=>byId.get(id));
  if(keys.some(x=>!x))throw new TypeError('Claim refers to unknown public source');
  if(new Set(keys).size!==keys.length)repeatedUrlClaimIds.push(claim.id);
 }
 return {sourceCount:dossier.evidence.length,claimCount:dossier.claims.length,
  exactDay,monthOnly,unknownDate,distinctUrlCount:urls.size,
  duplicateUrlGroups,aliasExcessRecordCount:dossier.evidence.length-urls.size,
  claimsRepeatingOneUrl:repeatedUrlClaimIds.sort()};
}

function replaceOnce(source,regex,replacement,label) {
 const all=[...source.matchAll(new RegExp(regex.source,regex.flags.includes('g')?regex.flags:regex.flags+'g'))];
 if(all.length!==1)throw new Error(label+' requires exactly one anchored field, found '+all.length);
 return source.replace(regex,replacement);
}

export function alignItchSourceAudit(filename,source,stats) {
 const {sourceCount,claimCount,exactDay,monthOnly,unknownDate,distinctUrlCount,
  duplicateUrlGroups,aliasExcessRecordCount,claimsRepeatingOneUrl}=stats;
 if(![sourceCount,claimCount,exactDay,monthOnly,unknownDate].every(x=>Number.isSafeInteger(x)&&x>=0)||
    exactDay+monthOnly+unknownDate!==sourceCount||
    !Number.isSafeInteger(distinctUrlCount)||distinctUrlCount<0||distinctUrlCount>sourceCount||
    aliasExcessRecordCount!==sourceCount-distinctUrlCount||
    !Array.isArray(duplicateUrlGroups)||!Array.isArray(claimsRepeatingOneUrl))
   throw new TypeError('Invalid source register summary');
 if(filename.endsWith('.json')) {
  const data=JSON.parse(source);
  switch(filename) {
   case 'ontology/itch-io/research-synthesis-2026.json':
    data.latest_evidence_summary.source_records=sourceCount;
    data.latest_evidence_summary.claims=claimCount;
    break;
   case 'ontology/itch-io/public-source-and-private-purchase-reuse-gates-2026.json':
    data.dossier_review.source_records=sourceCount;
    data.dossier_review.bounded_claim_records=claimCount;
    break;
   case 'ontology/itch-io/source-reuse-record-completeness-2026.json': {
    data.sources_in_fixed_dossier=sourceCount;
    data.claims_in_fixed_dossier=claimCount;
    const c=data.record_field_coverage;
    for(const name of ['source_urls_recorded','retrieved_dates_recorded','source_publisher_or_authors_recorded','source_evidence_class_recorded','source_license_or_reuse_note_recorded'])
     c[name]=sourceCount;
    c.known_exact_publication_day=exactDay;
    c.known_publication_month_only=monthOnly;
    c.publication_date_unverified=unknownDate;
    break;
   }
   case 'ontology/itch-io/source-url-identity-audit-2026.json': {
    data.public_source_record_count=sourceCount;
    data.distinct_url_string_count=distinctUrlCount;
    data.alias_excess_record_count=aliasExcessRecordCount;
    data.alias_group_count=duplicateUrlGroups.length;
    data.alias_document_groups=duplicateUrlGroups;
    data.source_ids=duplicateUrlGroups.flatMap(g=>g.source_ids);
    data.claim_ids_using_same_url_twice=claimsRepeatingOneUrl;
    break;
   }
   default: throw new Error('Unsupported source audit: '+filename);
  }
  return JSON.stringify(data,null,2)+'\n';
 }
 switch(filename) {
  case 'ontology/itch-io/research-synthesis-2026.md':
   return replaceOnce(source,/\b\d+ attributed sources and \d+ bounded claims\b/,
    sourceCount+' attributed sources and '+claimCount+' bounded claims',filename);
  case 'ontology/itch-io/public-source-and-private-purchase-reuse-gates-2026.md':
   return replaceOnce(source,/\b\d+ registered sources and \d+ bounded claims\b/,
    sourceCount+' registered sources and '+claimCount+' bounded claims',filename);
  case 'ontology/itch-io/source-reuse-record-completeness-2026.md': {
   let out=replaceOnce(source,/All \*\*\d+\*\* source records/,
    'All **'+sourceCount+'** source records',filename+' sources');
   out=replaceOnce(out,/contains \*\*\d+\*\* bounded statements/,
    'contains **'+claimCount+'** bounded statements',filename+' claims');
   for(const [field,value] of [
    ['Known YYYY-MM-DD',exactDay],['Known month only',monthOnly],['Unverified',unknownDate],['\\*\\*Total\\*\\*',sourceCount]
   ]) {
    const label=new RegExp('^\\| '+field+' \\| (?:\\*\\*)?\\d+(?:\\*\\*)? \\|','m');
    out=replaceOnce(out,label,'| '+field.replaceAll('\\','')+' | '+(field==='\\*\\*Total\\*\\*'?'**'+value+'**':value)+' |',filename+' '+field);
   }
   return out;
  }
  case 'ontology/itch-io/source-url-identity-audit-2026.md': {
   if(!source.includes('<!-- generated itch.io source URL identity audit -->'))
    throw new Error('Missing source URL identity audit anchor');
   const rows=duplicateUrlGroups.map(group=>
    '| [Public document]('+group.url+') | '+group.source_ids.map(id=>'\x60'+id+'\x60').join(', ')+' |'
   ).join('\n');
   return [
    '<!-- generated itch.io source URL identity audit -->',
    '# Public source URL identities and duplicate registry records',
    '',
    '**Reviewed October 28, 2026.** This dataset currently has **'+sourceCount+' source records** but only **'+distinctUrlCount+' distinct URL strings**. The **'+duplicateUrlGroups.length+
     ' repeated-URL groups** account for **'+aliasExcessRecordCount+' additional registry records**, which do not provide independent corroboration.',
    '',
    'Two evidence IDs for one URL may document different claims or dates, but the underlying URL is one public document. Counts of distinct URL strings are not a count of independent people, publishers, publications or research methods.',
    '',
    '| Document | Registry evidence IDs for that document |',
    '|---|---|',
    rows||'| None | — |',
    '',
    'Claims citing one document through more than one registry ID: **'+claimsRepeatingOneUrl.length+'**. The claim-level audit also detects URL fragments, hostname case, and default HTTPS-port aliases as the same fetched document.',
    '',
    'Exact distinct URL-string counts are retained for comparability. Query strings and paths remain significant; redirects, mirrors, republications and syndication may still yield different URLs for one underlying work.',
    '',
    'No existing evidence ID or claim source reference was removed. See [machine record](source-url-identity-audit-2026.json).',
    ''
   ].join('\n');
  }
  default: throw new Error('Unsupported source audit: '+filename);
 }
}

export function syncItchSourceAudits(root=process.cwd()) {
 const dossier=JSON.parse(fs.readFileSync(path.join(root,'specimens/itch-io.json'),'utf8'));
 const stats=itchSourceStats(dossier),changed=[];
 for(const file of auditFiles) {
  const target=path.join(root,file);
  const before=fs.readFileSync(target,'utf8');
  const after=alignItchSourceAudit(file,before,stats);
  if(after!==before){fs.writeFileSync(target,after);changed.push(file);}
 }
 return {stats,changed};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const result=syncItchSourceAudits(process.cwd());
 process.stdout.write('itch.io source audit: '+result.stats.sourceCount+' sources, '+result.stats.claimCount+
  ' claims; '+(result.changed.length?result.changed.join(', '):'already synced')+'\n');
}
