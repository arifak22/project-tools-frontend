// Firebase Cloud Messaging Configuration File. 
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

var firebaseConfig = {
  apiKey           : process.env.REACT_APP_FIREBASE_KEY,
  authDomain       : process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL      : process.env.REACT_APP_FIREBASE_URL,
  projectId        : process.env.REACT_APP_FIREBASE_ID,
  storageBucket    : process.env.REACT_APP_FIREBASE_STORAGE,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId            : process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId    : process.env.REACT_APP_FIREBASE_MES_ID,
};

initializeApp(firebaseConfig);

const messaging = getMessaging();


export const getTokenFromRequest = async () =>{
  let result = await getToken(messaging, { vapidKey: `BPlgOE-dzNOLPVx6BMUIJc6SxPHBj8wvzhAxhYHwd28onRXv0MEkgPL9jCEVB5z7vEJDqiBLdMg5i8mLPb_8Dxk` })
    .then((currentToken) => {
       return currentToken;
    })
    return result;
}

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});
