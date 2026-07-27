"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, ArrowUpRight, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";

// Deterministic accent color per project, derived from its name — gives
// each card a little visual identity without needing user-set colors.
const ACCENTS = [
  "bg-blue-50 text-blue-600",
  "bg-teal-50 text-teal-600",
  "bg-violet-50 text-violet-600",
  "bg-amber-50 text-amber-600",
];
function accentFor(name: string) {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ACCENTS[sum % ACCENTS.length];
}

export function ProjectCard({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2, ease: "easeOut" }}>
      <Card className="group flex flex-col justify-between transition-shadow hover:shadow-lg hover:shadow-slate-200/60">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${accentFor(
                  project.name
                )}`}
              >
                {project.name.charAt(0).toUpperCase()}
              </div>
              <CardTitle>{project.name}</CardTitle>
            </div>
            <Badge variant="secondary">
              <FileText className="mr-1 h-3 w-3" />
              {project.document_count ?? 0}
            </Badge>
          </div>
          <CardDescription className="pl-12">{project.description || "No description"}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="pl-12 text-xs text-text-faint">
            Created {new Date(project.created_at).toLocaleDateString()}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Link href={`/projects/${project.id}/chat`} className="flex-1">
            <Button className="w-full">
              Open workspace
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(project.id)}
            aria-label="Delete project"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
