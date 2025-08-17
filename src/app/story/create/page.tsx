
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


export default function CreateStoryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

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
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/png');
            setCapturedImage(dataUrl);
        }
    };
    
    const handlePostStory = () => {
        setIsProcessing(true);
        // In a real app, you would upload `capturedImage` to storage
        // and then create a new story document in Firestore.
        toast({
            title: 'Story Posted! (Simulated)',
            description: 'Your story has been shared with your followers.',
        });
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
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
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Create a new Story</h1>
          </div>
      </header>
       <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
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
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
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

                {capturedImage ? (
                    <div className="mt-4 space-y-4">
                        <Textarea placeholder="Add a caption... (optional)" />
                        <Button className="w-full" onClick={handlePostStory} disabled={isProcessing}>
                             {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Post Story
                        </Button>
                    </div>
                ) : (
                    <div className="mt-4 flex justify-between items-center">
                        <Button variant="outline" size="icon"><Upload/></Button>
                        <Button size="icon" className="w-16 h-16 rounded-full" onClick={handleCapture} disabled={!hasCameraPermission}>
                            <Camera className="w-8 h-8"/>
                        </Button>
                        <Button variant="outline" size="icon"><FlipHorizontal/></Button>
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

