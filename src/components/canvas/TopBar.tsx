"use client";

import { ChevronLeft, ChevronRight, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BreadcrumbItem } from "@/hooks/useCanvasStore";

interface TopBarProps {
  breadcrumbs: BreadcrumbItem[];
  canGoBack: boolean;
  onNavigateTo: (canvasId: string) => void;
  onNavigateUp: () => void;
  onSave: () => void;
  onClear: () => void;
}

export function TopBar({
  breadcrumbs,
  canGoBack,
  onNavigateTo,
  onNavigateUp,
  onSave,
  onClear,
}: TopBarProps) {
  return (
    <div className="h-12 border-b border-white/10 bg-[#0a0a0f] flex items-center px-4 gap-3">
      {canGoBack && (
        <button
          onClick={onNavigateUp}
          className="flex items-center gap-1 px-2 py-1 text-xs text-white/50 hover:text-white/90 hover:bg-white/5 rounded transition-colors"
        >
          <ChevronLeft size={14} />
          Back
        </button>
      )}

      <div className="flex items-center gap-1 flex-1 overflow-x-auto">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <div key={crumb.canvasId} className="flex items-center">
              {idx > 0 && (
                <ChevronRight size={12} className="text-white/20 mx-1" />
              )}
              <button
                onClick={() => !isLast && onNavigateTo(crumb.canvasId)}
                disabled={isLast}
                className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                  isLast
                    ? "text-white bg-white/10 border border-white/20 cursor-default"
                    : "text-white/50 hover:text-white/90 hover:bg-white/5"
                }`}
              >
                {crumb.title}
              </button>
            </div>
          );
        })}
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
      </div>
    </div>
  );
}
