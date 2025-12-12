import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: 'dev-pool-eu-central.auth.eu-central-1.amazoncognito.com',
          scopes: ['openid'],
          redirectSignIn: ['http://localhost:5173/', 'https://d370pydepcvfkd.cloudfront.net'],
          redirectSignOut: ['http://localhost:5173/', 'https://d370pydepcvfkd.cloudfront.net'],
          responseType: 'code',
          providers: ['Google']
        }
      }
    }
  }
});
