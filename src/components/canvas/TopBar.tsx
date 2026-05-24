"use client";

import { useState } from "react";
import { Plus, Save, Trash2, RotateCcw, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CanvasWorkspace } from "@/types/canvas";

interface TopBarProps {
  workspaces: CanvasWorkspace[];
  activeWorkspaceId: string | null;
  onSave: () => void;
  onClear: () => void;
  onAddWorkspace: (name: string) => void;
  onSwitchWorkspace: (id: string) => void;
  onDeleteWorkspace: (id: string) => void;
  onRenameWorkspace: (id: string, name: string) => void;
}

export function TopBar({
  workspaces,
  activeWorkspaceId,
  onSave,
  onClear,
  onAddWorkspace,
  onSwitchWorkspace,
  onDeleteWorkspace,
  onRenameWorkspace,
}: TopBarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const startRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const finishRename = () => {
    if (editingId && editName.trim()) {
      onRenameWorkspace(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

  return (
    <div className="h-12 border-b border-white/10 bg-[#0a0a0f] flex items-center px-4 gap-2">
      <div className="flex items-center gap-1 flex-1 overflow-x-auto">
        {workspaces.map((ws) => (
          <div key={ws.id} className="flex items-center">
            {editingId === ws.id ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={finishRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") finishRename();
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="h-7 w-[120px] text-xs bg-white/10 border-white/20 text-white"
                autoFocus
              />
            ) : (
              <button
                onClick={() => onSwitchWorkspace(ws.id)}
                onDoubleClick={() => startRename(ws.id, ws.name)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                  ws.id === activeWorkspaceId
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {ws.name}
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => onAddWorkspace(`Canvas ${workspaces.length + 1}`)}
          className="p-1.5 text-white/40 hover:text-white/80 hover:bg-white/5 rounded transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="h-7 px-2.5 text-xs text-white/60 hover:text-white hover:bg-white/10"
        >
          <Save size={13} className="mr-1" />
          Save
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 px-2.5 text-xs text-white/60 hover:text-white hover:bg-white/10"
        >
          <RotateCcw size={13} className="mr-1" />
          Clear
        </Button>
        {workspaces.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => activeWorkspaceId && onDeleteWorkspace(activeWorkspaceId)}
            className="h-7 px-2.5 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
          >
            <Trash2 size={13} />
          </Button>
        )}
      </div>
    </div>
  );
}
