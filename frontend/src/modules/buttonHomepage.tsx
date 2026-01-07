import { useNavigate } from "react-router-dom";

function ButtonHomepage() {
	const navigate = useNavigate();

	return (
		<button style={style.button} onClick={() => navigate("/")}>
			X
		</button>
	)
};

const style = {
	button: {
		position: 'absolute' as const,
		width: '2vw',
		aspectRatio: '1/1',
		borderRadius: '100%',
		top: '0',
		left: '0'
	}
}

export default ButtonHomepage;