"use client";

import { useCallback, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Toolbox } from "@/components/sidebar/Toolbox";
import { CanvasArea } from "@/components/canvas/CanvasArea";
import { TopBar } from "@/components/canvas/TopBar";
import { DetailsPanel } from "@/components/panel/DetailsPanel";
import { useCanvasStore } from "@/hooks/useCanvasStore";

export default function HomePage() {
  const store = useCanvasStore();

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      store.setSelectedNodeId(nodeId || null);
    },
    [store]
  );

  const handleClosePanel = useCallback(() => {
    store.setSelectedNodeId(null);
  }, [store]);

  useEffect(() => {
    if (store.initialized) {
      store.save();
    }
  }, [store.nodes, store.edges, store.workspaces, store.initialized]);

  if (!store.initialized) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
      <TopBar
        workspaces={store.workspaces}
        activeWorkspaceId={store.activeWorkspaceId}
        onSave={store.save}
        onClear={store.clearCanvas}
        onAddWorkspace={store.addWorkspace}
        onSwitchWorkspace={store.switchWorkspace}
        onDeleteWorkspace={store.deleteWorkspace}
        onRenameWorkspace={store.renameWorkspace}
      />
      <div className="flex flex-1 overflow-hidden">
        <Toolbox />
        <ReactFlowProvider>
          <CanvasArea
            nodes={store.nodes}
            edges={store.edges}
            onNodesChange={store.onNodesChange}
            onEdgesChange={store.onEdgesChange}
            onConnect={store.onConnect}
            onNodeClick={handleNodeClick}
            onAddNode={store.addNode}
            onDeleteNode={store.deleteNode}
          />
        </ReactFlowProvider>
        <DetailsPanel
          node={store.selectedNode}
          onUpdate={store.updateNodeData}
          onDelete={store.deleteNode}
          onClose={handleClosePanel}
        />
      </div>
    </div>
  );
}
