// Counts PUBLIC VIDEO METADATA classifications, never global viewer language distributions.
const bcp47=/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
export function summarizeVideoLanguageMetadata(records){
 if(!Array.isArray(records))throw Error('Explicit video metadata sample required');
 const ids=new Set(),audio={},metadata={};let unknownAudio=0,unknownMetadata=0;
 const checkedTag=(tag,name)=>{
  if(tag===null)return null;
  if(typeof tag!=='string'||!bcp47.test(tag))throw Error('Malformed '+name);
  return tag.toLowerCase();
 };
 for(const v of records){
  if(typeof v?.video_id!=='string'||!v.video_id.trim()||ids.has(v.video_id))throw Error('Duplicate or missing video ID');
  ids.add(v.video_id);
  const spoken=checkedTag(v.default_audio_language,'default audio language');
  const text=checkedTag(v.default_metadata_language,'default metadata language');
  if(spoken===null)unknownAudio++;else audio[spoken]=(audio[spoken]||0)+1;
  if(text===null)unknownMetadata++;else metadata[text]=(metadata[text]||0)+1;
 }
 const sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
 if(sum(audio)+unknownAudio!==records.length||sum(metadata)+unknownMetadata!==records.length)throw Error('Video partition failed');
 return {unit:'selected_video_metadata_records',video_count:records.length,
   audio_language_counts:audio,metadata_language_counts:metadata,unknown_audio_count:unknownAudio,
   unknown_metadata_count:unknownMetadata,global_unique_viewers:null,actual_language_speakers:null,
   representative_youtube_language_market:null};
}
export function assessLanguageInference(sourceMetric,requested){
 const allow={
  default_audio_language:'selected_video_default_audio_tag_count',
  default_metadata_language:'selected_video_default_metadata_tag_count',
  caption_track_language:'authorized_caption_track_metadata',
  analytics_country:'owner_authorized_view_activity_country'
 };
 if(allow[sourceMetric]!==requested)return {allowed:false,reason:'different_population_or_unsupported_language_inference'};
 return {allowed:true,unit:requested,unique_speakers:null,viewer_native_language:null};
}
