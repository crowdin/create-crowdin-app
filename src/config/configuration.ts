export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  baseUrl: process.env.BASE_URL,
  crowdinClientId: process.env.CROWDIN_CLIENT_ID,
  crowdinClientSecret: process.env.CROWDIN_CLIENT_SECRET,
  cryptoSecret: process.env.CRYPTO_SECRET || 'test_secret',
});
