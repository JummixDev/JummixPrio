
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, FlipHorizontal, Upload, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { createStory } from '@/app/actions';


export default function CreateStoryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFlipped, setIsFlipped] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/');
            return;
        }

        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            setHasCameraPermission(true);

            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this app.',
            });
          }
        };

        getCameraPermission();
        
        // Cleanup function to stop the camera stream when the component unmounts
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [user, authLoading, router, toast]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');

            if (context) {
                // If the video is flipped, we need to un-flip the canvas before drawing
                if (isFlipped) {
                    context.translate(video.videoWidth, 0);
                    context.scale(-1, 1);
                }
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                // Reset transform to avoid affecting subsequent draws
                context.setTransform(1, 0, 0, 1, 0, 0);
            }
            
            const dataUrl = canvas.toDataURL('image/png');
            setCapturedImage(dataUrl);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCapturedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handlePostStory = async () => {
        if (!capturedImage || !user) return;
        setIsProcessing(true);

        const result = await createStory({
            userId: user.uid,
            imageDataUri: capturedImage,
            caption: caption,
        });

        if (result.success) {
            toast({
                title: 'Story Posted!',
                description: 'Your story has been shared with your followers.',
            });
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } else {
             toast({
                variant: 'destructive',
                title: 'Post Failed',
                description: result.errors?.join(', ') || 'Could not post your story. Please try again.',
            });
            setIsProcessing(false);
        }
    }

    if (authLoading || hasCameraPermission === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-bold font-headline text-primary">Loading Camera...</h1>
            </div>
        )
    }

  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Create a new Story</h1>
          </div>
      </header>
       <main className="flex-grow container mx-auto p-4 flex items-center justify-center pt-16">
        <Card className="w-full max-w-md">
            <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
                    {capturedImage ? (
                        <>
                            <Image src={capturedImage} alt="Captured story" layout="fill" objectFit="cover" />
                             <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full z-10" onClick={() => setCapturedImage(null)}>
                                <X />
                            </Button>
                        </>
                    ) : (
                         <>
                            <video 
                                ref={videoRef} 
                                className={cn("w-full h-full object-cover transition-transform", isFlipped && "-scale-x-100")} 
                                autoPlay 
                                muted 
                                playsInline 
                            />
                            <canvas ref={canvasRef} className="hidden" />
                             { !(hasCameraPermission) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <Alert variant="destructive" className="m-4">
                                        <AlertTitle>Camera Access Required</AlertTitle>
                                        <AlertDescription>
                                            Please allow camera access in your browser settings to create a story.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                         </>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleFileSelect}
                />
                {capturedImage ? (
                    <div className="mt-4 space-y-4">
                        <Textarea placeholder="Add a caption... (optional)" value={caption} onChange={(e) => setCaption(e.target.value)}/>
                        <Button className="w-full" onClick={handlePostStory} disabled={isProcessing}>
                             {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Post Story
                        </Button>
                    </div>
                ) : (
                    <div className="mt-4 flex justify-between items-center">
                        <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                            <Upload/>
                        </Button>
                        <Button size="icon" className="w-16 h-16 rounded-full" onClick={handleCapture} disabled={!hasCameraPermission}>
                            <Camera className="w-8 h-8"/>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setIsFlipped(prev => !prev)}><FlipHorizontal/></Button>
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
