importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBjpkljoWuhxqQReo1vzGrkJPyJOPhmby4",
    authDomain: "betser-f5b9a.firebaseapp.com",
    projectId: "betser-f5b9a",
    storageBucket: "betser-f5b9a.firebasestorage.app",
    messagingSenderId: "265691676189",
    appId: "1:265691676189:web:4d635fc7e59b7763f1d0f4",
    measurementId: "G-XY1QQD9C9N"
};


// Initialize Firebase in the Service Worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png', // Change to your icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
