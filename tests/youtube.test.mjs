import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('YouTube evidence and claim references',async()=>{
  const record=await load('specimens/youtube.json');
  const sources=new Set(record.evidence.map(x=>x.id));
  assert.equal(sources.size,record.evidence.length);
  for(const claim of record.claims)assert(claim.source_ids.length&&claim.source_ids.every(id=>sources.has(id)));
  for(const value of [...record.audience_research.populations,...record.audience_research.demographics]){
    assert(value.source_ids.length&&value.source_ids.every(id=>sources.has(id)));
  }
});
test('YouTube demographics have explicit percentage type',async()=>{
  const record=await load('specimens/youtube.json');
  for(const group of record.audience_research.demographics){
    assert(['within_group_ever_use_rate','audience_composition_share'].includes(group.measurement_kind));
    assert(group.share_percent>=0&&group.share_percent<=100);
  }
});
test('Unmeasured topics are not represented as counted audiences',async()=>{
  const taxonomy=await load('ontology/youtube/taxonomy.json');
  assert(taxonomy.topics.every(x=>x.audience_estimate===null));
});

test('YouTube economic expressions use declared symbols or earlier computed results',async()=>{
  const model=await load('ontology/youtube/economic-model.json');
  const declared=new Set(model.symbols.map(x=>x.id));
  assert.equal(declared.size,model.symbols.length);
  assert(declared.has('watch_ad_only_rpm')&&declared.has('shorts_ad_only_rpm'));
  for(const calculation of model.calculations) {
    assert(calculation.inputs.every(id=>declared.has(id)));
    const referenced=[...calculation.expression.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)].map(x=>x[0]);
    assert(referenced.every(id=>declared.has(id)),calculation.id+' references an unknown symbol');
    declared.add(calculation.id);
  }
});

test('YouTube topical observations use known topics and explicit units',async()=>{
  const [data,taxonomy]=await Promise.all([
    load('ontology/youtube/topic-observations.json'),load('ontology/youtube/taxonomy.json')
  ]);
  const topics=new Set(taxonomy.topics.map(x=>x.id));
  const observed=new Set();
  assert(data.observations.length>0);
  for(const item of data.observations) {
    assert(!observed.has(item.id));
    observed.add(item.id);
    assert(topics.has(item.topic_id),item.topic_id);
    assert(Number.isFinite(item.value)&&item.value>=0);
    assert(item.unit&&item.period&&item.geography&&item.population&&item.limitations);
    assert(item.source_url.startsWith('https://'));
  }
});

test('YouTube aggregate demographics distinguish subgroup prevalence and audience composition',async()=>{
  const record=await load('specimens/youtube.json');
  const all=record.audience_research.demographics;
  assert(all.some(x=>x.measurement_kind==='within_group_ever_use_rate'));
  assert(all.some(x=>x.measurement_kind==='audience_composition_share'));
  for(const entry of all) {
    assert(entry.source_ids.length&&entry.period&&entry.method&&entry.population&&entry.limitations);
  }
});

test('YouTube task percentage matches its original and detailed queues',async()=>{
  const [queue,plan]=await Promise.all([load('queues/youtube.json'),load('plans/youtube.json')]);
  const original=queue.queues.flatMap(x=>x.tasks);
  const count=original.length+plan.detail_tasks.length;
  assert.equal(count,399);
  assert.equal(count,plan.total_tracked_tasks);
  const total=original.reduce((n,t)=>n+t.progress,0)+plan.detail_tasks.reduce((n,t)=>n+t.percent,0);
  assert.equal(plan.progress_percent,Math.round(total/count));
  assert(original.every(t=>t.progress<100 || (t.status==='complete'&&t.evidence.length>0)));
  assert(plan.detail_tasks.every(t=>t.percent<100 || (t.status==='complete'&&t.evidence.length>0)));
});
