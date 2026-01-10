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
			Making-off et crédits
		</button>
		<button style={style.button} onClick={() => navigate(`/recommandations?id=${props.password}`, {state: dataBasicMembers})}>
			Recommandations
		</button>
	</div>
  );
}

const style = {
	background: {
		width: "100vw",
		height: "5vh",
		backgroundColor: "grey",
		position: 'fixed' as const,
		bottom: '0',
		left: '0',
	},
	button: {
		width: "50%",
		height: "100%",
		background: 'transparent',
		border: 'none'
	}
}

export default Footer;