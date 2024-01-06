export default {
  port: 6001,
  appEndpoint: 'http://localhost:6001/api',
  accessTokenExpiration: 1000 * 60 * 60 * 1, // An Hour
  refreshTokenExpiration: 1000 * 60 * 60 * 24 * 7, // A Week
  clientURL: 'http://localhost:3000',
};
