import { useNavigate } from "react-router-dom";

type Props = {
	password : String | null
}

function Header( props : Props ) {

	const navigate = useNavigate();

	return (
		<div style={style.container}>
			<div style={style.background}>
				<button style={style.button} onClick={() => navigate(`/livre?id=${props.password}`)}>
					Livre
				</button>
				<button style={style.button} onClick={() => navigate(`/medias?id=${props.password}`)}>
					Medias
				</button>
				<button style={style.button} onClick={() => navigate(`/recettes?id=${props.password}`)}>
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