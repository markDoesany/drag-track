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

  const handleNodeDoubleClick = useCallback(
    (nodeId: string) => {
      store.navigateInto(nodeId);
    },
    [store]
  );

  const handleClosePanel = useCallback(() => {
    store.setSelectedNodeId(null);
  }, [store]);

  // Auto-save on changes
  useEffect(() => {
    if (store.initialized) {
      store.save();
    }
  }, [store.currentNodes, store.currentEdges, store.canvases, store.initialized]);

  if (!store.initialized) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading...</div>
      </div>
    );
  }

  const canGoBack = (store.activeCanvas?.parentCanvasId ?? null) !== null;

  return (
    <div className="h-screen w-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
      <TopBar
        breadcrumbs={store.breadcrumbs}
        canGoBack={canGoBack}
        onNavigateTo={store.navigateTo}
        onNavigateUp={store.navigateUp}
        onSave={store.save}
        onClear={store.clearCanvas}
      />
      <div className="flex flex-1 overflow-hidden">
        <Toolbox level={store.activeCanvas?.level ?? "workspace"} />
        <ReactFlowProvider>
          <CanvasArea
            nodes={store.currentNodes}
            edges={store.currentEdges}
            onNodesChange={store.onNodesChange}
            onEdgesChange={store.onEdgesChange}
            onConnect={store.onConnect}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            onAddNode={store.addNode}
            onDeleteNode={store.deleteNode}
          />
        </ReactFlowProvider>
        <DetailsPanel
          node={store.selectedNode}
          onUpdate={store.updateNodeData}
          onDelete={store.deleteNode}
          onOpen={handleNodeDoubleClick}
          onClose={handleClosePanel}
        />
      </div>
    </div>
  );
}
