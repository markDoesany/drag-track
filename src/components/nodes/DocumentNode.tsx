"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FileText } from "lucide-react";
import type { NodeData } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

function DocumentNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as NodeData;
  const colors = NODE_COLORS.document;

  return (
    <div className="relative flex items-center justify-center">
      <Handle type="target" position={Position.Top} className="!bg-purple-400 !w-2 !h-2" />
      <div
        className="w-[140px] h-[80px] flex flex-col items-center justify-center gap-1 transition-shadow"
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${selected ? "#c084fc" : colors.border}`,
          boxShadow: selected ? `0 0 20px ${colors.border}60` : "none",
          clipPath: "polygon(0 0, 100% 15%, 100% 100%, 0 85%)",
        }}
      >
        <FileText size={18} style={{ color: colors.text }} />
        <span
          className="text-xs font-medium text-center px-4 leading-tight max-w-[110px] truncate"
          style={{ color: colors.text }}
        >
          {nodeData.title}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-400 !w-2 !h-2" />
    </div>
  );
}

export default memo(DocumentNode);
