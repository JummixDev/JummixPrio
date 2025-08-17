
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp, writeBatch } from 'firebase/firestore';

// WICHTIG: Ersetzen Sie dies durch Ihre TATSÄCHLICHE Firebase-Konfiguration aus firebase.ts
const firebaseConfig = {
    projectId: "jummix-yp2lc",
    appId: "1:323209838698:web:abd5771ad9c6b71c8eca13",
    storageBucket: "jummix-yp2lc.firebasestorage.app",
    apiKey: "AIzaSyCYGt2gIFzmHhjWLs_FdIoxcrOb9C0lk0s",
    authDomain: "jummix-yp2lc.firebaseapp.com",
    messagingSenderId: "323209838698",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const main = async () => {
    console.log('--- Starting Database Seeding ---');

    // Verwenden Sie einen WriteBatch, um alle Schreibvorgänge atomar auszuführen
    const batch = writeBatch(db);

    // --- 1. Beispiel-Benutzer (Host) ---
    // HINWEIS: Dieser Benutzer muss auch in Firebase Authentication mit derselben UID existieren!
    // Da wir die Authentifizierung nicht skripten können, müssen Sie diesen Benutzer manuell erstellen
    // oder sich mit einer E-Mail anmelden und dann die UID hier eintragen.
    // Für dieses Beispiel verwenden wir eine feste UID.
    const hostUid = 'seed-host-user-01'; 
    const hostRef = doc(db, 'users', hostUid);
    batch.set(hostRef, {
        uid: hostUid,
        email: 'host@example.com',
        username: 'jummixhost',
        displayName: 'Jummix Host',
        photoURL: 'https://placehold.co/128x128.png',
        bannerURL: 'https://placehold.co/1000x300.png',
        bio: 'I am the official host for Jummix sample events!',
        isVerifiedHost: true,
        interests: ['Tech', 'Music', 'Community'],
        followers: 100,
        friendsCount: 25,
        eventsCount: 1,
        createdAt: Timestamp.now(),
    });
    console.log(`- Prepared User: ${hostUid} (Jummix Host)`);

     // --- 2. Beispiel-Benutzer (Teilnehmer) ---
    const attendeeUid = 'seed-attendee-user-01';
    const attendeeRef = doc(db, 'users', attendeeUid);
    batch.set(attendeeRef, {
        uid: attendeeUid,
        email: 'attendee@example.com',
        username: 'jummixfan',
        displayName: 'Jummix Fan',
        photoURL: 'https://placehold.co/128x128.png',
        bannerURL: 'https://placehold.co/1000x300.png',
        bio: 'I love attending events on Jummix!',
        isVerifiedHost: false,
        interests: ['Art', 'Food', 'Festivals'],
        followers: 10,
        friendsCount: 5,
        eventsCount: 0,
        createdAt: Timestamp.now(),
    });
    console.log(`- Prepared User: ${attendeeUid} (Jummix Fan)`);


    // --- 3. Beispiel-Event ---
    const eventId = 'seed-event-01';
    const eventRef = doc(db, 'events', eventId);
    batch.set(eventRef, {
        name: 'Jummix Community Launch Party',
        date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0], // in 2 Wochen
        location: 'Jummix HQ, Digital Ocean',
        description: 'Join us to celebrate the launch of the Jummix platform! Meet the team, enjoy music, and connect with other community members. This will be an unforgettable experience for everyone involved.',
        price: 0,
        isFree: true,
        image: 'https://placehold.co/600x400.png',
        hint: 'party people celebration',
        hostUid: hostUid,
        organizer: {
            name: 'Jummix Host',
            avatar: 'https://placehold.co/40x40.png',
            hint: 'person portrait',
            username: 'jummixhost',
        },
        attendees: [
            // Normalerweise würden hier die UIDs der Teilnehmer stehen
        ],
        gallery: [],
        lat: 52.5200, // Berlin, als Beispiel
        lon: 13.4050,
    });
    console.log(`- Prepared Event: ${eventId} (Jummix Community Launch Party)`);

    // --- 4. Beispiel-Chat ---
    const chatId = 'seed-chat-01';
    const chatRef = doc(db, 'chats', chatId);
    batch.set(chatRef, {
        participantUids: [hostUid, attendeeUid],
        participants: [
            { uid: hostUid, name: 'Jummix Host', avatar: 'https://placehold.co/40x40.png', hint: 'person portrait' },
            { uid: attendeeUid, name: 'Jummix Fan', avatar: 'https://placehold.co/40x40.png', hint: 'person portrait' },
        ],
        isGroup: false,
        lastMessage: 'Hey, welcome to Jummix!',
        lastMessageTimestamp: Timestamp.now(),
    });
    console.log(`- Prepared Chat between Host and Fan`);
    
    // Erste Nachricht im Chat
    const messageRef = doc(collection(db, 'chats', chatId, 'messages'));
    batch.set(messageRef, {
        senderUid: hostUid,
        text: 'Hey, welcome to Jummix!',
        timestamp: Timestamp.now(),
    });


    // Alle Schreibvorgänge ausführen
    await batch.commit();
    console.log('\n--- Database Seeding Successful! ---');
    console.log('Your Firestore database now contains sample data.');

    // Beenden Sie das Skript, da es sonst weiterläuft
    process.exit(0);
};

main().catch((error) => {
  console.error('--- Database Seeding Failed ---');
  console.error(error);
  process.exit(1);
});
