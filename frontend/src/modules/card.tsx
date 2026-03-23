import { Dispatch, SetStateAction } from "react";
import { UserDataBasic } from "../Types";
import vielle from '../assets/femme_vielle.png'
import vieux from '../assets/homme_vieux.png'
import vielleux from '../assets/nonbin_vielleux.png'
import adulte_femme from '../assets/femme_adulte.png'
import adulte_homme from '../assets/homme_adulte.png'
import adulte_nonbin from '../assets/nonbin_adulte.png'
import fille from '../assets/fille.png'
import garcon from '../assets/garcon.png'
import petit_e from '../assets/petit_e.png'

type CardProps = UserDataBasic & {
  cardWidth: string;
  cardHeight: string;
  functionClose: Dispatch<SetStateAction<boolean>>
  memberSelect: Dispatch<SetStateAction<number>>
};

const getUserAge = (user: UserDataBasic | undefined) => {
	if (!user)
		return 0
	const [day, month, year] = user.dateOfBirth.split("-").map(Number);

	const birthDate = new Date(year, month - 1, day);
	const today = new Date();

	let age = today.getFullYear() - birthDate.getFullYear();

	const hasHadBirthdayThisYear =
		today.getMonth() > birthDate.getMonth() ||
		(today.getMonth() === birthDate.getMonth() &&
			today.getDate() >= birthDate.getDate());

	if (!hasHadBirthdayThisYear) {
		age--;
	}

	return age;
}

export const getUserPicture = (user: UserDataBasic | undefined) => {
		if (!user)
			return garcon
		const age = getUserAge(user)

		if (user.gender === "male") {
			if (age < 18)
				return garcon
			else if (age < 60)
				return adulte_homme
			else
				return vieux
		}
		else if (user.gender === "female") {
			if (age < 18)
				return fille
			else if (age < 60)
				return adulte_femme
			else
				return vielle
		}
		else {
			if (age < 18)
				return petit_e
			else if (age < 60)
				return adulte_nonbin
			else
				return vielleux
		}
		
}

function Card ({ cardWidth, cardHeight, functionClose, memberSelect, ...user }: CardProps ) {

	

	const picture = getUserPicture(user);

	return (
		<button
			onClick={() => {
				functionClose(true) 
				memberSelect(user.id)
			}}
			style={{...style.container, ...{width: cardWidth, height: cardHeight}}}
		>
			<img style={{width:'100%', aspectRatio: 1}} src={picture}/>
			<span style={style.labels}>{user.surname} {user.name}</span>
		</button>
	);
}

const style = {
	container: {
		background: "transparent",
		borderRadius: "20px",
		border: "none",
		margin: "1vh",
		paddingTop: "5%",
		display: 'flex',
		flexDirection: 'column' as const,
		cursor: 'pointer'
	},
	labels: {
		fontSize: 30,
		fontWeight: 700,
		cursor: 'pointer'
	}
}

export default Card;