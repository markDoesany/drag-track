"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckSquare } from "lucide-react";
import type { NodeData } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

function TaskNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as NodeData;
  const colors = NODE_COLORS.task;

  return (
    <div className="relative flex items-center justify-center">
      <Handle type="target" position={Position.Top} className="!bg-green-400 !w-2 !h-2" />
      <div
        className="w-[140px] h-[80px] flex flex-col items-center justify-center gap-1 transition-shadow"
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${selected ? "#4ade80" : colors.border}`,
          boxShadow: selected ? `0 0 20px ${colors.border}60` : "none",
        }}
      >
        <CheckSquare size={18} style={{ color: colors.text }} />
        <span
          className="text-xs font-medium text-center px-2 leading-tight max-w-[120px] truncate"
          style={{ color: colors.text }}
        >
          {nodeData.title}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-green-400 !w-2 !h-2" />
    </div>
  );
}

export default memo(TaskNode);
