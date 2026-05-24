"use client";

import {
  Briefcase,
  CheckSquare,
  FileText,
  Users,
  Flag,
  AlertTriangle,
} from "lucide-react";
import type { NodeType } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

interface ToolboxItem {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
}

const items: ToolboxItem[] = [
  { type: "project", label: "Project", icon: <Briefcase size={18} /> },
  { type: "task", label: "Task", icon: <CheckSquare size={18} /> },
  { type: "document", label: "Document", icon: <FileText size={18} /> },
  { type: "person", label: "Person/Team", icon: <Users size={18} /> },
  { type: "milestone", label: "Milestone", icon: <Flag size={18} /> },
  { type: "risk", label: "Risk/Blocker", icon: <AlertTriangle size={18} /> },
];

export function Toolbox() {
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
          Toolbox
        </h2>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {items.map((item) => {
          const colors = NODE_COLORS[item.type];
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => onDragStart(e, item.type)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: `${colors.bg}80`,
                border: `1px solid ${colors.border}40`,
              }}
            >
              <span style={{ color: colors.text }}>{item.icon}</span>
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-auto p-3 border-t border-white/10">
        <p className="text-xs text-white/40 text-center">
          Drag items onto the canvas
        </p>
      </div>
    </div>
  );
}
