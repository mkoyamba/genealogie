import { useNavigate } from "react-router-dom";

function ButtonHomepage() {
	const navigate = useNavigate();

	return (
		<button style={style.button} onClick={() => navigate("/")}>
			🏠
		</button>
	)
};

const style = {
	button: {
		position: 'absolute' as const,
		width: '2vw',
		aspectRatio: '1/1',
		borderRadius: '100%',
		border: 'none',
		top: '2.5vh',
		left: '2.5vh',
		zIndex: 15
	}
}

export default ButtonHomepage;