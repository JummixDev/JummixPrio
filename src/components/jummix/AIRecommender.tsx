"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAIRecommendations } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Wand2, Loader2, Sparkles, ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const formSchema = z.object({
  userInterests: z.string().min(3, "Please list at least one interest."),
  socialConnections: z.string().optional(),
  pastEvents: z.string().optional(),
  location: z.string().optional(),
});

export function AIRecommender() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInterests: "live music, hiking",
      socialConnections: "Jenna Smith, Carlos Ray",
      pastEvents: "The Color Run",
      location: "San Francisco, CA",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations([]);
    
    const input = {
      userInterests: values.userInterests.split(',').map(s => s.trim()),
      socialConnections: values.socialConnections?.split(',').map(s => s.trim()).filter(s => s) || [],
      pastEvents: values.pastEvents?.split(',').map(s => s.trim()).filter(s => s) || [],
      location: values.location || undefined,
    }

    const result = await getAIRecommendations(input);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: result.error,
      });
    } else if(result.eventRecommendations) {
      setRecommendations(result.eventRecommendations);
    }
  }

  return (
    <Card>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wand2 className="text-primary" />
                        <div>
                            <CardTitle className="font-headline">AI Recommendations</CardTitle>
                            <CardDescription>Get personalized suggestions.</CardDescription>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8" asChild>
                        <Link href="/explore">
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="userInterests"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Interests (comma-separated)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. indie rock, pottery, coding" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     {recommendations.length > 0 && (
                        <div className="pt-4">
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="text-primary w-5 h-5"/>Here are your recommendations:</h3>
                            <ul className="list-disc list-inside bg-secondary p-4 rounded-md text-secondary-foreground space-y-1">
                                {recommendations.map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Wand2 className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? "Generating..." : "Get Recommendations"}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
