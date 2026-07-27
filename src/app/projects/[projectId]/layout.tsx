"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { WorkspaceNav } from "@/components/workspace-nav";
import { PageTransition } from "@/components/page-transition";
import { getProject } from "@/lib/api";
import type { Project } from "@/types";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    getProject(params.projectId).then(setProject).catch(() => setProject(null));
  }, [params.projectId]);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight text-text">
              {project?.name ?? "Loading project…"}
            </h1>
            <p className="text-sm text-text-muted">
              {project?.description || "Project workspace"}
            </p>
          </div>
          <WorkspaceNav projectId={params.projectId} />
        </div>
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
