"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Layers, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { generateArchitecture } from "@/lib/api";
import type { ArchitectResult } from "@/types";

const SECTION_LABELS: Record<string, string> = {
  system_architecture: "System Architecture",
  tech_stack: "Tech Stack Recommendation",
  folder_structure: "Folder Structure",
  database_design: "Database Design",
  api_design: "API Design",
  roadmap: "Development Roadmap",
  implementation_plan: "Implementation Plan",
};

export default function ArchitectPage() {
  const params = useParams<{ projectId: string }>();
  const [results, setResults] = useState<ArchitectResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!params.projectId) {
      setError("Choose a project before generating an architecture.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await generateArchitecture(params.projectId);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-50 text-violet-600">
              <Layers className="h-4 w-4" />
            </span>
            AI Project Architect
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-text-muted">
            Generates system architecture, tech stack, folder structure,
            database design, API design, roadmap, and implementation plan —
            grounded in everything uploaded to this project.
          </p>
          <Button onClick={handleGenerate} disabled={loading} className="w-fit">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate architecture
              </>
            )}
          </Button>
          {error && <p className="text-sm text-error">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p className="text-xs text-text-muted">
              Upload documents to this project first, then generate a plan grounded in them.
            </p>
          )}
        </CardContent>
      </Card>

      {results.map((result, i) => (
        <motion.div
          key={result.section}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08, ease: "easeOut" }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{SECTION_LABELS[result.section] ?? result.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-mono text-sm text-text-muted">
                {result.content}
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
