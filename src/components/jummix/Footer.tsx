
'use client';

import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-card/80 backdrop-blur-lg border-t sticky bottom-0 z-50">
            <div className="container mx-auto py-4 px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <div className="mb-4 sm:mb-0">
                <Link href="/">
                    <h1 className="text-xl font-bold font-headline text-primary">Jummix</h1>
                </Link>
                <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Jummix Inc.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex gap-4 text-sm">
                    <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
                    <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
                    <Link href="/imprint" className="text-muted-foreground hover:text-primary transition-colors">Imprint</Link>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild><Link href="https://twitter.com" target="_blank"><Twitter className="h-4 w-4" /></Link></Button>
                    <Button variant="ghost" size="icon" asChild><Link href="https://instagram.com" target="_blank"><Instagram className="h-4 w-4" /></Link></Button>
                    <Button variant="ghost" size="icon" asChild><Link href="https://facebook.com" target="_blank"><Facebook className="h-4 w-4" /></Link></Button>
                </div>
            </div>
            </div>
        </footer>
    )
}
