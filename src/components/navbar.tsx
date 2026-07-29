"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { EchoMark } from "@/components/echo-mark";
import { useAuth } from "@/components/auth-provider";

export function Navbar() {
  const { user, signOut } = useAuth();
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <EchoMark className="h-8 w-8 rounded-[10px]" />
          <span className="font-display text-lg font-semibold tracking-tight text-text">
            EchoLens
          </span>
        </Link>
        <div className="flex items-center gap-3"><span className="text-xs font-medium text-text-faint">{user?.name ?? "Research Once. Build Smarter."}</span><button onClick={signOut} className="rounded-md p-1.5 text-text-muted hover:bg-surface-muted hover:text-text" aria-label="Sign out"><LogOut className="h-4 w-4" /></button></div>
      </div>
    </header>
  );
}
