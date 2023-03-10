// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging-compat.js');
// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey           : process.env.REACT_APP_FIREBASE_KEY,
  authDomain       : process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL      : process.env.REACT_APP_FIREBASE_URL,
  projectId        : process.env.REACT_APP_FIREBASE_ID,
  storageBucket    : process.env.REACT_APP_FIREBASE_STORAGE,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId            : process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId    : process.env.REACT_APP_FIREBASE_MES_ID,
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});