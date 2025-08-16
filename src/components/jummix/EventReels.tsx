import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const reels = [
  { src: "https://placehold.co/600x400.png", hint: "music festival", name: "Synthwave Sunset" },
  { src: "https://placehold.co/600x400.png", hint: "art gallery", name: "Modern Art Expo" },
  { src: "https://placehold.co/600x400.png", hint: "food truck", name: "Street Food Fair" },
  { src: "https://placehold.co/600x400.png", hint: "marathon running", name: "City Marathon" },
  { src: "https://placehold.co/600x400.png", hint: "tech conference", name: "InnovateTech 2024" },
  { src: "https://placehold.co/600x400.png", hint: "outdoor concert", name: "Park Acoustics" },
];

export function EventReels() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {reels.map((reel, index) => (
          <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="overflow-hidden rounded-xl">
                <CardContent className="relative flex aspect-[3/4] items-end justify-start p-0">
                  <Image
                    src={reel.src}
                    alt={reel.name}
                    width={600}
                    height={800}
                    data-ai-hint={reel.hint}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="relative p-4 text-lg font-bold text-white font-headline">
                    {reel.name}
                  </span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
