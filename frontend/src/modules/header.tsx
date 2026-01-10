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
					Livre
				</button>
				<button style={style.button} onClick={() => navigate(`/medias?id=${props.password}`, {state: dataBasicMembers})}>
					Medias
				</button>
				<button style={style.button} onClick={() => navigate(`/recettes?id=${props.password}`, {state: dataBasicMembers})}>
					Recettes
				</button>
			</div>
		</div>
	)
}

const style = {
	background: {
		width: "100vw",
		height: "10vh",
		backgroundColor: "brown",
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
		border: 'none'
	},
	container: {
		width: "100vw",
		height: "10vh",
	}
}

export default Header;