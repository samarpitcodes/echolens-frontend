"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Upload, Database, MessageSquare, Layers } from "lucide-react";

const TABS = [
  { href: "upload", label: "Upload", icon: Upload },
  { href: "knowledge-base", label: "Knowledge Base", icon: Database },
  { href: "chat", label: "Chat", icon: MessageSquare },
  { href: "architect", label: "Architect", icon: Layers },
];

export function WorkspaceNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 rounded-lg border border-border bg-surface p-1 w-fit">
      {TABS.map(({ href, label, icon: Icon }) => {
        const fullHref = `/projects/${projectId}/${href}`;
        const active = pathname.startsWith(fullHref);
        return (
          <Link
            key={href}
            href={fullHref}
            className={cn(
              "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active ? "text-primary" : "text-text-muted hover:text-text"
            )}
          >
            {active && (
              <motion.span
                layoutId="workspace-nav-pill"
                className="absolute inset-0 rounded-md bg-primary-light"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <Icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
