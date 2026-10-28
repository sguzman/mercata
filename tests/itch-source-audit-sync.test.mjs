import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditFiles,itchSourceStats,alignItchSourceAudit} from '../scripts/sync-itch-io-sources.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('All current source audits are idempotently aligned to the canonical dossier',()=>{
 const stats=itchSourceStats(JSON.parse(read('specimens/itch-io.json')));
 assert.equal(stats.exactDay+stats.monthOnly+stats.unknownDate,stats.sourceCount);
 assert.equal(stats.distinctUrlCount,new Set(JSON.parse(read('specimens/itch-io.json')).evidence.map(s=>s.url)).size);
 assert.equal(stats.aliasExcessRecordCount,stats.sourceCount-stats.distinctUrlCount);
 for(const file of auditFiles)assert.equal(alignItchSourceAudit(file,read(file),stats),read(file),file+' has stale counters');
});
test('Adding one source and claim propagates only live audit counters, not historical extraction metadata',()=>{
 const before=itchSourceStats(JSON.parse(read('specimens/itch-io.json')));
 const changed={...before,sourceCount:before.sourceCount+1,claimCount:before.claimCount+1,exactDay:before.exactDay+1,distinctUrlCount:before.distinctUrlCount+1};
 const historical=JSON.parse(read('ontology/itch-io/research-synthesis-2026.json'));
 const after=JSON.parse(alignItchSourceAudit('ontology/itch-io/research-synthesis-2026.json',
  read('ontology/itch-io/research-synthesis-2026.json'),changed));
 assert.equal(after.latest_evidence_summary.source_records,changed.sourceCount);
 assert.equal(after.latest_evidence_summary.claims,changed.claimCount);
 assert.equal(after.source_records,historical.source_records);
 assert.equal(after.claims,historical.claims);
 assert.equal(after.latest_evidence_summary.task_mean_exact_percent,historical.latest_evidence_summary.task_mean_exact_percent);
 const md=alignItchSourceAudit('ontology/itch-io/source-reuse-record-completeness-2026.md',
  read('ontology/itch-io/source-reuse-record-completeness-2026.md'),changed);
 assert(md.includes('All **'+changed.sourceCount+'** source records'));
 assert(md.includes('| Known YYYY-MM-DD | '+changed.exactDay+' |'));
 assert(md.includes('| **Total** | **'+changed.sourceCount+'** |'));
});
test('Incomplete dates and unsupported output paths fail closed',()=>{
 const broken={evidence:[{published_at:'yesterday'}],claims:[]};
 assert.throws(()=>itchSourceStats(broken),/precision/);
 const stats=itchSourceStats(JSON.parse(read('specimens/itch-io.json')));
 assert.throws(()=>alignItchSourceAudit('unlisted.md','none',stats),/Unsupported/);
 assert.throws(()=>alignItchSourceAudit('ontology/itch-io/research-synthesis-2026.md','missing anchor',stats),/exactly one/);
 assert.throws(()=>alignItchSourceAudit('ontology/itch-io/research-synthesis-2026.md','', {...stats,sourceCount:-1}),TypeError);
});
