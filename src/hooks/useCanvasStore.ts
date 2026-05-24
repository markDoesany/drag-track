"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
} from "@xyflow/react";
import { v4 as uuid } from "uuid";
import type {
  Canvas,
  CanvasNode,
  CanvasEdge,
  CanvasLevel,
  AppState,
  NodeType,
  NodeData,
  RelationshipType,
} from "@/types/canvas";
import { DRILLABLE_TYPES } from "@/types/canvas";
import { createDefaultNodeData } from "@/lib/defaults";
import { loadAppState, saveAppState } from "@/lib/storage";

function createCanvas(
  level: CanvasLevel,
  title: string,
  parentCanvasId: string | null,
  parentNodeId: string | null,
  projectId: string | null
): Canvas {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    level,
    title,
    parentCanvasId,
    parentNodeId,
    projectId,
    createdAt: now,
    updatedAt: now,
  };
}

export interface BreadcrumbItem {
  canvasId: string;
  title: string;
  level: CanvasLevel;
}

export function useCanvasStore() {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [edges, setEdges] = useState<CanvasEdge[]>([]);
  const [activeCanvasId, setActiveCanvasId] = useState<string>("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const state = loadAppState();
    if (state) {
      setCanvases(state.canvases);
      setNodes(state.nodes);
      setEdges(state.edges);
      setActiveCanvasId(state.activeCanvasId);
    } else {
      const workspace = createCanvas("workspace", "All Projects", null, null, null);
      setCanvases([workspace]);
      setActiveCanvasId(workspace.id);
    }
    setInitialized(true);
  }, []);

  const activeCanvas = useMemo(
    () => canvases.find((c) => c.id === activeCanvasId) ?? null,
    [canvases, activeCanvasId]
  );

  const currentNodes = useMemo(
    () => nodes.filter((n) => n.data.canvasId === activeCanvasId),
    [nodes, activeCanvasId]
  );

  const currentEdges = useMemo(
    () => edges.filter((e) => e.data?.canvasId === activeCanvasId),
    [edges, activeCanvasId]
  );

  const selectedNode = useMemo(
    () => currentNodes.find((n) => n.id === selectedNodeId) ?? null,
    [currentNodes, selectedNodeId]
  );

  // Build breadcrumb path from root to active canvas
  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const path: BreadcrumbItem[] = [];
    let current = activeCanvas;
    while (current) {
      path.unshift({ canvasId: current.id, title: current.title, level: current.level });
      current = current.parentCanvasId
        ? canvases.find((c) => c.id === current!.parentCanvasId) ?? null
        : null;
    }
    return path;
  }, [activeCanvas, canvases]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((prev) => {
        const canvasNodes = prev.filter((n) => n.data.canvasId === activeCanvasId);
        const otherNodes = prev.filter((n) => n.data.canvasId !== activeCanvasId);
        const updated = applyNodeChanges(changes, canvasNodes) as CanvasNode[];
        return [...otherNodes, ...updated];
      });
    },
    [activeCanvasId]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((prev) => {
        const canvasEdges = prev.filter((e) => e.data?.canvasId === activeCanvasId);
        const otherEdges = prev.filter((e) => e.data?.canvasId !== activeCanvasId);
        const updated = applyEdgeChanges(changes, canvasEdges) as CanvasEdge[];
        return [...otherEdges, ...updated];
      });
    },
    [activeCanvasId]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: CanvasEdge = {
        ...connection,
        id: uuid(),
        type: "smoothstep",
        label: "Related To",
        data: { relationship: "related-to" as RelationshipType, canvasId: activeCanvasId },
      };
      setEdges((prev) => addEdge(newEdge, prev) as CanvasEdge[]);
    },
    [activeCanvasId]
  );

  const addNode = useCallback(
    (nodeType: NodeType, position: { x: number; y: number }) => {
      const newNode: CanvasNode = {
        id: uuid(),
        type: nodeType,
        position,
        data: createDefaultNodeData(nodeType, activeCanvasId),
      };
      setNodes((prev) => [...prev, newNode]);
      setSelectedNodeId(newNode.id);
      return newNode;
    },
    [activeCanvasId]
  );

  const updateNodeData = useCallback(
    (nodeId: string, updates: Partial<NodeData>) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
        )
      );
      // If title changed and there's a child canvas for this node, update its title too
      if (updates.title) {
        setCanvases((prev) =>
          prev.map((c) =>
            c.parentNodeId === nodeId ? { ...c, title: updates.title! } : c
          )
        );
      }
    },
    []
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      // Also delete any child canvases and their nodes/edges recursively
      const childCanvasIds = new Set<string>();
      const collectChildren = (parentNodeId: string) => {
        const childCanvases = canvases.filter((c) => c.parentNodeId === parentNodeId);
        for (const child of childCanvases) {
          childCanvasIds.add(child.id);
          const childNodes = nodes.filter((n) => n.data.canvasId === child.id);
          for (const cn of childNodes) {
            collectChildren(cn.id);
          }
        }
      };
      collectChildren(nodeId);

      setNodes((prev) =>
        prev.filter((n) => n.id !== nodeId && !childCanvasIds.has(n.data.canvasId))
      );
      setEdges((prev) =>
        prev.filter(
          (e) =>
            e.source !== nodeId &&
            e.target !== nodeId &&
            !childCanvasIds.has(e.data?.canvasId ?? "")
        )
      );
      setCanvases((prev) => prev.filter((c) => !childCanvasIds.has(c.id)));
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
    },
    [canvases, nodes, selectedNodeId]
  );

  const deleteEdge = useCallback((edgeId: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
  }, []);

  // Navigate into a node (drill down)
  const navigateInto = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node || !DRILLABLE_TYPES.includes(node.data.nodeType)) return;

      // Check if a child canvas already exists for this node
      let childCanvas = canvases.find((c) => c.parentNodeId === nodeId);

      if (!childCanvas) {
        // Determine child level
        const currentLevel = activeCanvas?.level;
        let childLevel: CanvasLevel;
        if (currentLevel === "workspace") {
          childLevel = "project";
        } else if (currentLevel === "project") {
          childLevel = "component";
        } else {
          return; // Can't go deeper than component
        }

        // Determine projectId
        const projectId =
          currentLevel === "workspace" ? nodeId : (activeCanvas?.projectId ?? null);

        childCanvas = createCanvas(
          childLevel,
          node.data.title,
          activeCanvasId,
          nodeId,
          projectId
        );
        setCanvases((prev) => [...prev, childCanvas!]);
      }

      setActiveCanvasId(childCanvas.id);
      setSelectedNodeId(null);
    },
    [nodes, canvases, activeCanvas, activeCanvasId]
  );

  // Navigate to a specific canvas (breadcrumb click)
  const navigateTo = useCallback((canvasId: string) => {
    setActiveCanvasId(canvasId);
    setSelectedNodeId(null);
  }, []);

  // Navigate up one level
  const navigateUp = useCallback(() => {
    if (activeCanvas?.parentCanvasId) {
      setActiveCanvasId(activeCanvas.parentCanvasId);
      setSelectedNodeId(null);
    }
  }, [activeCanvas]);

  const save = useCallback(() => {
    const state: AppState = { canvases, nodes, edges, activeCanvasId };
    saveAppState(state);
  }, [canvases, nodes, edges, activeCanvasId]);

  const clearCanvas = useCallback(() => {
    // Clear only nodes and edges on the current canvas
    setNodes((prev) => prev.filter((n) => n.data.canvasId !== activeCanvasId));
    setEdges((prev) => prev.filter((e) => e.data?.canvasId !== activeCanvasId));
    // Also remove child canvases of deleted nodes
    const nodeIdsOnCanvas = nodes
      .filter((n) => n.data.canvasId === activeCanvasId)
      .map((n) => n.id);
    setCanvases((prev) =>
      prev.filter((c) => !nodeIdsOnCanvas.includes(c.parentNodeId ?? ""))
    );
    setSelectedNodeId(null);
  }, [activeCanvasId, nodes]);

  return {
    initialized,
    canvases,
    activeCanvas,
    activeCanvasId,
    currentNodes,
    currentEdges,
    selectedNode,
    selectedNodeId,
    breadcrumbs,
    setSelectedNodeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
    deleteNode,
    deleteEdge,
    navigateInto,
    navigateTo,
    navigateUp,
    save,
    clearCanvas,
  };
}
