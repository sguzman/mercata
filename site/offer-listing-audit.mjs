export function auditListingSurfaces(data,sources){
 const errors=[];
 if(data?.kind!=='creator_offer_listing_and_price_control_surface_audit'||data?.surfaces?.length!==3)errors.push('Wrong offer surface count');
 const expected=['ordinary_video_presentation','channel_membership_levels','youtube_shopping_own_products'];
 for(let i=0;i<3;i++){
  const row=data?.surfaces?.[i];
  if(row?.id!==expected[i]||!row?.source_ids?.length||row.source_ids.some(s=>!sources.has(s)))errors.push('Unknown or unsourced offer');
  if([row?.transaction_count,row?.creator_net_price,row?.observed_purchase_rate].some(v=>v!==null))errors.push('Invented price or sales measurement');
 }
 const video=data?.surfaces?.[0],member=data?.surfaces?.[1],store=data?.surfaces?.[2];
 if(video?.title_max_characters!==100||video?.description_max_characters!==5000||video?.buyer_transaction_on_listing!==false||video?.price_control!=='not_applicable_to_ordinary_public_video')errors.push('Ordinary video is not a priced sale');
 if(member?.max_levels!==6||member?.max_perks_per_level!==5||member?.min_perks_per_level!==1||member?.price_owner!=='youtube_membership_pricing_schedule_creator_selects_level')errors.push('Membership benefit or regional pricing lost');
 if(store?.price_owner!=='connected_store_or_merchant'||store?.gross_unit!=='external_product_order_or_merchant_sale_not_youtube_video_view')errors.push('Merchant payment conflated with views');
 if(Object.values(data?.unmeasured||{}).some(x=>x!==null))errors.push('Invented creator profit');
 return {valid:!errors.length,errors};
}
