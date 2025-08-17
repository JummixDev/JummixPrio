
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CalendarCheck, Share2, UserPlus } from "lucide-react";
import Link from "next/link";

const activities = [
  {
    user: "Jenna Smith",
    avatar: "https://placehold.co/40x40.png",
    hint: "woman portrait",
    action: "RSVP'd to",
    target: "Summer Music Fest",
    time: "2m ago",
    icon: <CalendarCheck className="w-4 h-4 text-accent" />,
  },
  {
    user: "Carlos Ray",
    avatar: "https://placehold.co/40x40.png",
    hint: "man portrait",
    action: "is now connected with",
    target: "Maria Garcia",
    time: "10m ago",
    icon: <UserPlus className="w-4 h-4 text-primary" />,
  },
  {
    user: "Aisha Khan",
    avatar: "https://placehold.co/40x40.png",
    hint: "woman face",
    action: "shared a memory from",
    target: "The Color Run",
    time: "30m ago",
    icon: <Share2 className="w-4 h-4 text-purple-500" />,
  },
  {
    user: "Alex Doe",
    avatar: "https://placehold.co/40x40.png",
    hint: "person portrait",
    action: "RSVP'd to",
    target: "Tech Innovators Summit",
    time: "1h ago",
    icon: <CalendarCheck className="w-4 h-4 text-accent" />,
  },
];

export function LiveActivityFeed() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">My Activities</CardTitle>
        <Button variant="ghost" size="icon" className="w-8 h-8 group" asChild>
            <Link href="/profile/me">
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:scale-110"/>
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-6">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start space-x-4">
              <Avatar className="w-10 h-10 border-2 border-secondary flex-shrink-0">
                <AvatarImage src={activity.avatar} alt={activity.user} data-ai-hint={activity.hint} />
                <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="text-sm">
                  <span className="font-bold text-foreground">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-semibold text-primary">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  {activity.icon}
                  {activity.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
