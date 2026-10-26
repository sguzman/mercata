import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditGenreProfitComparison} from '../site/itch-genre-profit-audit.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('All genre claims are linked to recorded public developer sources',()=>{
 const study=load('ontology/itch-io/genre-profit-commensurability-2026.json');
 const dossier=load('specimens/itch-io.json');
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(study.rows.length,12);
 for(const row of study.rows)assert(row.source_ids.every(id=>ids.has(id)));
 assert.equal(study.study.genre_ranking,null);
 assert.equal(study.study.population_weighted_genre_mean_net_profit,null);
});
test('Unequal price, period, receipt and labor basis cannot produce seller genre profit',()=>{
 const data=load('ontology/itch-io/genre-profit-commensurability-2026.json');
 const res=auditGenreProfitComparison(data);
 assert.equal(res.valid,true);
 assert.equal(res.rows,12);
 assert.equal(res.complete_matching_profit_rows,0);
 assert.equal(res.representative_population_frame,false);
 assert.equal(res.genre_profit_comparison_supported,false);
 assert.equal(res.genre_mean_net_profit,null);
});
test('Reject duplicate games and invented monetary outcomes',()=>{
 const data=load('ontology/itch-io/genre-profit-commensurability-2026.json');
 assert.equal(auditGenreProfitComparison({...data,rows:[data.rows[0],data.rows[0]]}).valid,false);
 assert.equal(auditGenreProfitComparison({...data,rows:[{...data.rows[0],developer_final_profit:'imaginary'}]}).valid,false);
});
