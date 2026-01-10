import { UserDataBasic } from "../Types";

type CardProps = UserDataBasic & {
  cardWidth: string;
  cardHeight: string;
};

function Card ({ cardWidth, cardHeight, ...user }: CardProps ) {
	return (
	<div style={{...style.container, ...{width: cardWidth, height: cardHeight}}}>
		<h1>{user.surname} {user.name}</h1>
	</div>
  );
}

const style = {
	container: {
		backgroundColor: "#f58d64",
		borderRadius: "20px",
		margin: "1vh",
		padding: "5vh"
	}
}

export default Card;