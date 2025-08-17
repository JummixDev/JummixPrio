
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {getMessaging} from "firebase-admin/messaging";

// Initialize Firebase Admin SDK
try {
  admin.initializeApp();
  console.log("Firebase Admin SDK initialized successfully.");
} catch (error: any) {
  if (error.code === "app/duplicate-app") {
    console.log("Firebase Admin SDK already initialized.");
  } else {
    console.error("Error initializing Firebase Admin SDK:", error);
  }
}

const db = admin.firestore();

// Set global options for functions
functions.setGlobalOptions({maxInstances: 10});

/**
 * Cloud Function to send a notification when a new message is created in a chat.
 */
export const sendChatNotification = onDocumentCreated("chats/{chatId}/messages/{messageId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }
  const message = snapshot.data();
  const chatId = event.params.chatId;
  const senderUid = message.senderUid;

  // 1. Get chat participants
  const chatRef = db.collection("chats").doc(chatId);
  const chatDoc = await chatRef.get();
  if (!chatDoc.exists) {
    console.log(`Chat document ${chatId} not found.`);
    return;
  }
  const chatData = chatDoc.data();
  const participantUids = chatData?.participantUids || [];

  // 2. Determine recipients (everyone except the sender)
  const recipients = participantUids.filter((uid: string) => uid !== senderUid);
  if (recipients.length === 0) {
    console.log("No recipients to notify.");
    return;
  }

  // 3. Get sender's profile to display their name
  const senderProfile = await db.collection("users").doc(senderUid).get();
  const senderName = senderProfile.data()?.displayName || "Someone";

  // 4. For each recipient, get their FCM tokens and send a notification
  for (const recipientUid of recipients) {
    const recipientProfile = await db.collection("users").doc(recipientUid).get();
    const recipientData = recipientProfile.data();
    const fcmTokens = recipientData?.fcmTokens || []; // Assume fcmTokens is an array

    if (fcmTokens.length > 0) {
      const payload: admin.messaging.MessagingPayload = {
        notification: {
          title: `New message from ${senderName}`,
          body: message.text,
          clickAction: `/chats`, // Direct user to the chats page on click
        },
      };

      try {
        console.log(`Sending notification to ${recipientUid} with tokens:`, fcmTokens);
        await getMessaging().sendToDevice(fcmTokens, payload);
        console.log(`Successfully sent message to ${recipientUid}`);
      } catch (error) {
        console.error(`Error sending message to ${recipientUid}:`, error);
        // Here you could add logic to clean up invalid tokens
      }
    } else {
      console.log(`No FCM tokens found for recipient ${recipientUid}.`);
    }
  }
});
