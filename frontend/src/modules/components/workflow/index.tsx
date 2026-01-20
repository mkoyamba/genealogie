import { WorkflowProps } from "../../../Types";
import UnionBranch from "../../unionBranche";
import { buildUnionTree } from "../../utils/buildTree";
import './index.css'

export const Workflow = ({ dataBasicMembers, functionClose, memberSelect }: WorkflowProps) => {
  const roots = buildUnionTree(dataBasicMembers);
  const cardWidth = "12vw";
  const cardHeight = "35vh";

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "auto", display: "flex", justifyContent: "center" }}>
      <div id="stage">
		<div id="world">
			<div style={styles.rootLayer}>
			{roots.map((root) => (
				<div key={root.key} style={styles.rootUnion}>
				<UnionBranch
					node={root}
					cardWidth={cardWidth}
					cardHeight={cardHeight}
					functionClose={functionClose}
					memberSelect={memberSelect}
				/>
				</div>
			))}
			</div>
		</div>
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
		overflowY: "hidden",
    	overflowX: "hidden",
	},
	tree: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	rootLayer: {
		display: "flex",
		alignItems: "flex-start",
	},
	rootUnion: {
		/* 👇 unions non liées = très espacées */
		marginInline: "12vw", // énorme espace horizontal responsive
	}
};