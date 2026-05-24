import type { NodeType, NodeData } from "@/types/canvas";

const TITLE_MAP: Record<NodeType, string> = {
  project: "New Project",
  task: "New Task",
  document: "New Document",
  team: "New Team",
  goal: "New Goal",
  timeline: "New Timeline",
  deadline: "New Deadline",
  risk: "New Risk",
  meeting: "New Meeting",
  resource: "New Resource",
  "custom-component": "New Component",
  srs: "New SRS",
  marketing: "New Marketing",
  "meeting-log": "New Meeting Log",
  "tech-spec": "New Tech Spec",
  person: "New Person",
  note: "New Note",
  "file-item": "New File",
  "custom-item": "New Item",
};

const STATUS_MAP: Record<NodeType, string> = {
  project: "Planning",
  task: "To Do",
  document: "Draft",
  team: "Active",
  goal: "Defined",
  timeline: "Draft",
  deadline: "Upcoming",
  risk: "Identified",
  meeting: "Scheduled",
  resource: "Available",
  "custom-component": "Active",
  srs: "Draft",
  marketing: "Ideation",
  "meeting-log": "Draft",
  "tech-spec": "Draft",
  person: "Available",
  note: "Active",
  "file-item": "Current",
  "custom-item": "Active",
};

export function createDefaultNodeData(nodeType: NodeType, canvasId: string): NodeData {
  return {
    nodeType,
    canvasId,
    title: TITLE_MAP[nodeType],
    description: "",
    status: STATUS_MAP[nodeType],
    startDate: "",
    endDate: "",
    priority: "medium",
    notes: "",
    attachments: [],
    owner: "",
  };
}
