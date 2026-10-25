export function assessPodcastPublicationRoute(model,routeId,input) {
 const r=model.routes.find(x=>x.id===routeId);
 if(!r)return {status:'unsupported_route',published_episode:null,creator_earnings:null};
 if(!input||typeof input!=='object'||Array.isArray(input))
  return {status:'unknown',missing:[...r.required],published_episode:null,creator_earnings:null};
 const missing=r.required.filter(k=>typeof input[k]!=='boolean');
 if(missing.length)return {status:'unknown',missing,published_episode:null,creator_earnings:null};
 const failed=r.required.filter(k=>input[k]===false);
 if(r.any_of?.length){
  if(r.any_of.every(k=>input[k]!==true)){
   if(r.any_of.some(k=>input[k]!==false))return {status:'unknown',missing:[...r.any_of],published_episode:null,creator_earnings:null};
   failed.push('no_available_verification_route');
  }
 }
 if(failed.length)return {status:'blocked_by_documented_gate',failed,published_episode:null,creator_earnings:null};
 return {status:'passes_documented_publishing_gates',published_episode:null,creator_earnings:null,actual_music_playback:null};
}
export function inferPodcastPublicationEarnings(model){return {allowed:false,reason:'no_creator_earnings_or_rights_cost_sample',net_profit:null};}
