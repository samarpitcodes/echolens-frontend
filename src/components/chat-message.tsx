"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { EchoMark } from "@/components/echo-mark";
import type { ChatMessage, ChatSource } from "@/types";

// The backend returns each source as a metadata object (e.g.
// { filename, chunk_index, source_type }), not a plain string — this pulls
// out a human-readable label instead of rendering "[object Object]".
function formatSource(source: ChatSource): string {
  if (typeof source === "string") return source;
  const filename = source.filename ?? source.source_url ?? source.document_id;
  const chunk = source.chunk_index;
  if (typeof filename === "string") {
    return typeof chunk === "number" ? `${filename} (chunk ${chunk})` : filename;
  }
  return "source";
}

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      {isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-muted">
          <User className="h-4 w-4" />
        </div>
      ) : (
        <EchoMark className="h-8 w-8 shrink-0 rounded-full" />
      )}
      <div
        className={cn(
          "max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm",
          isUser ? "bg-primary text-white" : "border border-border bg-surface text-text"
        )}
      >
        {message.content}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-border pt-2">
            {message.sources.map((s, i) => (
              <span
                key={i}
                className="rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[10px] text-text-muted"
              >
                {formatSource(s)}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
