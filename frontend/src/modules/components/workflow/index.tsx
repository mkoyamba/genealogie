import { WorkflowProps } from "../../../Types";
import UnionBranch from "../../unionBranche";
import { buildUnionTree } from "../../utils/buildTree";

export const Workflow = ({ dataBasicMembers }: WorkflowProps) => {
  const roots = buildUnionTree(dataBasicMembers);
  const cardWidth = "12vw";
  const cardHeight = "35vh";

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "auto", display: "flex", justifyContent: "center" }}>
      <div>
        {roots.map((root) => (
          <UnionBranch
            key={root.key}
            node={root}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
	wrapper: {
		width: "100%",
		height: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		overflow: "auto",
	},
	tree: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	}
};