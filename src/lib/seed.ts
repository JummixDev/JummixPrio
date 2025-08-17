
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp, writeBatch } from 'firebase/firestore';

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

// Helper function to get a date in the future
const futureDate = (days: number) => new Date(new Date().setDate(new Date().getDate() + days));
const pastDate = (days: number) => new Date(new Date().setDate(new Date().getDate() - days));

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
        isVerifiedHost: false,
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
        name: "Summer Music Fest",
        date: futureDate(30).toISOString().split('T')[0],
        location: "Lakeside Park",
        description: "An unforgettable weekend of live music under the stars. Featuring top indie bands, food trucks, and art installations. Don't miss the biggest music event of the summer!",
        price: 75,
        image: "https://placehold.co/600x400.png",
        hint: "concert crowd",
        hostUid: users[0].uid, // Carlos Ray
        attendeeUids: [users[1].uid, users[2].uid], // Jenna, Alex
        gallery: [
            { src: 'https://placehold.co/600x400.png', hint: 'band on stage' },
            { src: 'https://placehold.co/600x400.png', hint: 'festival lights' },
        ],
        lat: 37.7749, lon: -122.4194 // San Francisco
    },
    {
        id: "tech-innovators-summit",
        name: "Tech Innovators Summit",
        date: futureDate(45).toISOString().split('T')[0],
        location: "Convention Center",
        description: "Join the brightest minds in tech for a day of inspiring talks, hands-on workshops, and networking. Discover the future of AI, blockchain, and sustainable tech.",
        price: 0,
        image: "https://placehold.co/600x400.png",
        hint: "conference speaker",
        hostUid: users[0].uid, // Carlos Ray
        attendeeUids: [users[3].uid], // Aisha
        gallery: [],
        lat: 37.8044, lon: -122.2712 // Oakland
    },
    {
        id: "downtown-art-walk",
        name: "Downtown Art Walk",
        date: pastDate(10).toISOString().split('T')[0],
        location: "Arts District",
        description: "Explore the vibrant art scene of our city. Galleries open their doors for a night of art, music, and community. A perfect evening for art lovers.",
        price: 0,
        image: "https://placehold.co/600x400.png",
        hint: "art gallery",
        hostUid: users[2].uid, // Alex Doe
        attendeeUids: [users[1].uid, users[4].uid], // Jenna, David
        gallery: [
             { src: 'https://placehold.co/600x400.png', hint: 'abstract painting' },
             { src: 'https://placehold.co/600x400.png', hint: 'people looking at art' },
             { src: 'https://placehold.co/600x400.png', hint: 'sculpture' },
        ],
        lat: 34.0522, lon: -118.2437 // Los Angeles
    },
    {
        id: "culinary-workshop",
        name: "Culinary Workshop: Pasta Making",
        date: futureDate(7).toISOString().split('T')[0],
        location: "The Epicurean Hub",
        description: "Learn the art of fresh pasta from scratch with renowned chef Aisha Khan. This hands-on workshop will teach you everything from dough to delicious sauces.",
        price: 50,
        image: "https://placehold.co/600x400.png",
        hint: "pasta making class",
        hostUid: users[3].uid, // Aisha Khan
        attendeeUids: [users[0].uid, users[1].uid], // Carlos, Jenna
        gallery: [],
        lat: 40.7128, lon: -74.0060 // New York
    },
];

const main = async () => {
    console.log('--- Starting Database Seeding ---');
    const batch = writeBatch(db);

    // --- 1. Seed Users ---
    for (const user of users) {
        const userRef = doc(db, 'users', user.uid);
        const { uid, photoHint, ...userData } = user;
        batch.set(userRef, {
            ...userData,
            bannerURL: 'https://placehold.co/1000x300.png',
            followers: Math.floor(Math.random() * 500),
            friendsCount: Math.floor(Math.random() * 100),
            eventsCount: 0,
            createdAt: Timestamp.now(),
        });
        console.log(`- Prepared User: ${user.displayName} (${user.uid})`);
    }

    // --- 2. Seed Events ---
    for (const event of events) {
        const eventRef = doc(db, 'events', event.id);
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

    // Commit all writes to the database
    try {
        await batch.commit();
        console.log('\n--- Database Seeding Successful! ---');
        console.log('Your Firestore database now contains a rich set of sample data.');
    } catch (error) {
        console.error('--- Database Seeding Failed ---');
        console.error(error);
        process.exit(1);
    }

    // Exit the script
    process.exit(0);
};

main().catch((error) => {
  console.error('An unexpected error occurred during seeding:');
  console.error(error);
  process.exit(1);
});
