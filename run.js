const { create_account } = require('./castle_bypass');

(async () => {
  const email = process.argv[2] || `user${Date.now()}@example.com`;
  const password = process.argv[3] || 'Passw0rd!123';
  const proxy = process.argv[4] || null; // 'host:port', opcional

  console.log(`criando conta: ${email}`);
  const result = await create_account(email, password, proxy);

  console.log('uid:', result.uid);
  console.log('idToken:', result.idToken.slice(0, 50) + '...');
  console.log('refreshToken:', result.refreshToken);
  console.log('castle status:', result.castle_status);
  console.log('castle body:', result.castle_body);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
