import type { Node, Edge } from "@xyflow/react";

export type CanvasLevel = "workspace" | "project" | "component";

export type NodeType =
  // Level 1: Workspace
  | "project"
  // Level 2: Project components
  | "document"
  | "task"
  | "team"
  | "goal"
  | "timeline"
  | "deadline"
  | "risk"
  | "meeting"
  | "resource"
  | "custom-component"
  // Level 3: Component details
  | "srs"
  | "marketing"
  | "meeting-log"
  | "tech-spec"
  | "person"
  | "note"
  | "file-item"
  | "custom-item";

export type RelationshipType =
  | "contains"
  | "has"
  | "assigned-to"
  | "depends-on"
  | "blocks"
  | "belongs-to"
  | "related-to";

export type Priority = "low" | "medium" | "high" | "critical";

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  addedAt: string;
}

export interface NodeData extends Record<string, unknown> {
  nodeType: NodeType;
  canvasId: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  priority: Priority;
  notes: string;
  attachments: Attachment[];
  owner: string;
}

export type CanvasNode = Node<NodeData>;

export interface EdgeData extends Record<string, unknown> {
  relationship: RelationshipType;
  canvasId: string;
}

export type CanvasEdge = Edge<EdgeData>;

export interface Canvas {
  id: string;
  level: CanvasLevel;
  title: string;
  parentCanvasId: string | null;
  parentNodeId: string | null;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  canvases: Canvas[];
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  activeCanvasId: string;
}

// Which node types can be created at each level
export const LEVEL_NODE_TYPES: Record<CanvasLevel, NodeType[]> = {
  workspace: ["project"],
  project: [
    "document",
    "task",
    "team",
    "goal",
    "timeline",
    "deadline",
    "risk",
    "meeting",
    "resource",
    "custom-component",
  ],
  component: [
    "srs",
    "marketing",
    "meeting-log",
    "tech-spec",
    "person",
    "note",
    "file-item",
    "custom-item",
  ],
};

// Which node types can be drilled into (opened to reveal a child canvas)
export const DRILLABLE_TYPES: NodeType[] = [
  "project",
  "document",
  "task",
  "team",
  "goal",
  "timeline",
  "deadline",
  "risk",
  "meeting",
  "resource",
  "custom-component",
];

export const STATUS_OPTIONS: Record<NodeType, string[]> = {
  project: ["Planning", "Active", "On Hold", "Completed", "Archived"],
  task: ["To Do", "In Progress", "In Review", "Done", "Blocked"],
  document: ["Draft", "In Review", "Approved", "Published", "Outdated"],
  team: ["Active", "On Leave", "Disbanded", "Forming"],
  goal: ["Defined", "In Progress", "Achieved", "Missed", "Deferred"],
  timeline: ["Draft", "Active", "Completed", "Delayed"],
  deadline: ["Upcoming", "At Risk", "Met", "Missed", "Extended"],
  risk: ["Identified", "Assessing", "Mitigating", "Resolved", "Accepted"],
  meeting: ["Scheduled", "In Progress", "Completed", "Cancelled"],
  resource: ["Available", "Allocated", "Exhausted", "Pending"],
  "custom-component": ["Active", "Inactive", "Pending", "Done"],
  srs: ["Draft", "In Review", "Approved", "Outdated"],
  marketing: ["Ideation", "In Progress", "Published", "Archived"],
  "meeting-log": ["Draft", "Finalized", "Action Items Pending"],
  "tech-spec": ["Draft", "In Review", "Approved", "Implemented"],
  person: ["Available", "Busy", "On Leave", "Unavailable"],
  note: ["Active", "Archived"],
  "file-item": ["Current", "Outdated", "Archived"],
  "custom-item": ["Active", "Inactive", "Done"],
};

export const NODE_COLORS: Record<NodeType, { bg: string; border: string; text: string }> = {
  project: { bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" },
  task: { bg: "#1a3d2e", border: "#22c55e", text: "#86efac" },
  document: { bg: "#3d1f56", border: "#a855f7", text: "#d8b4fe" },
  team: { bg: "#4a2c17", border: "#f97316", text: "#fdba74" },
  goal: { bg: "#2d4a1a", border: "#84cc16", text: "#bef264" },
  timeline: { bg: "#1a3d4a", border: "#06b6d4", text: "#67e8f9" },
  deadline: { bg: "#4a3f14", border: "#eab308", text: "#fde047" },
  risk: { bg: "#4a1c1c", border: "#ef4444", text: "#fca5a5" },
  meeting: { bg: "#2e1a4a", border: "#8b5cf6", text: "#c4b5fd" },
  resource: { bg: "#1a4a3d", border: "#14b8a6", text: "#5eead4" },
  "custom-component": { bg: "#3d3d1f", border: "#a3a3a3", text: "#d4d4d4" },
  srs: { bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" },
  marketing: { bg: "#4a1c3d", border: "#ec4899", text: "#f9a8d4" },
  "meeting-log": { bg: "#2e1a4a", border: "#8b5cf6", text: "#c4b5fd" },
  "tech-spec": { bg: "#1a3d4a", border: "#06b6d4", text: "#67e8f9" },
  person: { bg: "#4a2c17", border: "#f97316", text: "#fdba74" },
  note: { bg: "#4a3f14", border: "#eab308", text: "#fde047" },
  "file-item": { bg: "#3d1f56", border: "#a855f7", text: "#d8b4fe" },
  "custom-item": { bg: "#3d3d1f", border: "#a3a3a3", text: "#d4d4d4" },
};

export const NODE_LABELS: Record<NodeType, string> = {
  project: "Project",
  task: "Task",
  document: "Document",
  team: "Team",
  goal: "Goal",
  timeline: "Timeline",
  deadline: "Deadline",
  risk: "Risk",
  meeting: "Meeting",
  resource: "Resource",
  "custom-component": "Custom",
  srs: "SRS",
  marketing: "Marketing",
  "meeting-log": "Meeting Log",
  "tech-spec": "Tech Spec",
  person: "Person",
  note: "Note",
  "file-item": "File",
  "custom-item": "Custom",
};

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  contains: "Contains",
  has: "Has",
  "assigned-to": "Assigned To",
  "depends-on": "Depends On",
  blocks: "Blocks",
  "belongs-to": "Belongs To",
  "related-to": "Related To",
};

// Legacy type for migration
export interface LegacyWorkspace {
  id: string;
  name: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  createdAt: string;
  updatedAt: string;
}
