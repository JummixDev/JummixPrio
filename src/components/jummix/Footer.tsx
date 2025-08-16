
'use client';

import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-card border-t">
            <div className="container mx-auto py-8 px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <div className="mb-6 sm:mb-0">
                <Link href="/">
                    <h1 className="text-xl font-bold font-headline text-primary mb-2">Jummix</h1>
                </Link>
                <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Jummix Inc. All rights reserved.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex gap-4 text-sm">
                    <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                    <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link href="/imprint" className="text-muted-foreground hover:text-primary transition-colors">Imprint</Link>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild><Link href="https://twitter.com" target="_blank"><Twitter className="h-5 w-5" /></Link></Button>
                    <Button variant="ghost" size="icon" asChild><Link href="https://instagram.com" target="_blank"><Instagram className="h-5 w-5" /></Link></Button>
                    <Button variant="ghost" size="icon" asChild><Link href="https://facebook.com" target="_blank"><Facebook className="h-5 w-5" /></Link></Button>
                </div>
            </div>
            </div>
        </footer>
    )
}
