import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UserPostsFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Feeds</CardTitle>
        <CardDescription>See what's happening in your community.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">User posts will appear here.</p>
      </CardContent>
    </Card>
  );
}
