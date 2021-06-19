export const environment = {
  production: true,
  storeDevToolsEnabled: true,
  baseUrl: null, // Change this to the address of your backend API if different from frontend address
  tokenUrl: null, // For IdentityServer/Authorization Server API. You can set to null if same as baseUrl
  loginUrl: '/login',
  apiUrl: 'https://api.stripe.com',
  backendApiUrl: 'https://us-central1-urbanhoodadminalpha.cloudfunctions.net/webApi/api/v1/',
  stripeApi: 'pk_test_51HN7MiHZ4XNG0JRpoaJt2gVdwVPJWU8fQCMT5x4m42lmkYMgorTcyj2GsNagc5YmLxaBOwGUO0frLQ8k9EyziMvp008UGBFFei',
  stripeSecretApi: 'sk_test_51HN7MiHZ4XNG0JRpnv9s4WBRWz5EblyHAQbjANtTHhoLt8hdqtDvsDb9yq6F91lE8Cpi6Os0C4coAUL8hdsGFa4Q00fCUIx62k',
  sendinBlueApi: 'https://api.sendinblue.com/v3/',
  azureApi: 'https://uhazurerestapi.azurewebsites.net/',
  //sendinBlueKey: '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',
  sendinBlueKey: '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',
  welcometemplateId: 14,
  sendinBlueListId: 13,
  encryptionKey: '123456$#@$^@1ERF',
  twillio: {
    accountSid: 'AC5a77bd74cd6cd1215ea783ced6a8b97f',
    authToken: '34ee149eba7208d0964f844c3461ea04'
  },
  firebase:{
    apiKey: "AIzaSyDLlzeQXgn7Ru91_qUZKs-2lLqTVJYR3XY",
    authDomain: "urbanhoodadminalpha.firebaseapp.com",
    databaseURL: "https://urbanhoodadminalpha.firebaseio.com",
    projectId: "urbanhoodadminalpha",
    storageBucket: "urbanhoodadminalpha.appspot.com",
    messagingSenderId: "586785043760",
    appId: "1:586785043760:web:a920fbbc5d2034fdaa44f5",
    measurementId: "G-4YYLMPKKX3"

  }
};
