export const environment = {
  production: true,
  storeDevToolsEnabled: true,
  baseUrl: null, // Change this to the address of your backend API if different from frontend address
  tokenUrl: null, // For IdentityServer/Authorization Server API. You can set to null if same as baseUrl
  loginUrl: '/login',
  apiUrl: 'https://api.stripe.com',
  backendApiUrl: 'https://us-central1-urbanhood-learning.cloudfunctions.net/webApi/api/v1/',
  stripeApi: 'pk_live_QBZ0JtLN6FNfScJmVizQZBO2',
  stripeSecretApi: 'sk_live_XwaNG3FvrXkikkkq2GxAGcYh',
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
  firebase: {
    apiKey: "AIzaSyB1Ewm6VTwkBxclvPe157_FOqGkLHWSijo",
    authDomain: "urbanhood-learning.firebaseapp.com",
    databaseURL: "https://urbanhood-learning.firebaseio.com",
    projectId: "urbanhood-learning",
    storageBucket: "urbanhood-learning.appspot.com",
    messagingSenderId: "698200216255",
    appId: "1:698200216255:web:3b455cc8bab8ed049b2c0a",
    measurementId: "G-V2Q3PE1KJY"
  }
};
