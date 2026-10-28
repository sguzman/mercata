// Research-only synthetic aggregates. No account identifiers or network access.
export function summarizeSharedCopyFixture(x) {
 if (!x || typeof x !== 'object') throw new TypeError('Expected aggregate');
 for(const k of ['owned_copies','distinct_players','concurrent_players','fixture_checkout_orders'])
   if(!Number.isSafeInteger(x[k])||x[k]<0)throw new TypeError('Invalid '+k);
 if(x.concurrent_players>x.distinct_players)throw new RangeError('Concurrent count exceeds player count');
 if(x.concurrent_players>x.owned_copies)throw new RangeError('Cannot share one owned copy concurrently');
 return {owned_copies:x.owned_copies,distinct_players:x.distinct_players,
  observed_simultaneous_players_in_fixture:x.concurrent_players,
  fixture_checkout_orders:x.fixture_checkout_orders,
  players_per_owned_copy_in_fixture:x.owned_copies?x.distinct_players/x.owned_copies:null,
  unique_real_payers:null,refund_adjusted_orders:null,actual_publisher_income:null,
  warning:'Synthetic fixture only. Borrowing, ownership, players and paid orders have different denominators.'};
}
