import type { Node, Edge } from "@xyflow/react";

export type NodeType =
  | "project"
  | "task"
  | "document"
  | "person"
  | "milestone"
  | "risk";

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
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  priority: Priority;
  notes: string;
  attachments: Attachment[];
}

export type CanvasNode = Node<NodeData>;

export interface EdgeData extends Record<string, unknown> {
  relationship: RelationshipType;
}

export type CanvasEdge = Edge<EdgeData>;

export interface CanvasWorkspace {
  id: string;
  name: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  createdAt: string;
  updatedAt: string;
}

export const STATUS_OPTIONS: Record<NodeType, string[]> = {
  project: ["Planning", "Active", "On Hold", "Completed", "Archived"],
  task: ["To Do", "In Progress", "In Review", "Done", "Blocked"],
  document: ["Draft", "In Review", "Approved", "Published", "Outdated"],
  person: ["Available", "Busy", "On Leave", "Unavailable"],
  milestone: ["Upcoming", "In Progress", "Achieved", "Missed", "Deferred"],
  risk: ["Identified", "Assessing", "Mitigating", "Resolved", "Accepted"],
};

export const NODE_COLORS: Record<NodeType, { bg: string; border: string; text: string }> = {
  project: { bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" },
  task: { bg: "#1a3d2e", border: "#22c55e", text: "#86efac" },
  document: { bg: "#3d1f56", border: "#a855f7", text: "#d8b4fe" },
  person: { bg: "#4a2c17", border: "#f97316", text: "#fdba74" },
  milestone: { bg: "#4a3f14", border: "#eab308", text: "#fde047" },
  risk: { bg: "#4a1c1c", border: "#ef4444", text: "#fca5a5" },
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
