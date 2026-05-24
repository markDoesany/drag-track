"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Flag } from "lucide-react";
import type { NodeData } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

function MilestoneNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as NodeData;
  const colors = NODE_COLORS.milestone;

  return (
    <div className="relative flex items-center justify-center">
      <Handle type="target" position={Position.Top} className="!bg-yellow-400 !w-2 !h-2" />
      <div
        className="w-[140px] h-[70px] flex flex-col items-center justify-center gap-1 transition-shadow rounded-full"
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${selected ? "#facc15" : colors.border}`,
          boxShadow: selected ? `0 0 20px ${colors.border}60` : "none",
        }}
      >
        <Flag size={16} style={{ color: colors.text }} />
        <span
          className="text-xs font-medium text-center px-4 leading-tight max-w-[110px] truncate"
          style={{ color: colors.text }}
        >
          {nodeData.title}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-yellow-400 !w-2 !h-2" />
    </div>
  );
}

export default memo(MilestoneNode);
