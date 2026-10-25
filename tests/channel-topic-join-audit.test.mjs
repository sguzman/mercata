import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditChannelTopicJoin} from '../site/channel-topic-join-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Selected creator-index categories cannot create a matched audience-per-creator ratio',async()=>{
 const [d,idx,topics,record]=await Promise.all(['ontology/youtube/channel-supply-topic-attention-2026.json','ontology/youtube/creator-index-comparison-2026.json','ontology/youtube/topic-observations.json','specimens/youtube.json'].map(load));
 const sources=new Set(record.evidence.map(x=>x.id));
 assert.deepEqual(auditChannelTopicJoin(d,idx,topics,sources),{valid:true,problems:[]});
 assert.deepEqual(d.cases.map(x=>x.indexed_channels),[322869,196340,67722]);
 assert.deepEqual(d.cases.map(x=>x.attention_unit),['video_uploads','video_views','within_fan_sample_percent']);
 assert(d.cases.every(x=>x.audience_per_creator===null&&x.estimated_creator_profit===null));
});
test('Join rejects an invented ratio, swapped topic measure, and altered vendor denominator',async()=>{
 const [d,idx,topics,record]=await Promise.all(['ontology/youtube/channel-supply-topic-attention-2026.json','ontology/youtube/creator-index-comparison-2026.json','ontology/youtube/topic-observations.json','specimens/youtube.json'].map(load));
 const source=new Set(record.evidence.map(x=>x.id)),clone=()=>structuredClone(d);
 const ratio=clone();ratio.cases[1].audience_per_creator=500000000/196340;assert(!auditChannelTopicJoin(ratio,idx,topics,source).valid);
 const unit=clone();unit.cases[0].attention_unit='video_views';assert(!auditChannelTopicJoin(unit,idx,topics,source).valid);
 const denominator=clone();denominator.cases[2].indexed_channels=100000;assert(!auditChannelTopicJoin(denominator,idx,topics,source).valid);
});
