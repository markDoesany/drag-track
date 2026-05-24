import type { NodeType, NodeData } from "@/types/canvas";

export function createDefaultNodeData(nodeType: NodeType): NodeData {
  const titleMap: Record<NodeType, string> = {
    project: "New Project",
    task: "New Task",
    document: "New Document",
    person: "New Person",
    milestone: "New Milestone",
    risk: "New Risk",
  };

  const statusMap: Record<NodeType, string> = {
    project: "Planning",
    task: "To Do",
    document: "Draft",
    person: "Available",
    milestone: "Upcoming",
    risk: "Identified",
  };

  return {
    nodeType,
    title: titleMap[nodeType],
    description: "",
    status: statusMap[nodeType],
    startDate: "",
    endDate: "",
    priority: "medium",
    notes: "",
    attachments: [],
  };
}
