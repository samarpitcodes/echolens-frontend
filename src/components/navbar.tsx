import Link from "next/link";
import { EchoMark } from "@/components/echo-mark";

export function Navbar() {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <EchoMark className="h-8 w-8 rounded-[10px]" />
          <span className="font-display text-lg font-semibold tracking-tight text-text">
            EchoLens
          </span>
        </Link>
        <span className="text-xs font-medium text-text-faint">
          Research Once. Build Smarter.
        </span>
      </div>
    </header>
  );
}
