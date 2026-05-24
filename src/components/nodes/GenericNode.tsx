"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Target,
  Clock,
  Timer,
  Calendar,
  Box,
  FileText,
  Megaphone,
  BookOpen,
  Cpu,
  User,
  StickyNote,
  File,
  Puzzle,
} from "lucide-react";
import type { NodeData, NodeType } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

const ICON_MAP: Record<string, React.ElementType> = {
  goal: Target,
  timeline: Clock,
  deadline: Timer,
  meeting: Calendar,
  resource: Box,
  "custom-component": Puzzle,
  srs: FileText,
  marketing: Megaphone,
  "meeting-log": BookOpen,
  "tech-spec": Cpu,
  person: User,
  note: StickyNote,
  "file-item": File,
  "custom-item": Puzzle,
};

const SHAPE_MAP: Record<string, string> = {
  goal: "rounded-xl",
  timeline: "rounded-lg",
  deadline: "rounded-lg",
  meeting: "rounded-xl",
  resource: "rounded-lg",
  "custom-component": "rounded-lg",
  srs: "rounded-lg",
  marketing: "rounded-xl",
  "meeting-log": "rounded-lg",
  "tech-spec": "rounded-lg",
  person: "rounded-full",
  note: "rounded-lg",
  "file-item": "rounded-lg",
  "custom-item": "rounded-lg",
};

function GenericNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as NodeData;
  const nodeType = nodeData.nodeType as NodeType;
  const colors = NODE_COLORS[nodeType] ?? NODE_COLORS["custom-component"];
  const Icon = ICON_MAP[nodeType] ?? Puzzle;
  const shape = SHAPE_MAP[nodeType] ?? "rounded-lg";

  return (
    <div className="relative flex items-center justify-center">
      <Handle type="target" position={Position.Top} style={{ background: colors.border }} className="!w-2 !h-2" />
      <div
        className={`w-[130px] h-[75px] flex flex-col items-center justify-center gap-1 transition-shadow ${shape}`}
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${selected ? colors.text : colors.border}`,
          boxShadow: selected ? `0 0 20px ${colors.border}60` : "none",
        }}
      >
        <Icon size={18} style={{ color: colors.text }} />
        <span
          className="text-xs font-medium text-center px-2 leading-tight max-w-[110px] truncate"
          style={{ color: colors.text }}
        >
          {nodeData.title}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: colors.border }} className="!w-2 !h-2" />
    </div>
  );
}

export default memo(GenericNode);
