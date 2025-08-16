import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Button } from "../ui/button";

export function UserProfileCard() {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center text-center pb-4">
        <Avatar className="w-24 h-24 mb-4 border-4 border-background ring-2 ring-primary">
          <AvatarImage src="https://placehold.co/100x100.png" alt="User Name" data-ai-hint="person portrait" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline">Alex Doe</CardTitle>
        <p className="text-muted-foreground">@alex_doe</p>
      </CardHeader>
      <CardContent className="text-center">
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
            <span className="font-bold text-lg text-foreground">28</span>
            <span>Events</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
            <span className="font-bold text-lg text-foreground">152</span>
            <span>Friends</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground px-2 mb-6">
          Lover of live music, outdoor adventures, and spontaneous weekend trips.
        </p>
        <Button variant="outline" className="w-full">
          <Settings className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
}
