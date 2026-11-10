'use strict';
const { harvest_castle_token_fast, CASTLE_PK } = require('./castle_bypass');

(async () => {
  console.log('=== FAST MINT via castle_bypass.js ===');
  console.log('pk:', CASTLE_PK);

  const t0 = Date.now();
  const result = await harvest_castle_token_fast(null);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  console.log('\ntoken length:', result.token.length);
  console.log('user agent:', result.user_agent.substring(0, 60) + '...');
  console.log('time:', elapsed + 's');
  console.log('preview:', result.token.substring(0, 80) + '...');
})().catch(e => {
  console.error('[ERROR]', e.message);
  process.exit(1);
});
