import configuration from './configuration';

const config = configuration();

export default {
  identifier: 'sample-integration-app',
  name: 'Sample app',
  logo: '/assets/logo.png',
  baseUrl: config.baseUrl,
  authentication: {
    type: 'authorization_code',
    clientId: config.crowdinClientId,
  },
  events: {
    installed: '/installed',
    uninstall: '/uninstall',
  },
  scopes: ['project'],
  modules: {
    integrations: [
      {
        key: 'sample-integration',
        name: 'Sample Integration',
        description: 'Some description',
        logo: '/assets/logo.png',
        url: '/',
      },
    ],
  },
};
