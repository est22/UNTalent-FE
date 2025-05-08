const { ManagementClient } = require('auth0');

const management = new ManagementClient({
  domain: 'YOUR_AUTH0_DOMAIN',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET'
});

export default management;

