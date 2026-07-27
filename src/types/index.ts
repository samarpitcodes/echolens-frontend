export type Project = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  document_count?: number;
};

export type DocumentSourceType = "pdf" | "url";

export type ProjectDocument = {
  id: string;
  project_id: string;
  filename: string;
  source_type: DocumentSourceType;
  source_url?: string;
  status: string;
  created_at: string;
};

export type ChatRole = "user" | "assistant";

// Backend returns source citations as objects (e.g. { filename, chunk_index }),
// not plain strings — keep this loose and format for display where it's rendered.
export type ChatSource = string | Record<string, unknown>;

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  sources?: ChatSource[];
  created_at: string;
};

export type ArchitectSection =
  | "system_architecture"
  | "tech_stack"
  | "folder_structure"
  | "database_design"
  | "api_design"
  | "roadmap"
  | "implementation_plan";

export type ArchitectResult = {
  section: ArchitectSection;
  title: string;
  content: string;
};
