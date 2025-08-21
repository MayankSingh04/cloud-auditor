import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      region: 'ap-south-1',
      userPoolId: 'ap-south-1_qneF8yoxC',
      userPoolClientId: '27pct5pg6qq2re04e7pb75cehi',
    }
  }
});