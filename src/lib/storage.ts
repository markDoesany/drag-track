import type { AppState, Canvas, CanvasNode, CanvasEdge, LegacyWorkspace } from "@/types/canvas";
import { v4 as uuid } from "uuid";

const STORAGE_KEY = "projectcanvas_v2";
const LEGACY_KEY = "projectcanvas_workspaces";

export function loadAppState(): AppState | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as AppState;
    } catch {
      return null;
    }
  }

  // Attempt migration from legacy format
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy) {
    try {
      const legacyWorkspaces: LegacyWorkspace[] = JSON.parse(legacy);
      return migrateLegacyData(legacyWorkspaces);
    } catch {
      return null;
    }
  }

  return null;
}

export function saveAppState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function migrateLegacyData(legacyWorkspaces: LegacyWorkspace[]): AppState {
  const now = new Date().toISOString();
  const workspaceCanvasId = uuid();

  const workspaceCanvas: Canvas = {
    id: workspaceCanvasId,
    level: "workspace",
    title: "All Projects",
    parentCanvasId: null,
    parentNodeId: null,
    projectId: null,
    createdAt: now,
    updatedAt: now,
  };

  const canvases: Canvas[] = [workspaceCanvas];
  const allNodes: CanvasNode[] = [];
  const allEdges: CanvasEdge[] = [];

  for (const ws of legacyWorkspaces) {
    const projectNodes = ws.nodes.filter((n) => n.data?.nodeType === "project");
    const nonProjectNodes = ws.nodes.filter((n) => n.data?.nodeType !== "project");

    // Move project nodes to workspace canvas
    for (const node of projectNodes) {
      allNodes.push({
        ...node,
        data: { ...node.data, canvasId: workspaceCanvasId },
      });

      // If there are non-project nodes, create a project canvas for this project
      if (nonProjectNodes.length > 0) {
        const projectCanvasId = uuid();
        canvases.push({
          id: projectCanvasId,
          level: "project",
          title: node.data?.title || "Migrated Project",
          parentCanvasId: workspaceCanvasId,
          parentNodeId: node.id,
          projectId: node.id,
          createdAt: now,
          updatedAt: now,
        });

        for (const childNode of nonProjectNodes) {
          // Map old types to new types
          const mappedType = childNode.data?.nodeType === "person" ? "team" : childNode.data?.nodeType;
          allNodes.push({
            ...childNode,
            data: {
              ...childNode.data,
              nodeType: mappedType as any,
              canvasId: projectCanvasId,
            },
          });
        }

        // Edges between non-project nodes go to the project canvas
        const nonProjectIds = new Set(nonProjectNodes.map((n) => n.id));
        for (const edge of ws.edges) {
          if (nonProjectIds.has(edge.source) && nonProjectIds.has(edge.target)) {
            allEdges.push({
              ...edge,
              data: { ...edge.data, canvasId: projectCanvasId, relationship: edge.data?.relationship || "related-to" },
            });
          }
        }
      }
    }

    // If no project nodes exist, create a default project for non-project nodes
    if (projectNodes.length === 0 && nonProjectNodes.length > 0) {
      const defaultProjectId = uuid();
      const defaultProjectCanvasId = uuid();

      allNodes.push({
        id: defaultProjectId,
        type: "project",
        position: { x: 250, y: 250 },
        data: {
          nodeType: "project",
          canvasId: workspaceCanvasId,
          title: ws.name || "Migrated Project",
          description: "",
          status: "Active",
          startDate: "",
          endDate: "",
          priority: "medium",
          notes: "",
          attachments: [],
          owner: "",
        },
      });

      canvases.push({
        id: defaultProjectCanvasId,
        level: "project",
        title: ws.name || "Migrated Project",
        parentCanvasId: workspaceCanvasId,
        parentNodeId: defaultProjectId,
        projectId: defaultProjectId,
        createdAt: now,
        updatedAt: now,
      });

      for (const node of nonProjectNodes) {
        const mappedType = node.data?.nodeType === "person" ? "team" : node.data?.nodeType;
        allNodes.push({
          ...node,
          data: {
            ...node.data,
            nodeType: mappedType as any,
            canvasId: defaultProjectCanvasId,
          },
        });
      }
    }

    // Edges between project nodes stay at workspace level
    const projectIds = new Set(projectNodes.map((n) => n.id));
    for (const edge of ws.edges) {
      if (projectIds.has(edge.source) && projectIds.has(edge.target)) {
        allEdges.push({
          ...edge,
          data: { ...edge.data, canvasId: workspaceCanvasId, relationship: edge.data?.relationship || "related-to" },
        });
      }
    }
  }

  return {
    canvases,
    nodes: allNodes,
    edges: allEdges,
    activeCanvasId: workspaceCanvasId,
  };
}
