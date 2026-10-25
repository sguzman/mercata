import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditOpportunityRiskMatrix,attemptRiskWeightedRanking} from '../site/opportunity-risk-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Ten opportunity risk axes preserve registered YouTube source IDs and unknown numeric outcomes',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/opportunity-framework.json'),load('specimens/youtube.json')]);
 const rows=m.opportunity_risk_matrix.axes;
 assert.equal(rows.length,10);assert.equal(new Set(rows.map(x=>x.id)).size,10);
 assert(rows.every(x=>x.source_ids.every(id=>d.evidence.some(s=>s.id===id))));
 assert(rows.every(x=>x.probability===null&&x.expected_loss===null&&x.creator_income_impact===null&&!x.verified_for_specific_channel));
 const ok=auditOpportunityRiskMatrix(m,rows.map(x=>x.id));
 assert.equal(ok.valid,true);assert.equal(ok.risk_probability,null);
 assert.equal(ok.expected_creator_profit,null);
});
test('Invalid or synthetic weighted risk ranking cannot pass as an observed niche forecast',async()=>{
 const m=await load('ontology/youtube/opportunity-framework.json');
 assert.equal(auditOpportunityRiskMatrix(m,['made_up']).valid,false);
 assert.equal(auditOpportunityRiskMatrix(m,['ypp_eligibility','ypp_eligibility']).valid,false);
 assert.equal(attemptRiskWeightedRanking(m,[]).allowed,false);
 assert.equal(attemptRiskWeightedRanking(m,[{probability:0.1,financial_loss:400}]).allowed,false);
});
test('Public dossier groups source-linked research restrictions without invented profit',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('opportunity_risk_matrix'));
 assert(app.includes('opportunity-risk-matrix'));
 assert(app.includes('No probability of profit or financial loss was inferred'));
});
