"use client";

import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Trash2, FolderOpen } from "lucide-react";
import { nodeTypes } from "@/components/nodes";
import type { CanvasNode, CanvasEdge, NodeType } from "@/types/canvas";
import { DRILLABLE_TYPES } from "@/types/canvas";
import type { OnNodesChange, OnEdgesChange, Connection } from "@xyflow/react";

interface CanvasAreaProps {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  onNodeClick: (nodeId: string) => void;
  onNodeDoubleClick: (nodeId: string) => void;
  onAddNode: (type: NodeType, position: { x: number; y: number }) => void;
  onDeleteNode: (nodeId: string) => void;
}

export function CanvasArea({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onNodeDoubleClick,
  onAddNode,
  onDeleteNode,
}: CanvasAreaProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance<CanvasNode, CanvasEdge> | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string;
    canDrillIn: boolean;
  } | null>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/projectcanvas-node") as NodeType;
      if (!type || !reactFlowInstance.current) return;

      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      onAddNode(type, position);
    },
    [onAddNode]
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeClick(node.id);
    },
    [onNodeClick]
  );

  const handleNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeDoubleClick(node.id);
    },
    [onNodeDoubleClick]
  );

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      const canvasNode = nodes.find((n) => n.id === node.id);
      const canDrillIn = canvasNode
        ? DRILLABLE_TYPES.includes(canvasNode.data.nodeType)
        : false;
      setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id, canDrillIn });
    },
    [nodes]
  );

  const handlePaneClick = useCallback(() => {
    onNodeClick("");
    setContextMenu(null);
  }, [onNodeClick]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        const selectedNodes = nodes.filter((n) => n.selected);
        selectedNodes.forEach((n) => onDeleteNode(n.id));
      }
    },
    [nodes, onDeleteNode]
  );

  return (
    <div
      className="flex-1 h-full relative"
      ref={reactFlowWrapper}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => {
          reactFlowInstance.current = instance;
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={null}
        className="bg-[#0a0a0f]"
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: { stroke: "#ffffff30", strokeWidth: 2 },
        }}
        connectionLineStyle={{ stroke: "#ffffff50", strokeWidth: 2 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#ffffff15"
        />
        <Controls className="!bg-[#1a1a2e] !border-white/10 !rounded-lg [&>button]:!bg-[#1a1a2e] [&>button]:!border-white/10 [&>button]:!text-white/60 [&>button:hover]:!bg-white/10" />
        <MiniMap
          className="!bg-[#0f0f15] !border-white/10 !rounded-lg"
          maskColor="rgba(0,0,0,0.7)"
          nodeColor={(node) => {
            const type = node.type as NodeType;
            const colorMap: Record<string, string> = {
              project: "#3b82f6",
              task: "#22c55e",
              document: "#a855f7",
              team: "#f97316",
              goal: "#84cc16",
              timeline: "#06b6d4",
              deadline: "#eab308",
              risk: "#ef4444",
              meeting: "#8b5cf6",
              resource: "#14b8a6",
            };
            return colorMap[type] ?? "#666";
          }}
        />
      </ReactFlow>

      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl py-1 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {contextMenu.canDrillIn && (
              <button
                onClick={() => {
                  onNodeDoubleClick(contextMenu.nodeId);
                  setContextMenu(null);
                }}
                className="w-full px-3 py-2 text-sm text-white/80 hover:bg-white/5 flex items-center gap-2 transition-colors"
              >
                <FolderOpen size={14} />
                Open
              </button>
            )}
            <button
              onClick={() => {
                onDeleteNode(contextMenu.nodeId);
                setContextMenu(null);
              }}
              className="w-full px-3 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors"
            >
              <Trash2 size={14} />
              Delete Node
            </button>
          </div>
        </>
      )}
    </div>
  );
}
