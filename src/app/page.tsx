"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Box,
  BrainCircuit,
  ChevronDown,
  CircleHelp,
  FileText,
  FolderKanban,
  Globe2,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  MoreVertical,
  Search,
  Settings,
  Sparkles,
  Sun,
  Upload,
  X,
} from "lucide-react";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { EchoMark } from "@/components/echo-mark";
import { listProjects } from "@/lib/api";
import type { Project } from "@/types";

const fallbackProjects: Project[] = [
  { id: "ai-research", name: "AI Research Assistant", description: "Research papers and notes about LLMs and RAG", created_at: "2026-07-24", document_count: 18 },
  { id: "medical-kb", name: "Medical Knowledge Base", description: "Healthcare documents and medical research", created_at: "2026-07-22", document_count: 52 },
  { id: "startup-ideas", name: "Startup Idea Validator", description: "Market research and competitor analysis", created_at: "2026-07-19", document_count: 31 },
];

const accents = ["violet", "teal", "amber", "blue"];

function MetricCard({ icon: Icon, label, value, change, tone }: { icon: typeof FileText; label: string; value: string; change: string; tone: string }) {
  return <article className="metric-card">
    <div className={`metric-icon ${tone}`}><Icon size={20} /></div>
    <div><p>{label}</p><strong>{value}</strong></div>
    <span className="metric-change">↗ {change} from last week</span>
    <svg className={`sparkline ${tone}`} viewBox="0 0 90 34" aria-hidden="true"><path d="M1 27 C11 17, 16 28, 26 17 S39 26, 49 13 S62 18, 71 8 S80 13, 89 3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
  </article>;
}

function Chart() {
  return <div className="chart-wrap">
    <div className="chart-scale"><span>200</span><span>150</span><span>100</span><span>50</span><span>0</span></div>
    <svg className="activity-chart" viewBox="0 0 500 230" preserveAspectRatio="none" aria-label="Weekly activity chart">
      <g className="chart-grid"><line x1="0" y1="18" x2="500" y2="18"/><line x1="0" y1="67" x2="500" y2="67"/><line x1="0" y1="116" x2="500" y2="116"/><line x1="0" y1="165" x2="500" y2="165"/><line x1="0" y1="214" x2="500" y2="214"/></g>
      <path d="M2 132 C35 105 45 107 72 86 S115 38 144 51 S180 93 214 55 S245 34 282 95 S320 125 355 128 S390 155 426 169 S463 188 498 196" className="chart-line blue"/>
      <path d="M2 174 C31 138 42 151 72 135 S108 116 144 121 S178 154 214 132 S250 112 282 147 S319 160 355 158 S392 173 426 185 S463 201 498 209" className="chart-line teal"/>
      <path d="M2 207 C27 181 45 190 72 185 S107 169 144 180 S178 190 214 160 S251 139 282 187 S319 186 355 190 S391 196 426 202 S464 207 498 214" className="chart-line purple"/>
    </svg>
    <div className="chart-days">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day}>{day}</span>)}</div>
    <div className="chart-legend"><span className="blue-dot">Documents</span><span className="teal-dot">Chats</span><span className="purple-dot">Sources</span></div>
  </div>;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    listProjects().then((result) => setProjects(result.items)).catch(() => setProjects(fallbackProjects)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);

  const visibleProjects = useMemo(() => projects.filter((project) => `${project.name} ${project.description ?? ""}`.toLowerCase().includes(query.toLowerCase())), [projects, query]);
  const primaryProject = projects[0];
  const navItems = [[LayoutDashboard, "Dashboard"], [FolderKanban, "Projects"], [MessageSquareText, "AI Chat"], [Box, "Knowledge Base"], [BrainCircuit, "AI Architect"], [Settings, "Settings"]] as const;

  return <div className="app-shell">
    <aside className={`sidebar ${navOpen ? "open" : ""}`}>
      <div className="brand"><EchoMark className="brand-mark" /><span>EchoLens</span><button className="sidebar-close" onClick={() => setNavOpen(false)} aria-label="Close menu"><X size={18}/></button></div>
      <nav>{navItems.map(([Icon, label], index) => <button key={label} className={`nav-item ${index === 0 ? "active" : ""}`} onClick={() => { if (label === "Projects") document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}><Icon size={18}/><span>{label}</span></button>)}</nav>
      <div className="upgrade-card"><Sparkles size={18}/><strong>Upgrade to Pro</strong><p>Unlock unlimited projects, larger uploads, and advanced AI models.</p><button>Upgrade now <ArrowRight size={14}/></button></div>
      <div className="account"><div className="avatar">GS</div><div><strong>Gurnoor Singh</strong><small>gurnoor@example.com</small></div><ChevronDown size={16}/></div>
    </aside>

    {navOpen && <button className="nav-backdrop" aria-label="Close navigation" onClick={() => setNavOpen(false)} />}
    <main className="dashboard-main">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setNavOpen(true)} aria-label="Open menu"><Menu size={21}/></button>
        <label className="search-box"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, documents, chats..."/><kbd>⌘ K</kbd></label>
        <div className="top-actions"><button className="icon-button notification" onClick={() => setNotice(!notice)} aria-label="Notifications"><Bell size={19}/><i/></button><button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle color theme"><Sun size={19}/></button><div className="top-avatar">GS</div></div>
        {notice && <div className="notifications"><strong>You&apos;re all caught up</strong><span>No new workspace activity.</span></div>}
      </header>

      <section className="page-intro"><div><h1>Good afternoon, Gurnoor <span>👋</span></h1><p>Here&apos;s what&apos;s happening with your projects today.</p></div><CreateProjectDialog onCreated={(project) => setProjects((current) => [project, ...current])} /></section>

      <section className="metrics"><MetricCard icon={FolderKanban} label="Total Projects" value={String(Math.max(projects.length, 12))} change="2" tone="violet"/><MetricCard icon={FileText} label="Documents" value="213" change="18" tone="blue"/><MetricCard icon={MessageSquareText} label="AI Chats" value="1,450" change="27" tone="teal"/><MetricCard icon={Globe2} label="Sources Used" value="3,928" change="42" tone="purple"/></section>

      <section className="dashboard-grid">
        <article className="panel projects-panel" id="projects"><div className="panel-heading"><h2>Recent Projects</h2><Link href="#projects">View all</Link></div><div className="project-list">
          {loading ? <p className="empty-text">Loading your projects…</p> : visibleProjects.length ? visibleProjects.slice(0, 4).map((project, index) => <Link href={`/projects/${project.id}`} key={project.id} className="project-row"><div className={`project-icon ${accents[index % accents.length]}`}>{index === 0 ? <BrainCircuit size={19}/> : index === 1 ? <CircleHelp size={19}/> : <Sparkles size={19}/>}</div><div className="project-copy"><strong>{project.name}</strong><span>{project.description || "Your private research workspace"}</span><small>{project.document_count ?? 0} Documents <b>•</b> Active recently</small></div><MoreVertical size={18}/></Link>) : <p className="empty-text">No projects match your search.</p>}
        </div></article>
        <article className="panel activity-panel"><div className="panel-heading"><h2>Activity Overview</h2><button className="period-button">This Week <ChevronDown size={14}/></button></div><Chart /></article>
        <aside className="right-column"><article className="panel assistant-panel"><div className="assistant-title"><Sparkles size={20}/><h2>AI Assistant</h2></div><p>How can I help you today?</p>{["Summarize my recent documents", "Find insights about RAG", "Generate project architecture"].map((text) => <Link key={text} href={primaryProject ? `/projects/${primaryProject.id}/${text.includes("architecture") ? "architect" : "chat"}` : "#"}>{text}<ArrowRight size={15}/></Link>)}</article><article className="panel activity-feed"><div className="panel-heading"><h2>Recent Activity</h2><button>View all</button></div>{[[FileText,"Research.pdf uploaded","2h ago","red"],[MessageSquareText,"Chat with AI","3h ago","violet"],[Globe2,"arxiv.org imported","5h ago","teal"],[Box,"System architecture generated","1d ago","blue"]].map(([Icon, text, when, tone]) => { const FeedIcon = Icon as typeof FileText; return <div className="feed-item" key={String(text)}><span className={`feed-icon ${tone}`}><FeedIcon size={15}/></span><div><strong>{String(text)}</strong><small>AI Research Assistant</small></div><time>{String(when)}</time></div>; })}</article><article className="panel storage"><div><span>Storage Used</span><small>45.2 GB / 100 GB</small></div><div className="storage-track"><i/></div><p>45% used</p></article></aside>
      </section>
      <section className="panel quick-actions"><h2>Quick Actions</h2><div>{[[Upload,"Upload PDF","Add documents"],[Globe2,"Add Website","Crawl & import"],[MessageSquareText,"Start AI Chat","Ask anything"],[Box,"AI Architect","Generate plan"]].map(([Icon, title, description]) => { const ActionIcon = Icon as typeof Upload; const href = primaryProject ? `/projects/${primaryProject.id}/${title === "AI Architect" ? "architect" : title === "Start AI Chat" ? "chat" : "upload"}` : "#"; return <Link href={href} key={String(title)}><span><ActionIcon size={19}/></span><div><strong>{String(title)}</strong><small>{String(description)}</small></div><ArrowRight size={16}/></Link>; })}</div></section>
    </main>
  </div>;
}
