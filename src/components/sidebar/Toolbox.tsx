"use client";

import {
  Briefcase,
  CheckSquare,
  FileText,
  Users,
  AlertTriangle,
  Target,
  Clock,
  Timer,
  Calendar,
  Box,
  Puzzle,
  Megaphone,
  BookOpen,
  Cpu,
  User,
  StickyNote,
  File,
} from "lucide-react";
import type { NodeType, CanvasLevel } from "@/types/canvas";
import { NODE_COLORS, LEVEL_NODE_TYPES, NODE_LABELS } from "@/types/canvas";

const ICON_MAP: Record<NodeType, React.ReactNode> = {
  project: <Briefcase size={18} />,
  task: <CheckSquare size={18} />,
  document: <FileText size={18} />,
  team: <Users size={18} />,
  goal: <Target size={18} />,
  timeline: <Clock size={18} />,
  deadline: <Timer size={18} />,
  risk: <AlertTriangle size={18} />,
  meeting: <Calendar size={18} />,
  resource: <Box size={18} />,
  "custom-component": <Puzzle size={18} />,
  srs: <FileText size={18} />,
  marketing: <Megaphone size={18} />,
  "meeting-log": <BookOpen size={18} />,
  "tech-spec": <Cpu size={18} />,
  person: <User size={18} />,
  note: <StickyNote size={18} />,
  "file-item": <File size={18} />,
  "custom-item": <Puzzle size={18} />,
};

const LEVEL_TITLES: Record<CanvasLevel, string> = {
  workspace: "Projects",
  project: "Components",
  component: "Details",
};

interface ToolboxProps {
  level: CanvasLevel;
}

export function Toolbox({ level }: ToolboxProps) {
  const allowedTypes = LEVEL_NODE_TYPES[level];

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: NodeType
  ) => {
    event.dataTransfer.setData("application/projectcanvas-node", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-[220px] border-r border-white/10 bg-[#0f0f12] flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          {LEVEL_TITLES[level]}
        </h2>
      </div>
      <div className="p-3 flex flex-col gap-2 overflow-y-auto flex-1">
        {allowedTypes.map((type) => {
          const colors = NODE_COLORS[type];
          return (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: `${colors.bg}80`,
                border: `1px solid ${colors.border}40`,
              }}
            >
              <span style={{ color: colors.text }}>{ICON_MAP[type]}</span>
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                {NODE_LABELS[type]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t border-white/10">
        <p className="text-xs text-white/40 text-center">
          Drag items onto the canvas
        </p>
      </div>
    </div>
  );
}
