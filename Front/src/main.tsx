// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App';
import './index.css';
import { messaging, getToken } from './firebase';

// Replace with your actual Public VAPID Key from the Firebase Console
const vapidKey = 'BJHSc9toRseIMsEqrXo0xuP80xsG2oywll5JofEPOYUT258ArUvUaA_KitHzqn1ZNsTWLZInbmfbEze98-1QdWI';

getToken(messaging, { vapidKey }).then((currentToken) => {
  if (currentToken) {
    localStorage.setItem('token', currentToken);
    console.log('FCM token:', currentToken);
  } else {
    console.log('No registration token available. Request permission to generate one.');
  }
}).catch((err) => {
  console.error('An error occurred while retrieving token. ', err);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch((err) => {
      console.error('Service worker registration failed, error:', err);
    });
}
