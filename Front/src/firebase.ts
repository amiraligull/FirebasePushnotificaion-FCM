// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyBSjUrMJ8W-puqbbxh0ugoKHqgai3UgHc0",
    authDomain: "chat-69c80.firebaseapp.com",
    databaseURL: "https://chat-69c80.firebaseio.com",
    projectId: "chat-69c80",
    storageBucket: "chat-69c80.appspot.com",
    messagingSenderId: "997862372270",
    appId: "1:997862372270:web:953319619ed19d17e70e3f",
    measurementId: "G-P4LPY0KD96"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
