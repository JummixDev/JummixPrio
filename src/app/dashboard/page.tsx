

import { UserProfileCard } from "@/components/jummix/UserProfileCard";
import { Badges } from "@/components/jummix/Badges";
import { EventReels } from "@/components/jummix/EventReels";
import { LiveActivityFeed } from "@/components/jummix/LiveActivityFeed";
import { EventCard } from "@/components/jummix/EventCard";
import { Leaderboard } from "@/components/jummix/Leaderboard";
import { AIRecommender } from "@/components/jummix/AIRecommender";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Menu, MessageSquare, User, Settings, LayoutDashboard, Shield, HelpCircle, Info, Mail, LogOut, Loader2, Heart, Bookmark, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GlobalSearch } from "@/components/jummix/GlobalSearch";
import { UserPostsFeed } from "@/components/jummix/UserPostsFeed";
import { PeopleNearby } from "@/components/jummix/PeopleNearby";
import { NotificationCenter } from "@/components/jummix/NotificationCenter";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardClient } from "./client";

type Event = {
  id: string;
  [key: string]: any;
};

// Fetch initial events on the server
async function getUpcomingEvents() {
  try {
    const q = query(collection(db, "events"), limit(4));
    const querySnapshot = await getDocs(q);
    const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
    return fetchedEvents;
  } catch (error) {
    console.error("Error fetching events on server:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const upcomingEvents = await getUpcomingEvents();

  return (
    <DashboardClient initialUpcomingEvents={upcomingEvents} />
  );
}

