import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app'; // Import Firebase App from compat namespace
import 'firebase/compat/firestore'; // Import Firestore from compat namespace
import { messaging, onMessage } from '../firebase';

// Firebase configuration
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

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Firestore instance
const db = firebase.firestore();

const NotificationComponent: React.FC = () => {
    const [notifications, setNotifications] = useState<{ id: string, message: string, read: boolean }[]>([]);

    useEffect(() => {
        // Function to handle incoming notifications
        const handleNotification = (payload: any) => {
            console.log('Message received. ', payload);
        };

        // Subscribe to Firestore changes
        const unsubscribe = db.collection('notifications').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            const fetchedNotifications: { id: string, message: string, read: boolean }[] = [];
            snapshot.forEach(doc => {
                fetchedNotifications.push({ id: doc.id, message: doc.data().message, read: doc.data().read });
            });
            console.log('Fetched notifications:', fetchedNotifications);
            setNotifications(fetchedNotifications);
        });

        // Subscribe to incoming messages (notifications)
        const unsubscribeMessaging = onMessage(messaging, handleNotification);

        // Cleanup function
        return () => {
            // Unsubscribe from Firestore and messaging listeners when component unmounts
            unsubscribe();
            unsubscribeMessaging();
        };
    }, []);

    // Function to send a notification
    const sendNotification = async (message: string) => {
        try {
            // Fetch the FCM token from local storage
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('FCM token not found in local storage.');
                return;
            }

            // Send the FCM token and message to the backend
            const response = await fetch('http://localhost:3000/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, message }),
            });
            if (!response.ok) {
                throw new Error('Failed to send notification');
            }
            console.log(`Notification "${message}" sent successfully.`);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    // Function to mark a notification as read
    const markAsRead = async (id: string) => {
        try {
            // Update the notification in Firestore to mark it as read
            await db.collection('notifications').doc(id).update({
                read: true
            });

            // Update the state to reflect the change
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === id ? { ...notification, read: true } : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h3>Send Notifications:</h3>
            <div className="btn-group" role="group" aria-label="Send Notifications">
                <button type="button" className="btn btn-primary" onClick={() => sendNotification('Notification 1')}>Send Notification 1</button>
                <button type="button" className="btn btn-primary" onClick={() => sendNotification('Notification 2')}>Send Notification 2</button>
                <button type="button" className="btn btn-primary" onClick={() => sendNotification('Notification 3')}>Send Notification 3</button>
            </div>

            <h3 className="mt-5">Received Notifications:</h3>
            <ul className="list-group mt-3">
                {notifications.map(notification => (
                    <li key={notification.id} className={`list-group-item d-flex justify-content-between align-items-center ${notification.read ? 'bg-light' : ''}`}>
                        <span>{notification.message}</span>
                        {!notification.read && (
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => markAsRead(notification.id)}>Mark as Read</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationComponent;
