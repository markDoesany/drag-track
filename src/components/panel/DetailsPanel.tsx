"use client";

import { useCallback } from "react";
import { X, Trash2, Paperclip, FolderOpen, ChevronRight } from "lucide-react";
import { v4 as uuid } from "uuid";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CanvasNode, NodeData, Priority } from "@/types/canvas";
import { STATUS_OPTIONS, NODE_COLORS, DRILLABLE_TYPES, NODE_LABELS } from "@/types/canvas";

interface DetailsPanelProps {
  node: CanvasNode | null;
  childNodes: CanvasNode[];
  onUpdate: (nodeId: string, updates: Partial<NodeData>) => void;
  onDelete: (nodeId: string) => void;
  onOpen: (nodeId: string) => void;
  onClose: () => void;
}

export function DetailsPanel({ node, childNodes, onUpdate, onDelete, onOpen, onClose }: DetailsPanelProps) {
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!node || !e.target.files) return;
      const files = Array.from(e.target.files);
      const newAttachments = files.map((f) => ({
        id: uuid(),
        name: f.name,
        size: f.size,
        type: f.type,
        addedAt: new Date().toISOString(),
      }));
      onUpdate(node.id, {
        attachments: [...(node.data.attachments ?? []), ...newAttachments],
      });
      e.target.value = "";
    },
    [node, onUpdate]
  );

  const removeAttachment = useCallback(
    (attachmentId: string) => {
      if (!node) return;
      onUpdate(node.id, {
        attachments: node.data.attachments.filter((a) => a.id !== attachmentId),
      });
    },
    [node, onUpdate]
  );

  if (!node) {
    return (
      <div className="w-[320px] border-l border-white/10 bg-[#0f0f12] flex items-center justify-center">
        <p className="text-sm text-white/30">Select a node to view details</p>
      </div>
    );
  }

  const { data } = node;
  const nodeType = data.nodeType;
  const colors = NODE_COLORS[nodeType];
  const statuses = STATUS_OPTIONS[nodeType] ?? ["Active", "Inactive"];
  const canDrillIn = DRILLABLE_TYPES.includes(nodeType);

  return (
    <div className="w-[320px] border-l border-white/10 bg-[#0f0f12] flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.border }}
          />
          <h2 className="text-sm font-semibold text-white/80">
            {NODE_LABELS[nodeType]} Details
          </h2>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
          <X size={16} />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-4">
          {canDrillIn && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpen(node.id)}
                className="w-full justify-start text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 border border-blue-400/20"
              >
                <FolderOpen size={14} className="mr-2" />
                Open {NODE_LABELS[nodeType]}
              </Button>

              {childNodes.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/60">
                    Contents ({childNodes.length})
                  </Label>
                  <div className="flex flex-col gap-1">
                    {childNodes.map((child) => {
                      const childColors = NODE_COLORS[child.data.nodeType];
                      return (
                        <div
                          key={child.id}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/8 transition-colors"
                        >
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: childColors?.border ?? "#666" }}
                          />
                          <span className="text-xs text-white/70 truncate flex-1">
                            {child.data.title}
                          </span>
                          <span className="text-[10px] text-white/30 uppercase">
                            {NODE_LABELS[child.data.nodeType]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Separator className="bg-white/10" />
            </>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs text-white/60">Title</Label>
            <Input
              value={data.title}
              onChange={(e) => onUpdate(node.id, { title: e.target.value })}
              className="bg-white/5 border-white/10 text-white text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-white/60">Description</Label>
            <Textarea
              value={data.description}
              onChange={(e) => onUpdate(node.id, { description: e.target.value })}
              className="bg-white/5 border-white/10 text-white text-sm min-h-[80px] resize-none"
              placeholder="Add a description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60">Status</Label>
              <Select
                value={data.status || undefined}
                onValueChange={(val: string | null) => {
                  if (val) onUpdate(node.id, { status: val });
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/60">Priority</Label>
              <Select
                value={data.priority}
                onValueChange={(val: string | null) => {
                  if (val) onUpdate(node.id, { priority: val as Priority });
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60">Start Date</Label>
              <Input
                type="date"
                value={data.startDate}
                onChange={(e) => onUpdate(node.id, { startDate: e.target.value })}
                className="bg-white/5 border-white/10 text-white text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60">End Date</Label>
              <Input
                type="date"
                value={data.endDate}
                onChange={(e) => onUpdate(node.id, { endDate: e.target.value })}
                className="bg-white/5 border-white/10 text-white text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-white/60">Owner</Label>
            <Input
              value={data.owner ?? ""}
              onChange={(e) => onUpdate(node.id, { owner: e.target.value })}
              className="bg-white/5 border-white/10 text-white text-sm"
              placeholder="Assign owner..."
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-white/60">Notes</Label>
            <Textarea
              value={data.notes}
              onChange={(e) => onUpdate(node.id, { notes: e.target.value })}
              className="bg-white/5 border-white/10 text-white text-sm min-h-[60px] resize-none"
              placeholder="Add notes..."
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-2">
            <Label className="text-xs text-white/60 flex items-center gap-1">
              <Paperclip size={12} />
              Attachments
            </Label>
            <div className="flex flex-col gap-1.5">
              {data.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5"
                >
                  <span className="text-xs text-white/70 truncate max-w-[200px]">
                    {att.name}
                  </span>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="text-white/30 hover:text-red-400 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 bg-white/5 rounded cursor-pointer hover:bg-white/10 transition-colors">
              <Paperclip size={12} />
              Add File
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          <Separator className="bg-white/10" />

          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(node.id)}
            className="w-full"
          >
            <Trash2 size={14} className="mr-1.5" />
            Delete Node
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
