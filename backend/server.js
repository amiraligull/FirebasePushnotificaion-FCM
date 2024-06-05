// server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./chat-69c80-firebase-adminsdk-jh3bk-5fbe1b11bb.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-69c80.firebaseio.com"
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Store FCM token associated with user
app.post('/store-token', (req, res) => {
  const { userId, token } = req.body;
  // Store the token in your database associated with the user
  console.log(`FCM token "${token}" stored for user "${userId}"`);
  res.status(200).send('Token stored successfully.');
});

// Handle sending notification
app.post('/send-notification', async (req, res) => {
  const { token, message } = req.body;
  try {
    // Send the notification using the provided token
    const response = await admin.messaging().send({
      token,
      notification: {
        title: 'New Message',
        body: message
      }
    });
    console.log('Notification sent successfully:', response);
    res.status(200).send('Notification sent successfully.');

    // Store the notification in Firestore after sending it
    await admin.firestore().collection('notifications').add({
      message,
      read: false,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Notification stored in Firestore successfully.');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Error sending notification.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
