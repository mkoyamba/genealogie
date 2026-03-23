import { useNavigate } from "react-router-dom";
import { UserDataBasic } from "../Types";

type Props = {
	password : string | null,
	dataBasicMembers : UserDataBasic[]
	dictMembers: Map<number, UserDataBasic>
}

function Footer( props : Props ) {

	const dataBasicMembers = {
		dataBasicMembers: props.dataBasicMembers,
		password: props.password,
		dictMembers: props.dictMembers
	}
	const navigate = useNavigate();

	return (
	<div style={style.background}>
		 <button style={style.button} onClick={() => navigate(`/credits?id=${props.password}`, {state: dataBasicMembers})}>
			<span style={style.labels}>Making-off et crédits</span>
		</button>
		<button style={style.button} onClick={() => navigate(`/recommandations?id=${props.password}`, {state: dataBasicMembers})}>
			<span style={style.labels}>Recommandations</span>
		</button>
	</div>
  );
}

const style = {
	background: {
		width: "100vw",
		height: "5vh",
		backgroundColor: "rgb(58, 47, 47)",
		position: 'fixed' as const,
		bottom: '0',
		left: '0',
	},
	button: {
		width: "50%",
		height: "100%",
		background: 'transparent',
		border: 'none'
	},
	labels: {
		color: 'rgba(255, 255, 255, 0.9)',
		fontWeight: 600,
		letterSpacing: "2px"
	}
}

export default Footer;