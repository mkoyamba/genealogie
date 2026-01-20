import { Dispatch, SetStateAction } from "react";
import { UserDataBasic } from "../Types";

type CardProps = UserDataBasic & {
  cardWidth: string;
  cardHeight: string;
  functionClose: Dispatch<SetStateAction<boolean>>
  memberSelect: Dispatch<SetStateAction<number>>
};

function Card ({ cardWidth, cardHeight, functionClose, memberSelect, ...user }: CardProps ) {
	return (
	<button
		onClick={() => {
			functionClose(true) 
			memberSelect(user.id)
		}}
		style={{...style.container, ...{width: cardWidth, height: cardHeight}}}
	>
		<h1>{user.surname} {user.name}</h1>
	</button>
  );
}

const style = {
	container: {
		backgroundColor: "#f58d64",
		borderRadius: "20px",
		border: "none",
		margin: "1vh",
		padding: "5vh"
	}
}

export default Card;