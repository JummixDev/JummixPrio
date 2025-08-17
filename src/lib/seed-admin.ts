
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

const seedDatabase = async () => {
  console.log('Starting database seeding...');
  const batch = db.batch();

  // --- 1. Seed Users ---
  const users = [
    { id: 'seed-user-1', name: 'Alice Admin', email: 'alice@example.com' },
    { id: 'seed-user-2', name: 'Bob Builder', email: 'bob@example.com' },
    { id: 'seed-user-3', name: 'Charlie Customer', email: 'charlie@example.com' },
  ];

  users.forEach(user => {
    const userRef = db.collection('users').doc(user.id);
    batch.set(userRef, { name: user.name, email: user.email });
    console.log(`- Prepared user: ${user.name}`);
  });

  // --- 2. Seed Events ---
  const events = [
    { title: 'Tech Conference 2024', location: 'Virtual' },
    { title: 'Community Picnic', location: 'Central Park' },
    { title: 'Rock Concert', location: 'The Grand Arena' },
  ];

  events.forEach((event, index) => {
    const eventRef = db.collection('events').doc(`seed-event-${index + 1}`);
    // Assign a random user as the host
    const randomHostId = users[Math.floor(Math.random() * users.length)].id;
    batch.set(eventRef, {
      ...event,
      hostId: randomHostId,
      date: admin.firestore.Timestamp.fromDate(new Date()),
    });
    console.log(`- Prepared event: ${event.title}`);
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
    // The process will exit automatically when the script finishes.
}).catch(error => {
    console.error('An unexpected error occurred during seeding:');
    console.error(error);
    process.exit(1);
});
