# Next Steps & Features to Implement

This file lists the most important features that should be implemented next to transform the Jummix application from a pure frontend simulation into a fully functional, data-driven application.

---

## 🏆 All Essential Features Are Implemented! 🏆

The Jummix application is now a fully functional, data-driven application with all originally planned core features.

<details>
<summary>Show details of completed tasks</summary>

- **<del>1. Backend Data Persistence (Fully Completed)</del>**
- **<del>2. Real User Authentication & Management (Fully Completed)</del>**
- **<del>3. Event Management for Hosts (Fully Completed)</del>**
- **<del>4. Ticketing & Payment (Fully Completed)</del>**
- **<del>5. Live Chat with WebSockets (Fully Completed)</del>**
- **<del>6. Media Uploads (Images & Videos) (Fully Completed)</del>**
- **<del>7. Real Geolocation for "Nearby Events" (Fully Completed)</del>**
- **<del>8. Notification System (Fully Completed)</del>**

</details>

---

## 🚀 Future Feature Requests (New)

Here are the new requirements and ideas for the further development of Jummix.

### 1. AI-Powered Search
- **Requirement:** The global search bar should enable AI-powered search with natural language (e.g., "a relaxed jazz event on the weekend").
- **UI/UX:** The search pop-up should be enlarged and offer a larger text input area.

### 2. Event Stories (Host-exclusive & Monetization)
- **Requirement:** The story bar on the homepage should be exclusive to verified hosts.
- **Monetization:** Hosts should be able to pay to promote their events as a story. This represents a new revenue stream.

### 3. Dashboard Layout & Feed
- **Requirement:** The dashboard layout needs to be adjusted:
    - The leaderboard will be moved below the "My Badges" section.
    - The "My Activities" feed will move to the leaderboard's position (top right).
    - A new "Feed" area for other users' posts will be introduced at the old position of the activity feed.

### 4. Interactive Widgets & Animations
- **Requirement:** All main areas on the dashboard (Events, Leaderboard, etc.) should have a "Zoom In" button.
- **UI/UX:** Clicking the button should animate the widget to enlarge and take the user to the corresponding full-screen page of the feature (e.g., to the leaderboard page).

### 5. Story Functionality (Expanded)
- **Requirement:** Implementation of a comprehensive story function for hosts.
- **Features:**
    - **Camera Integration:** Direct access to the device camera to take photos for stories.
    - **Gallery Upload:** Ability to select images from the device gallery.
    - **Archiving:** Created stories should be archived and viewable again later.

### 6. Page Transitions & Explore Page
- **Requirement:** A button on the "Explore" page should lead to the "Friends" page.
- **UI/UX:** This transition should be realized with a fluid animation where the entire screen content slides to the left while the global header remains fixed.

### 7. Advanced Event Filters & Sorting
- **Requirement:** The filter and sorting options on the "Explore" page need to be expanded.
- **New Filters:** Date, Time, "Woman Only", Price, Language, Interests, Politics, Theme.
- **New Sorting Options:** Newest first, Popularity, Date (asc/desc), Best rating, Price (asc/desc), Distance.

### 8. "People Near You" & Profile Interaction
- **Requirement:** A new section "People Near You" on the homepage.
- **Interaction:** Clicking on a user should take you directly to their profile page, where you can see the person's posts, events, and past stories. From there, you should be able to add the person as a friend and start a chat.

### 9. Redesign of the "Discover Events" Page
- **Requirement:** The page should be redesigned in the style of Instagram.
- **UI/UX:**
    - A tile view with event photos in various layouts.
    - A prominent search bar at the top.
    - Clicking on an event opens a pop-up with brief information on a darkened background.
    - A "Show Details" button in the pop-up leads to the full event detail page.

### 10. Advanced Friend Filters & Sorting
- **Requirement:** The filter and sorting options on the "Friends" page need to be expanded.
- **New Filters:** Age, Gender, Language, Location, Show online only, Show verified hosts only.
- **New Sorting Options:** "Newly registered" and "Most active".

### 11. Advanced Chat Functions
- **Requirement:** The chat functionality needs to be expanded.
- **Features:**
    - **Attachments:** A button to attach content with the options: "Take Photo", "Choose from Gallery", "Share Event".
    - **Share Event:** Allows sending a saved event to a chat partner.
    - **Automatic Event Groups:** When participating in an event, the user is automatically added to a group. The host is the admin of this group. All event details (location, participants, etc.) are viewable in the group info.

### 12. Notification Center
- **Requirement:** A dedicated notification section on the homepage.
- **Contents:** Unread notifications, messages from friends, event-related news, and mentions.

### 13. Minimum Number of Participants & Event Cancellation (Host Tool)
- **Requirement:** A tool for hosts to calculate the profitability of an event.
- **Logic:**
    - Hosts enter ticket price, maximum capacity, and their expenses.
    - The system calculates the minimum number of participants for a profitable event.
    - If this number is not reached, the event is automatically canceled and all ticket buyers receive their money back.

### 14. Ticketing, QR Code Check-in & Payout
- **Requirement:** A comprehensive ticketing and check-in system.
- **Features:**
    - **My Tickets:** After purchase, each participant is assigned a ticket (with a QR code) in their account.
    - **Host Scanner:** The host can access their camera via the event page to scan the participants' QR codes.
    - **Check-in & Payout:** The scan confirms attendance and secures the payout for this ticket to the host.
    - **Payout Model:** The host receives the total amount of all scanned tickets after the event ends, minus a platform fee of approx. 20%.