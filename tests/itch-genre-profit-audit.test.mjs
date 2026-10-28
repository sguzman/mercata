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

test('Two observed games tagged with one genre cannot pass as a comparison of genres',()=>{
 const base=load('ontology/itch-io/genre-profit-commensurability-2026.json');
 const row=(id,genre)=>({...base.rows[0],id,genre_tags:genre,observation_window:'90_days',
  proceeds_basis:'itch_final_profit_after_cash_cost_and_labor',
  currency:'USD',developer_final_profit:120,developer_labor_hours:16,source_ids:['mixolumia-postmortem']});
 const study=(rows)=>({...base,rows,study:{...base.study,developers_independent_verified_across_all_rows:true,cases_selected_from_public_disclosure:false}});
 const same=auditGenreProfitComparison(study([row('one',['puzzle']),row('two',['puzzle'])]));
 assert.equal(same.valid,true);
 assert.equal(same.complete_matching_profit_rows,2);
 assert.equal(same.qualifying_genre_pairs,0);
 assert.equal(same.genre_profit_comparison_supported,false);
 const duplicatedTags=auditGenreProfitComparison(study([row('one',['puzzle','arcade']),row('two',['puzzle','arcade'])]));
 assert.equal(duplicatedTags.qualifying_genre_pairs,0);
 assert.equal(duplicatedTags.genre_profit_comparison_supported,false);
 const eligible=auditGenreProfitComparison(study([
  row('one',['puzzle']),row('two',['puzzle']),row('three',['arcade']),row('four',['arcade'])
 ]));
 assert.equal(eligible.qualifying_genre_pairs,1);
 assert.equal(eligible.genre_profit_comparison_supported,true);
 assert.equal(eligible.genre_mean_net_profit,null,'Eligibility is not computed empirical mean');
 const onlyOnePerGenre=auditGenreProfitComparison(study([row('one',['puzzle']),row('two',['arcade'])]));
 assert.equal(onlyOnePerGenre.qualifying_genre_pairs,0);
 assert.equal(onlyOnePerGenre.genre_profit_comparison_supported,false);
});
test('Malformed or repeated genre labels and source IDs cannot support genre comparison',()=>{
 const base=load('ontology/itch-io/genre-profit-commensurability-2026.json');
 for(const tags of [['arcade','arcade'],[' '],[23],[],['puzzle','  arcade'],null]){
  const r=auditGenreProfitComparison({...base,rows:[{...base.rows[0],genre_tags:tags}]});
  assert.equal(r.valid,false,JSON.stringify(tags));
 }
 const r=auditGenreProfitComparison({...base,rows:[{...base.rows[0],source_ids:['  ']}]});
 assert.equal(r.valid,false);
});
