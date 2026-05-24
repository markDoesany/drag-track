import ProjectNode from "./ProjectNode";
import TaskNode from "./TaskNode";
import DocumentNode from "./DocumentNode";
import PersonNode from "./PersonNode";
import MilestoneNode from "./MilestoneNode";
import RiskNode from "./RiskNode";

export const nodeTypes = {
  project: ProjectNode,
  task: TaskNode,
  document: DocumentNode,
  person: PersonNode,
  milestone: MilestoneNode,
  risk: RiskNode,
};
