importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyD3RMilVCUxxxGUU5EeXA-pj548vJRRRKw",
  authDomain: "urbanhoodadmin.firebaseapp.com",
  databaseURL: "https://urbanhoodadmin.firebaseio.com",
  projectId: "urbanhoodadmin",
  storageBucket: "urbanhoodadmin.appspot.com",
  messagingSenderId: "533247794475",
  appId: "1:533247794475:web:3d5be501ebb9ee34d7f96e",
  measurementId: "G-C2YVGP7Q4G"
});

const messaging = firebase.messaging();
