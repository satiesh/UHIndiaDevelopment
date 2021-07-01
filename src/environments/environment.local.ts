// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  storeDevToolsEnabled: true,
  baseUrl: null, // Change this to the address of your backend API if different from frontend address
  tokenUrl: null, // For IdentityServer/Authorization Server API. You can set to null if same as baseUrl
  loginUrl: '/login',
  apiUrl:'https://api.stripe.com',
  //backendApiUrl: 'https://us-central1-urbanhoodadmin.cloudfunctions.net/webApi/api/v1/',
  backendApiUrl: 'https://us-central1-urbanhoodadminalpha.cloudfunctions.net/webApi/api/v1/',
  stripeApi: 'pk_test_51HN7MiHZ4XNG0JRpoaJt2gVdwVPJWU8fQCMT5x4m42lmkYMgorTcyj2GsNagc5YmLxaBOwGUO0frLQ8k9EyziMvp008UGBFFei',
  stripeSecretApi:'sk_test_51HN7MiHZ4XNG0JRpnv9s4WBRWz5EblyHAQbjANtTHhoLt8hdqtDvsDb9yq6F91lE8Cpi6Os0C4coAUL8hdsGFa4Q00fCUIx62k',
  sendinBlueApi: 'https://api.sendinblue.com/v3/',
  azureApi: 'https://uhazurerestapi.azurewebsites.net/',
  //sendinBlueKey: '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',
  sendinBlueKey: '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',
  publicKey: "BLh_Ik3u9URcTFvrc4UfvKW_HlmvkiTc-sePL6fndmmm6RlMRwO5huOlaeTpuAjOuLKqCqL-osplAvedFObVB-Y",
  privateKey: "XCOjbcke82BMtYi9hJ9ZmhGtRALcmFSPqzYUj013YhA",
  welcometemplateId: 14,
  sendinBlueListId: 13,
  staticsiteurl: 'https://www.urbanhood.org/',
  twillio:{
      accountSid :'AC5a77bd74cd6cd1215ea783ced6a8b97f',
      authToken :'34ee149eba7208d0964f844c3461ea04'
  },
  //firebase: {
  //  apiKey: "AIzaSyB1Ewm6VTwkBxclvPe157_FOqGkLHWSijo",
  //  authDomain: "urbanhood-learning.firebaseapp.com",
  //  databaseURL: "https://urbanhood-learning.firebaseio.com",
  //  projectId: "urbanhood-learning",
  //  storageBucket: "urbanhood-learning.appspot.com",
  //  messagingSenderId: "698200216255",
  //  appId: "1:698200216255:web:3b455cc8bab8ed049b2c0a",
  //  measurementId: "G-V2Q3PE1KJY"
  //},
  firebase: {
    apiKey: "AIzaSyDLlzeQXgn7Ru91_qUZKs-2lLqTVJYR3XY",
    authDomain: "urbanhoodadminalpha.firebaseapp.com",
    databaseURL: "https://urbanhoodadminalpha.firebaseio.com",
    projectId: "urbanhoodadminalpha",
    storageBucket: "urbanhoodadminalpha.appspot.com",
    messagingSenderId: "586785043760",
    appId: "1:586785043760:web:a920fbbc5d2034fdaa44f5",
    measurementId: "G-4YYLMPKKX3"

  },
  //firebase:{
  //  apiKey: "AIzaSyD3RMilVCUxxxGUU5EeXA-pj548vJRRRKw",
  //  authDomain: "urbanhoodadmin.firebaseapp.com",
  //  databaseURL: "https://urbanhoodadmin.firebaseio.com",
  //  projectId: "urbanhoodadmin",
  //  storageBucket: "urbanhoodadmin.appspot.com",
  //  messagingSenderId: "533247794475",
  //  appId: "1:533247794475:web:3d5be501ebb9ee34d7f96e",
  //  measurementId: "G-C2YVGP7Q4G"
  //},
  powerBI: {
    reportBaseURL: 'https://app.powerbi.com/reportEmbed',
    qnaBaseURL: 'https://app.powerbi.com/qnaEmbed',
    tileBaseURL: 'https://app.powerbi.com/embed',
    groupID: '<group-id>',
    reportID: '6466dec9-4589-4d5c-9288-8bc954fa46db'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
