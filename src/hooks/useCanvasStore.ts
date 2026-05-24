"use client";

import { useState, useCallback, useEffect } from "react";
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
  CanvasNode,
  CanvasEdge,
  CanvasWorkspace,
  NodeType,
  NodeData,
  RelationshipType,
} from "@/types/canvas";
import { createDefaultNodeData } from "@/lib/defaults";
import {
  loadWorkspaces,
  saveWorkspaces,
  getActiveWorkspaceId,
  setActiveWorkspaceId,
} from "@/lib/storage";

function createWorkspace(name: string): CanvasWorkspace {
  return {
    id: uuid(),
    name,
    nodes: [],
    edges: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function useCanvasStore() {
  const [workspaces, setWorkspaces] = useState<CanvasWorkspace[]>([]);
  const [activeWorkspaceId, setActiveId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loaded = loadWorkspaces();
    const storedActive = getActiveWorkspaceId();
    if (loaded.length > 0) {
      setWorkspaces(loaded);
      setActiveId(storedActive && loaded.find((w) => w.id === storedActive) ? storedActive : loaded[0].id);
    } else {
      const first = createWorkspace("Canvas 1");
      setWorkspaces([first]);
      setActiveId(first.id);
    }
    setInitialized(true);
  }, []);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) ?? null;
  const nodes = activeWorkspace?.nodes ?? [];
  const edges = activeWorkspace?.edges ?? [];
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  const updateActiveWorkspace = useCallback(
    (updater: (ws: CanvasWorkspace) => CanvasWorkspace) => {
      setWorkspaces((prev) =>
        prev.map((w) =>
          w.id === activeWorkspaceId
            ? updater({ ...w, updatedAt: new Date().toISOString() })
            : w
        )
      );
    },
    [activeWorkspaceId]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      updateActiveWorkspace((ws) => ({
        ...ws,
        nodes: applyNodeChanges(changes, ws.nodes) as CanvasNode[],
      }));
    },
    [updateActiveWorkspace]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      updateActiveWorkspace((ws) => ({
        ...ws,
        edges: applyEdgeChanges(changes, ws.edges) as CanvasEdge[],
      }));
    },
    [updateActiveWorkspace]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: CanvasEdge = {
        ...connection,
        id: uuid(),
        type: "smoothstep",
        label: "Related To",
        data: { relationship: "related-to" as RelationshipType },
      };
      updateActiveWorkspace((ws) => ({
        ...ws,
        edges: addEdge(newEdge, ws.edges) as CanvasEdge[],
      }));
    },
    [updateActiveWorkspace]
  );

  const addNode = useCallback(
    (nodeType: NodeType, position: { x: number; y: number }) => {
      const newNode: CanvasNode = {
        id: uuid(),
        type: nodeType,
        position,
        data: createDefaultNodeData(nodeType),
      };
      updateActiveWorkspace((ws) => ({
        ...ws,
        nodes: [...ws.nodes, newNode],
      }));
      setSelectedNodeId(newNode.id);
      return newNode;
    },
    [updateActiveWorkspace]
  );

  const updateNodeData = useCallback(
    (nodeId: string, updates: Partial<NodeData>) => {
      updateActiveWorkspace((ws) => ({
        ...ws,
        nodes: ws.nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
        ),
      }));
    },
    [updateActiveWorkspace]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      updateActiveWorkspace((ws) => ({
        ...ws,
        nodes: ws.nodes.filter((n) => n.id !== nodeId),
        edges: ws.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      }));
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
    },
    [updateActiveWorkspace, selectedNodeId]
  );

  const deleteEdge = useCallback(
    (edgeId: string) => {
      updateActiveWorkspace((ws) => ({
        ...ws,
        edges: ws.edges.filter((e) => e.id !== edgeId),
      }));
    },
    [updateActiveWorkspace]
  );

  const updateEdgeRelationship = useCallback(
    (edgeId: string, relationship: RelationshipType, label: string) => {
      updateActiveWorkspace((ws) => ({
        ...ws,
        edges: ws.edges.map((e) =>
          e.id === edgeId ? { ...e, label, data: { ...e.data, relationship } } : e
        ),
      }));
    },
    [updateActiveWorkspace]
  );

  const save = useCallback(() => {
    saveWorkspaces(workspaces);
    if (activeWorkspaceId) setActiveWorkspaceId(activeWorkspaceId);
  }, [workspaces, activeWorkspaceId]);

  const clearCanvas = useCallback(() => {
    updateActiveWorkspace((ws) => ({ ...ws, nodes: [], edges: [] }));
    setSelectedNodeId(null);
  }, [updateActiveWorkspace]);

  const addWorkspace = useCallback(
    (name: string) => {
      const ws = createWorkspace(name);
      setWorkspaces((prev) => [...prev, ws]);
      setActiveId(ws.id);
      setSelectedNodeId(null);
      return ws;
    },
    []
  );

  const switchWorkspace = useCallback(
    (id: string) => {
      setActiveId(id);
      setActiveWorkspaceId(id);
      setSelectedNodeId(null);
    },
    []
  );

  const deleteWorkspace = useCallback(
    (id: string) => {
      setWorkspaces((prev) => {
        const remaining = prev.filter((w) => w.id !== id);
        if (remaining.length === 0) {
          const fresh = createWorkspace("Canvas 1");
          setActiveId(fresh.id);
          return [fresh];
        }
        if (activeWorkspaceId === id) {
          setActiveId(remaining[0].id);
        }
        return remaining;
      });
      setSelectedNodeId(null);
    },
    [activeWorkspaceId]
  );

  const renameWorkspace = useCallback(
    (id: string, name: string) => {
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === id ? { ...w, name } : w))
      );
    },
    []
  );

  return {
    initialized,
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    nodes,
    edges,
    selectedNode,
    selectedNodeId,
    setSelectedNodeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
    deleteNode,
    deleteEdge,
    updateEdgeRelationship,
    save,
    clearCanvas,
    addWorkspace,
    switchWorkspace,
    deleteWorkspace,
    renameWorkspace,
  };
}
