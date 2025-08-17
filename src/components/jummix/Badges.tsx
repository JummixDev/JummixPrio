import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ShieldCheck, Star, Trophy, Zap, ArrowUpRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import Link from "next/link";

const badges = [
  { icon: <Trophy className="w-8 h-8 text-yellow-500" />, name: "Top Contributor" },
  { icon: <Award className="w-8 h-8 text-blue-500" />, name: "First Event" },
  { icon: <Star className="w-8 h-8 text-amber-400" />, name: "Super Fan" },
  { icon: <Zap className="w-8 h-8 text-purple-500" />, name: "Power User" },
  { icon: <ShieldCheck className="w-8 h-8 text-green-500" />, name: "Verified" },
  { icon: <Star className="w-8 h-8 text-red-500" />, name: "Early Bird" },
];

export function Badges() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">My Badges</CardTitle>
         <Button variant="ghost" size="icon" className="w-8 h-8" asChild>
            <Link href="/profile/me">
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center bg-secondary p-4 rounded-lg aspect-square cursor-pointer transition-transform hover:scale-110">
                    {badge.icon}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badge.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
