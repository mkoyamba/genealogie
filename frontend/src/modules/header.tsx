import { useNavigate, useNavigation } from "react-router-dom";
import { UserDataBasic } from "../Types";

type Props = {
	password : string | null,
	dataBasicMembers : UserDataBasic[]
	dictMembers: Map<number, UserDataBasic>
}

function Header( props : Props ) {

	const dataBasicMembers = {
		dataBasicMembers: props.dataBasicMembers,
		password: props.password,
		dictMembers: props.dictMembers
	}
	const navigate = useNavigate();

	return (
		<div style={style.container}>
			<div style={style.background}>
				<button style={style.button} onClick={() => navigate(`/livre?id=${props.password}`, {state: dataBasicMembers})}>
					<label style={style.labels}>Livre</label>
				</button>
				<button style={style.button} onClick={() => navigate(`/medias?id=${props.password}`, {state: dataBasicMembers})}>
					<label style={style.labels}>Medias</label>
				</button>
				<button style={style.button} onClick={() => navigate(`/recettes?id=${props.password}`, {state: dataBasicMembers})}>
					<label style={style.labels}>Recettes</label>
				</button>
			</div>
		</div>
	)
}

const style = {
	background: {
		width: "100vw",
		height: "10vh",
		backgroundColor: "rgb(156, 138, 138)",
		display: 'flex',
		position: 'fixed' as const,
		top: '0',
		left: '0',
		zIndex: 9
	},
	button: {
		width: "100%",
		height: "100%",
		background: 'transparent',
		border: 'none',
		color: 'rgba(255, 255, 255, 0.9)'
	},
	container: {
		width: "100vw",
		height: "10vh",
	},
	labels: {
		fontWeight: 600,
		letterSpacing: "2px"
	}
}

export default Header;