/**
 * Thin API client for the EchoLens FastAPI backend.
 *
 * Every function here maps 1:1 to a backend endpoint. Components should
 * never call fetch() directly — always go through this file, so the
 * request/response shape only has to change in one place if the backend
 * contract changes.
 */

import type { Project, ProjectDocument, ArchitectResult } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers:
      options.body instanceof FormData
        ? options.headers
        : { "Content-Type": "application/json", ...options.headers },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    throw new ApiError(json?.error || `Request failed (${res.status})`, res.status);
  }

  return (json?.data ?? json) as T;
}

// ---------------- Projects ----------------

export type PaginatedProjects = {
  items: Project[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export function listProjects() {
  return request<PaginatedProjects>("/projects");
}

export function getProject(projectId: string) {
  return request<Project>(`/projects/${projectId}`);
}

export function createProject(payload: { name: string; description?: string }) {
  return request<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteProject(projectId: string) {
  return request<void>(`/projects/${projectId}`, { method: "DELETE" });
}

// ---------------- Upload ----------------
// NOTE: matches your actual backend routes under /documents, not /projects.

// Endpoint is singular ("upload-pdf"), so we send one file per request
// rather than a batch — matches FastAPI's typical `file: UploadFile` param.
export async function uploadPdfs(projectId: string, files: File[]) {
  const results: ProjectDocument[] = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    const result = await request<ProjectDocument>(`/documents/${projectId}/upload-pdf`, {
      method: "POST",
      body: formData,
    });
    results.push(result);
  }
  return results;
}

export function uploadUrl(projectId: string, url: string) {
  return request<ProjectDocument>(`/documents/${projectId}/upload-url`, {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

// ---------------- Knowledge base ----------------

export function listDocuments(projectId: string) {
  return request<unknown>(`/projects/${projectId}/documents`);
}

// NOTE: this endpoint isn't in your Swagger list yet — the delete button
// in knowledge-base/page.tsx will 404 until this route exists on the backend.
export function deleteDocument(projectId: string, documentId: string) {
  return request<void>(`/projects/${projectId}/documents/${documentId}`, {
    method: "DELETE",
  });
}

// ---------------- Chat ----------------

export type ChatSendResponse = {
  answer: string;
  sources: import("@/types").ChatSource[];
  conversation_id: string;
  user_message_id: string;
  assistant_message_id: string;
};

export function sendChatMessage(projectId: string, message: string) {
  return request<ChatSendResponse>(`/projects/${projectId}/chat`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

// NOTE: this endpoint isn't in your Swagger list yet. The chat page catches
// this failure gracefully and just starts with an empty conversation.
export function getChatHistory(projectId: string) {
  return request<import("@/types").ChatMessage[]>(`/projects/${projectId}/chat/history`);
}

// ---------------- Architect ----------------
// NOTE: matches your Swagger path /projects/{id}/architecture (not /architect).
// If your ArchitectureRequest schema needs fields (e.g. sections), pass them
// as the payload argument below once you confirm the schema.

export function generateArchitecture(projectId: string, payload: Record<string, unknown> = {}) {
  return request<ArchitectResult[]>(`/projects/${projectId}/architecture`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function generateRoadmap(projectId: string, payload: Record<string, unknown> = {}) {
  return request<ArchitectResult>(`/projects/${projectId}/roadmap`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export { ApiError };
