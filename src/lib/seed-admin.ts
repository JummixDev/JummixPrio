
import * as admin from 'firebase-admin';

// This script assumes you have the GOOGLE_APPLICATION_CREDENTIALS environment variable set.
// If you're running this in a Google Cloud environment (like Cloud Shell or a VM), this is often handled for you.
// Otherwise, download your service account key JSON file from Firebase Console and set the path:
// export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"

try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'jummix-yp2lc', // Replace with your actual project ID if needed
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    console.log('Firebase Admin SDK already initialized.');
  } else {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

// Helper function to get a date in the future
const futureDate = (days: number, time: string) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date;
};
const pastDate = (days: number, time: string) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date;
};

const users = [
    { 
        uid: 'user-carlos-ray-01', 
        email: 'carlos@example.com', 
        username: 'carlosray', 
        displayName: 'Carlos Ray', 
        photoURL: 'https://placehold.co/128x128.png', 
        photoHint: 'man portrait',
        isVerifiedHost: true,
        bio: 'Tech enthusiast & event organizer. Bringing the best tech meetups to the city.',
        interests: ['Tech', 'Innovation', 'Startups'],
    },
    { 
        uid: 'user-jenna-smith-02', 
        email: 'jenna@example.com', 
        username: 'jennasmith', 
        displayName: 'Jenna Smith', 
        photoURL: 'https://placehold.co/128x128.png', 
        photoHint: 'woman portrait',
        isVerifiedHost: false,
        bio: 'Lover of live music, outdoor adventures, and spontaneous weekend trips.',
        interests: ['Music', 'Hiking', 'Travel'],
    },
    { 
        uid: 'user-alex-doe-03', 
        email: 'alex@example.com', 
        username: 'alexdoe', 
        displayName: 'Alex Doe', 
        photoURL: 'https://placehold.co/128x128.png', 
        photoHint: 'person portrait',
        isVerifiedHost: true,
        bio: 'Art student and gallery explorer. Always looking for the next inspiration.',
        interests: ['Art', 'Design', 'Photography'],
    },
    { 
        uid: 'user-aisha-khan-04', 
        email: 'aisha@example.com', 
        username: 'aishakhan', 
        displayName: 'Aisha Khan', 
        photoURL: 'https://placehold.co/128x128.png', 
        photoHint: 'woman face',
        isVerifiedHost: true,
        bio: 'Food blogger and culinary event host. Join my workshops to taste the world!',
        interests: ['Food', 'Cooking', 'Workshops'],
    },
    { 
        uid: 'user-david-lee-05', 
        email: 'david@example.com', 
        username: 'davidlee', 
        displayName: 'David Lee', 
        photoURL: 'https://placehold.co/128x128.png', 
        photoHint: 'man face',
        isVerifiedHost: false,
        bio: 'Sports fanatic. Catch me at the next game or running a marathon.',
        interests: ['Sports', 'Fitness', 'Marathon'],
    },
    { 
        uid: 'user-admin-06', 
        email: 'service@jummix.com', 
        username: 'jummixadmin', 
        displayName: 'Jummix Admin', 
        photoURL: 'https://placehold.co/128x128.png',
        photoHint: 'company logo',
        isVerifiedHost: true, // Admins are also hosts
        bio: 'Official account for Jummix platform administration and events.',
        interests: ['Community', 'Platform', 'Events'],
    },
];

const events = [
    {
        id: "summer-music-fest",
        name: "Summer Music Fest 2024",
        date: futureDate(30, '18:00').toISOString().split('T')[0],
        location: "Golden Gate Park, San Francisco, CA",
        description: "An unforgettable weekend of live music under the stars, kicking off at 6:00 PM. Featuring top indie bands like 'The Wandering Echoes', a variety of gourmet food trucks, and mesmerizing art installations. Your perfect summer escape!",
        price: 75.00,
        image: "https://placehold.co/600x400.png",
        hint: "concert crowd",
        hostUid: users[0].uid, // Carlos Ray
        attendeeUids: [users[1].uid, users[2].uid, users[4].uid], // Jenna, Alex, David
        gallery: [
            { src: 'https://placehold.co/600x400.png', hint: 'band on stage' },
            { src: 'https://placehold.co/600x400.png', hint: 'festival lights' },
        ],
        lat: 37.7694, lon: -122.4862
    },
    {
        id: "tech-innovators-summit",
        name: "Tech Innovators Summit",
        date: futureDate(45, '09:00').toISOString().split('T')[0],
        location: "Moscone Center, San Francisco, CA",
        description: "Join the brightest minds in tech for a full day of inspiring talks, starting at 9:00 AM. Keynotes from industry leaders on AI, blockchain, and sustainable tech. Includes hands-on workshops and extensive networking opportunities.",
        price: 0,
        image: "https://placehold.co/600x400.png",
        hint: "conference speaker",
        hostUid: users[0].uid, // Carlos Ray
        attendeeUids: [users[3].uid], // Aisha
        gallery: [],
        lat: 37.7841, lon: -122.4012
    },
    {
        id: "downtown-art-walk",
        name: "Downtown Art Walk",
        date: pastDate(10, '19:00').toISOString().split('T')[0],
        location: "The Mission District, San Francisco, CA",
        description: "Explore the vibrant art scene of the city. Starting at 7:00 PM, local galleries open their doors for a special night of exhibitions, live music, and community engagement. A perfect evening for art lovers and creators.",
        price: 15.00,
        image: "https://placehold.co/600x400.png",
        hint: "art gallery",
        hostUid: users[2].uid, // Alex Doe
        attendeeUids: [users[1].uid, users[4].uid], // Jenna, David
        gallery: [
             { src: 'https://placehold.co/600x400.png', hint: 'abstract painting' },
             { src: 'https://placehold.co/600x400.png', hint: 'people looking at art' },
             { src: 'https://placehold.co/600x400.png', hint: 'sculpture' },
        ],
        lat: 37.7599, lon: -122.4148
    },
    {
        id: "culinary-workshop",
        name: "Culinary Workshop: Pasta Making",
        date: futureDate(7, '17:30').toISOString().split('T')[0],
        location: "1 Ferry Building, San Francisco, CA",
        description: "Learn the art of fresh pasta from scratch with renowned chef Aisha Khan. This intimate, hands-on workshop starts at 5:30 PM and will teach you everything from making the perfect dough to crafting delicious, classic Italian sauces.",
        price: 50.00,
        image: "https://placehold.co/600x400.png",
        hint: "pasta making class",
        hostUid: users[3].uid, // Aisha Khan
        attendeeUids: [users[0].uid, users[1].uid, users[2].uid], // Carlos, Jenna, Alex
        gallery: [],
        lat: 37.7955, lon: -122.3937
    },
];

const seedDatabase = async () => {
  console.log('--- Starting Database Seeding ---');
  const batch = db.batch();

  // --- 1. Seed Users ---
  for (const user of users) {
    const userRef = db.collection('users').doc(user.uid);
    const { uid, photoHint, ...userData } = user;
    batch.set(userRef, {
      ...userData,
      bannerURL: 'https://placehold.co/1000x300.png',
      followers: Math.floor(Math.random() * 500),
      friendsCount: Math.floor(Math.random() * 100),
      eventsCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`- Prepared User: ${user.displayName} (${user.uid})`);
  }

  // --- 2. Seed Events ---
  for (const event of events) {
    const eventRef = db.collection('events').doc(event.id);
    const { id, attendeeUids, ...eventData } = event;

    // Get host details
    const host = users.find(u => u.uid === event.hostUid);
    if (!host) continue;

    // Get attendee details
    const attendees = users
      .filter(u => attendeeUids.includes(u.uid))
      .map(u => ({
        name: u.displayName,
        avatar: u.photoURL,
        hint: u.photoHint,
        username: u.username,
      }));

    batch.set(eventRef, {
      ...eventData,
      isFree: eventData.price === 0,
      organizer: {
        name: host.displayName,
        avatar: host.photoURL,
        hint: host.photoHint,
        username: host.username,
      },
      attendees: attendees,
    });
    console.log(`- Prepared Event: ${event.name} (${event.id})`);
  }

  // --- 3. Seed Chats ---
    const chatRef = db.collection('chats').doc('chat-carlos-jenna-01');
    batch.set(chatRef, {
        participantUids: ['user-carlos-ray-01', 'user-jenna-smith-02'],
        participants: [
            { uid: 'user-carlos-ray-01', name: 'Carlos Ray', avatar: 'https://placehold.co/128x128.png', hint: 'man portrait' },
            { uid: 'user-jenna-smith-02', name: 'Jenna Smith', avatar: 'https://placehold.co/128x128.png', hint: 'woman portrait' }
        ],
        lastMessage: 'Hey, are you going to the Summer Fest?',
        lastMessageTimestamp: admin.firestore.Timestamp.fromDate(new Date()),
        isGroup: false,
    });
    console.log('- Prepared Chat between Carlos and Jenna');

    const msg1Ref = chatRef.collection('messages').doc();
    batch.set(msg1Ref, {
        senderUid: 'user-carlos-ray-01',
        text: 'Hey, are you going to the Summer Fest?',
        timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 5)), // 5 minutes ago
    });

    const msg2Ref = chatRef.collection('messages').doc();
    batch.set(msg2Ref, {
        senderUid: 'user-jenna-smith-02',
        text: 'Yeah, I just got my ticket! So excited. You?',
        timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 2)), // 2 minutes ago
    });


  // --- Commit the batch ---
  try {
    await batch.commit();
    console.log('\n✅ Seeding finished!');
  } catch (error) {
    console.error('Error committing batch:', error);
    process.exit(1);
  }
};

seedDatabase().then(() => {
    process.exit(0);
}).catch(error => {
    console.error('An unexpected error occurred during seeding:');
    console.error(error);
    process.exit(1);
});
