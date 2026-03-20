import { useNavigate } from "react-router-dom";
import logo_home from '../assets/logo_home.png'

function ButtonHomepage() {
	const navigate = useNavigate();

	return (
		<button style={style.button} onClick={() => navigate("/")}>
			<img style={{width:'100%', height:'100%'}} src={logo_home}/>
		</button>
	)
};

const style = {
	button: {
		position: 'absolute' as const,
		width: '40px',
		aspectRatio: '1/1',
		borderRadius: '100%',
		border: 'none',
		marginTop: '3vh',
		marginLeft: '2.5vw',
		left: 0,
		top: 0,
		zIndex: 15,
		background: 'transparent',
		cursor: 'pointer'
	}
}

export default ButtonHomepage;