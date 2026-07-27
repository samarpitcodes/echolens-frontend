"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { ProjectCard } from "@/components/project-card";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { listProjects, deleteProject } from "@/lib/api";
import type { Project } from "@/types";

function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="mb-4 h-3 w-2/3" />
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listProjects()
      .then((res) => setProjects(res.items))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteProject(id);
    } catch {
      // best-effort UI removal; a full implementation would re-fetch on failure
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Workspaces
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
              Your projects
            </h1>
            <p className="mt-1.5 text-sm text-text-muted">
              Each project is its own research workspace and knowledge base.
            </p>
          </div>
          <CreateProjectDialog onCreated={(p) => setProjects((prev) => [p, ...prev])} />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-error/20 bg-error-light p-4 text-sm text-error"
          >
            Couldn&apos;t reach the backend ({error}). Make sure the FastAPI
            server is running at the URL in <code className="font-mono">.env.local</code>.
          </motion.div>
        )}

        {!loading && !error && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-dashed border-border bg-surface p-14 text-center"
          >
            <p className="text-sm text-text-muted">No projects yet. Create one to get started.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)}

          <AnimatePresence>
            {!loading &&
              projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                >
                  <ProjectCard project={project} onDelete={handleDelete} />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
