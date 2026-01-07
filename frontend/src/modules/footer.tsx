import { useNavigate } from "react-router-dom";

type Props = {
	password : String | null
}

function Footer( props : Props ) {

	const navigate = useNavigate();

	return (
	<div style={style.background}>
		 <button style={style.button} onClick={() => navigate(`/credits?id=${props.password}`)}>
			Making-off et crédits
		</button>
		<button style={style.button} onClick={() => navigate(`/recommandations?id=${props.password}`)}>
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