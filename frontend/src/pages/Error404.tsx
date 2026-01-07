function NoPage() {
	return (
		<div style={style.background}>
			<h1>404</h1>
		</div>
	)
};

const style = {
	background: {
		"width": "100vw",
		"height": "100vh",
		"backgroundColor": "white"
	}
}

export default NoPage;