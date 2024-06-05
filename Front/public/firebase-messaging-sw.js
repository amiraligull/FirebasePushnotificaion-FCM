importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBSjUrMJ8W-puqbbxh0ugoKHqgai3UgHc0",
  authDomain: "chat-69c80.firebaseapp.com",
  databaseURL: "https://chat-69c80.firebaseio.com",
  projectId: "chat-69c80",
  storageBucket: "chat-69c80.appspot.com",
  messagingSenderId: "997862372270",
  appId: "1:997862372270:web:953319619ed19d17e70e3f",
  measurementId: "G-P4LPY0KD96"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
