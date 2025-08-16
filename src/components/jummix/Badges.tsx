import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ShieldCheck, Star, Trophy, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <CardHeader>
        <CardTitle className="font-headline">My Badges</CardTitle>
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
