import ProjectNode from "./ProjectNode";
import TaskNode from "./TaskNode";
import DocumentNode from "./DocumentNode";
import TeamNode from "./TeamNode";
import RiskNode from "./RiskNode";
import GenericNode from "./GenericNode";

export const nodeTypes = {
  project: ProjectNode,
  task: TaskNode,
  document: DocumentNode,
  team: TeamNode,
  risk: RiskNode,
  // Level 2 components using GenericNode
  goal: GenericNode,
  timeline: GenericNode,
  deadline: GenericNode,
  meeting: GenericNode,
  resource: GenericNode,
  "custom-component": GenericNode,
  // Level 3 details using GenericNode
  srs: GenericNode,
  marketing: GenericNode,
  "meeting-log": GenericNode,
  "tech-spec": GenericNode,
  person: GenericNode,
  note: GenericNode,
  "file-item": GenericNode,
  "custom-item": GenericNode,
};
