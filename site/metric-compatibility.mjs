// Structural metric-compatibility checks only. This is not statistical inference.
// A compatible result never establishes equal sampling frames or causal growth.
export const VIEW_BREAK_DATE='2026-08-24';
export const MEASUREMENT_KINDS=Object.freeze([
  {id:'public_view',label:'Public video views'},
  {id:'engaged_view',label:'Engaged views'},
  {id:'qualified_ypp_view',label:'YPP-qualified Shorts views'},
  {id:'qualified_watch_hour',label:'Qualifying public watch hours'},
  {id:'monetized_playback',label:'Monetized playbacks'},
  {id:'ad_impression',label:'Ad impressions'},
  {id:'unique_viewer',label:'Unique viewers'}
]);
const known=new Set(MEASUREMENT_KINDS.map(item=>item.id));
const validDate=value=>{
  if(typeof value!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value))return false;
  const timestamp=Date.parse(value+'T00:00:00Z');
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0,10)===value;
};
export function assessViewComparison(left,right){
  if(!left||!right||!validDate(left.date)||!validDate(right.date)||
     !known.has(left.metric)||!known.has(right.metric))
    return {status:'insufficient_metadata',reason:'Provide valid dates and recognized measurement types for both observations.',compatible:false};
  if(left.metric!==right.metric)
    return {status:'definition_conflict',reason:'The two observations use different units or metrics. Their values cannot be directly compared.',compatible:false};
  const beforeLeft=left.date<VIEW_BREAK_DATE;
  const beforeRight=right.date<VIEW_BREAK_DATE;
  if(left.metric==='public_view'&&beforeLeft!==beforeRight)
    return {status:'definition_conflict',reason:'The observations straddle August 24, 2026. Public views changed to first-frame playback starts; no universal conversion factor is known.',compatible:false};
  if(beforeLeft!==beforeRight)
    return {status:'requires_method_review',reason:'YouTube did not directly change this metric through the public view-count revision, but the metric name, policy conditions, access scope and sample method must be checked across dates.',compatible:false};
  return {status:'structurally_comparable',reason:'These dates do not cross the August 2026 definition break for this same metric. Compare geography, format, audience cohort, sampling method and reporting windows before interpreting a trend.',compatible:true};
}
