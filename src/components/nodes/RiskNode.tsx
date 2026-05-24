"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { AlertTriangle } from "lucide-react";
import type { NodeData } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

function RiskNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as NodeData;
  const colors = NODE_COLORS.risk;

  return (
    <div className="relative flex items-center justify-center">
      <Handle type="target" position={Position.Top} className="!bg-red-400 !w-2 !h-2" />
      <div
        className="w-[110px] h-[110px] flex flex-col items-center justify-center gap-1 transition-shadow"
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${selected ? "#f87171" : colors.border}`,
          boxShadow: selected ? `0 0 20px ${colors.border}60` : "none",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
      >
        <AlertTriangle size={18} style={{ color: colors.text }} />
        <span
          className="text-xs font-medium text-center px-4 leading-tight max-w-[70px] truncate"
          style={{ color: colors.text }}
        >
          {nodeData.title}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-red-400 !w-2 !h-2" />
    </div>
  );
}

export default memo(RiskNode);
