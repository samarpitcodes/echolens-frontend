"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Globe, Trash2, Database, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listDocuments, deleteDocument } from "@/lib/api";
import type { ProjectDocument } from "@/types";

const STATUS_VARIANT: Record<string, "secondary" | "success" | "failed"> = {
  processing: "secondary",
  pending: "secondary",
  completed: "success",
  failed: "failed",
};

// Backend list endpoints have been inconsistent about returning a bare array
// vs. a paginated { items: [...] } wrapper. This normalizes either shape so
// the page doesn't break if that changes again.
function normalizeDocuments(response: unknown): ProjectDocument[] {
  if (Array.isArray(response)) return response;
  if (
    response &&
    typeof response === "object" &&
    "items" in response &&
    Array.isArray((response as { items: unknown }).items)
  ) {
    return (response as { items: ProjectDocument[] }).items;
  }
  return [];
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  tone: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs font-medium text-text-muted">{label}</p>
          <p className="font-display text-2xl font-semibold text-text">{value}</p>
        </div>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-4 w-4" />
        </span>
      </CardContent>
    </Card>
  );
}

export default function KnowledgeBasePage() {
  const params = useParams<{ projectId: string }>();
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listDocuments(params.projectId)
      .then((res) => setDocuments(normalizeDocuments(res)))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [params.projectId]);

  async function handleDelete(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    try {
      await deleteDocument(params.projectId, id);
    } catch {
      // best effort
    }
  }

  const stats = useMemo(
    () => ({
      total: documents.length,
      completed: documents.filter((d) => d.status === "completed").length,
      processing: documents.filter((d) => d.status === "processing" || d.status === "pending").length,
      failed: documents.filter((d) => d.status === "failed").length,
    }),
    [documents]
  );

  if (loading)
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4">
              <Skeleton className="mb-2 h-3 w-20" />
              <Skeleton className="h-6 w-10" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <div className="rounded-lg border border-error/20 bg-error-light p-4 text-sm text-error">
        {error}
      </div>
    );
  if (documents.length === 0)
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-14 text-center text-sm text-text-muted">
        No documents yet. Go to the Upload tab to add research.
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total documents" value={stats.total} icon={Database} tone="bg-blue-50 text-primary" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="bg-success-light text-success" />
        <StatCard label="Processing" value={stats.processing} icon={Loader2} tone="bg-surface-muted text-text-muted" />
        <StatCard label="Failed" value={stats.failed} icon={XCircle} tone="bg-error-light text-error" />
      </div>

      <div className="flex flex-col gap-3">
        {documents.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04, ease: "easeOut" }}
          >
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted">
                    {doc.source_type === "pdf" ? (
                      <FileText className="h-4 w-4 text-primary" />
                    ) : (
                      <Globe className="h-4 w-4 text-teal-600" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text">{doc.filename}</p>
                    {doc.source_url && (
                      <p className="text-xs text-text-faint">{doc.source_url}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANT[doc.status] ?? "secondary"}>{doc.status}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
