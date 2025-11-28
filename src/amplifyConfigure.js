import { Amplify } from 'aws-amplify';

const currentOrigin = window.location.origin + '/';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ['email', 'openid', 'phone'],
          redirectSignIn: [currentOrigin],
          redirectSignOut: [currentOrigin],
          responseType: 'code'
        }
      }
    }
  }
});
