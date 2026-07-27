"use client";

import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Link2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadPdfs, uploadUrl } from "@/lib/api";

type UploadStatus = { name: string; state: "pending" | "success" | "error"; message?: string };

export default function UploadPage() {
  const params = useParams<{ projectId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pdfStatuses, setPdfStatuses] = useState<UploadStatus[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [url, setUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlStatus, setUrlStatus] = useState<UploadStatus | null>(null);

  async function handlePdfUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    setPdfStatuses(fileArray.map((f) => ({ name: f.name, state: "pending" })));
    setPdfLoading(true);
    try {
      await uploadPdfs(params.projectId, fileArray);
      setPdfStatuses(fileArray.map((f) => ({ name: f.name, state: "success" })));
    } catch (err) {
      setPdfStatuses(
        fileArray.map((f) => ({
          name: f.name,
          state: "error",
          message: err instanceof Error ? err.message : "Upload failed",
        }))
      );
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleUrlSubmit() {
    let normalizedUrl = url.trim();
    if (!normalizedUrl) return;
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    setUrlLoading(true);
    setUrlStatus({ name: normalizedUrl, state: "pending" });
    try {
      await uploadUrl(params.projectId, normalizedUrl);
      setUrlStatus({ name: normalizedUrl, state: "success" });
      setUrl("");
    } catch (err) {
      setUrlStatus({
        name: normalizedUrl,
        state: "error",
        message: err instanceof Error ? err.message : "Failed to fetch URL",
      });
    } finally {
      setUrlLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* PDF upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-primary">
              <UploadCloud className="h-4 w-4" />
            </span>
            Upload PDFs
          </CardTitle>
          <CardDescription>
            Technical docs, research papers, or specs — one or many at once.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <motion.div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handlePdfUpload(e.dataTransfer.files);
            }}
            animate={{
              borderColor: isDragging ? "var(--primary)" : "var(--border)",
              backgroundColor: isDragging ? "var(--primary-light)" : "transparent",
              scale: isDragging ? 1.01 : 1,
            }}
            transition={{ duration: 0.15 }}
            className="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center text-sm text-text-muted"
          >
            {isDragging ? "Drop to upload" : "Click to select PDF files, or drag & drop"}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple
              hidden
              onChange={(e) => handlePdfUpload(e.target.files)}
            />
          </motion.div>

          {pdfLoading && (
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> Uploading & processing…
            </p>
          )}

          <ul className="flex flex-col gap-1.5">
            {pdfStatuses.map((s) => (
              <li key={s.name} className="flex items-center gap-2 text-sm">
                {s.state === "success" && <CheckCircle2 className="h-4 w-4 text-success" />}
                {s.state === "error" && <XCircle className="h-4 w-4 text-error" />}
                {s.state === "pending" && <Loader2 className="h-4 w-4 animate-spin text-text-faint" />}
                <span className="truncate">{s.name}</span>
                {s.message && <span className="text-xs text-error">— {s.message}</span>}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* URL upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-600">
              <Link2 className="h-4 w-4" />
            </span>
            Add a website URL
          </CardTitle>
          <CardDescription>
            EchoLens will extract the readable text content from the page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/docs"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            />
            <Button onClick={handleUrlSubmit} disabled={urlLoading}>
              {urlLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </div>

          {urlStatus && (
            <div className="flex items-center gap-2 text-sm">
              {urlStatus.state === "success" && <CheckCircle2 className="h-4 w-4 text-success" />}
              {urlStatus.state === "error" && <XCircle className="h-4 w-4 text-error" />}
              {urlStatus.state === "pending" && <Loader2 className="h-4 w-4 animate-spin text-text-faint" />}
              <span className="truncate">{urlStatus.name}</span>
              {urlStatus.message && <span className="text-xs text-error">— {urlStatus.message}</span>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
