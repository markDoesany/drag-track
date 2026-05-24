import type { CanvasWorkspace } from "@/types/canvas";

const STORAGE_KEY = "projectcanvas_workspaces";
const ACTIVE_KEY = "projectcanvas_active_workspace";

export function loadWorkspaces(): CanvasWorkspace[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWorkspaces(workspaces: CanvasWorkspace[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
}

export function getActiveWorkspaceId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveWorkspaceId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}
