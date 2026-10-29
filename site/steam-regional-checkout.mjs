// Synthetic-only, fixed purchaser cohort. USD cents supplied explicitly;
// never auto-convert local prices or infer real Steam regional FX/revenue.
const moneyKeys=['gross_sales_usd_cents','returns_usd_cents','net_tax_usd_cents'];
const countKeys=['gross_paid_units','returned_paid_units'];
export function summarizeSyntheticRegionalCheckouts(rows){
 if(!Array.isArray(rows))throw new TypeError('Expected synthetic market rows');
 const seen=new Set();
 const totals={gross_paid_units:0,returned_paid_units:0,gross_sales_usd_cents:0,returns_usd_cents:0,net_tax_usd_cents:0};
 for(const row of rows){
  if(!row||typeof row!=='object')throw new TypeError('Expected checkout row object');
  if(row.sale_channel!=='Steam_store_checkout'||row.product_scope!=='single_base_game_package')throw new TypeError('Only single-base-game Steam paid checkout rows permitted; keys, free licenses and cross-app bundles excluded');
  if(typeof row.market!=='string'||!/^([A-Z]{3}|USD_(CIS|LATAM|MENA|SASIA))$/.test(row.market)||typeof row.period!=='string'||!/^hypothetical_[a-z0-9_]+$/.test(row.period))throw new TypeError('Market and hypothetical period are required');
  const key=row.market+'|'+row.period;
  if(seen.has(key))throw new RangeError('Duplicate market-period cohort row');
  seen.add(key);
  for(const k of [...moneyKeys,...countKeys]){
   if(!Number.isSafeInteger(row[k])||row[k]<0)throw new TypeError('Nonnegative safe integer required for '+k);
   const n=totals[k]+row[k];if(!Number.isSafeInteger(n))throw new RangeError('Unsafe total for '+k);totals[k]=n;
  }
  if(row.returned_paid_units>row.gross_paid_units)throw new RangeError('Fixed-cohort returned units exceed paid units');
  if(row.returns_usd_cents>row.gross_sales_usd_cents)throw new RangeError('Fixed-cohort returns exceed gross USD cents');
  if(row.net_tax_usd_cents>row.gross_sales_usd_cents-row.returns_usd_cents)throw new RangeError('Taxes exceed post-return subtotal');
  if(row.gross_paid_units===0&&(row.gross_sales_usd_cents!==0||row.returned_paid_units!==0||row.returns_usd_cents!==0))throw new RangeError('Positive checkout amounts without paid units');
  if(row.gross_paid_units>0&&row.gross_sales_usd_cents===0)throw new RangeError('A paid checkout cohort cannot have zero gross');
 }
 const netUnits=totals.gross_paid_units-totals.returned_paid_units;
 const netCents=totals.gross_sales_usd_cents-totals.returns_usd_cents-totals.net_tax_usd_cents;
 return {...totals,net_paid_units:netUnits,
   synthetic_net_sales_after_returns_and_taxes_usd_cents:netCents,
   gross_usd_per_paid_unit:totals.gross_paid_units?totals.gross_sales_usd_cents/100/totals.gross_paid_units:null,
   post_return_tax_usd_per_remaining_unit:netUnits?netCents/100/netUnits:null,
   observed_all_market_sales:null,unique_paid_buyers:null,partner_bank_payout:null,developer_profit:null,causal_local_price_elasticity:null,
   complete_market_coverage:false,actual_currency_conversion_performed:false,source:'synthetic_input_only'
 };
}
