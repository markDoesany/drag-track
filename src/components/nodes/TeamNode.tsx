"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Users } from "lucide-react";
import type { NodeData } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

function TeamNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as NodeData;
  const colors = NODE_COLORS.team;

  return (
    <div className="relative flex items-center justify-center">
      <Handle type="target" position={Position.Top} className="!bg-orange-400 !w-2 !h-2" />
      <div
        className="w-[130px] h-[90px] flex flex-col items-center justify-center gap-1 transition-shadow"
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${selected ? "#fb923c" : colors.border}`,
          boxShadow: selected ? `0 0 20px ${colors.border}60` : "none",
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
      >
        <Users size={18} style={{ color: colors.text }} />
        <span
          className="text-xs font-medium text-center px-4 leading-tight max-w-[80px] truncate"
          style={{ color: colors.text }}
        >
          {nodeData.title}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-orange-400 !w-2 !h-2" />
    </div>
  );
}

export default memo(TeamNode);
