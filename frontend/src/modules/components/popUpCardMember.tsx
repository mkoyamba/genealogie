import { useNavigate } from "react-router-dom";
import { UserDataBasic } from "../../Types";
import IconMemberMedia from "../iconeMemberMedia";
import { Dispatch, SetStateAction } from "react";
import "./popUpCardMember.css";

type Props = {
	memberId: number,
	dictMembers: Map<number, UserDataBasic>
	functionClose: Dispatch<SetStateAction<boolean>>
}

function PopUpCardMember( props : Props ) {

	const member : UserDataBasic | undefined = props.dictMembers.get(props.memberId)

	const navigate = useNavigate();

	function genderTrad( gender: string | undefined ) {
		switch(gender) {
			case 'male':
				return 'Homme';
			case 'female':
				return 'Femme';
			case 'other':
				return 'Autre';
			default:
				return 'Inconnu';
		}
	}

	let parent1 : UserDataBasic | undefined
	if (member?.parent1 !== undefined && !Number.isNaN(member?.parent1)) {
		parent1 = props.dictMembers.get(member?.parent1)
	}
	else {
		parent1 = undefined
	}
	let parent2 : UserDataBasic | undefined
	if (member?.parent2 !== undefined && !Number.isNaN(member?.parent2)) {
		parent2 = props.dictMembers.get(member?.parent2)
	}
	else {
		parent2 = undefined
	}

	return (
		<div className="popupOverlay" style={style.background}>
			<div className="popupCard" style={style.container}>
				<button style={style.buttonClose} onClick={() => props.functionClose(false)}>X</button>
				<h1 style={style.title}>{`${member?.surname} ${member?.name}`}</h1>
				<div style={style.infoContainer}>
					<div style={style.graphicContainer}>
						<span>Nom : {member?.name}</span>
						<span>Prenom : {member?.surname}</span>
						<span>Date de naissance : {member?.dateOfBirth}</span>
						<span>Genre : {genderTrad(member?.gender)}</span>
						{(parent1 || parent2) ? <span>Parent :</span> : <span>Parent inconnus</span>}
						{parent1 && <span>{parent1?.name} {parent1?.surname}</span>}
						{parent2 && <span>{parent2?.name} {parent2?.surname}</span>}
					</div>
					<div style={style.mediasContainer}>

					</div>
				</div>
			</div>
		</div>
  );
}

const style = {
	background: {
		padding: '3%',
		width: '100vw',
		height: '100vh',
		position: 'absolute' as const,
		top: 0,
		zIndex: 9999,
	},
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: 'lightGrey',
		borderRadius: '3vh',
		display: 'flex',
		flexDirection: 'column' as const,
		alignContent: 'center',
		padding: '1rem',
		gap: '0.5rem'
	},
	title: {
		padding: '1%',
		fontSize: '2rem',
		lineHeight: '2rem',
		color: '#000',
		fontWeight: 1000,
		whiteSpace: 'nowrap',
		textAlign: 'center' as const
	},
	infoContainer: {
		width: '100%',
		height: '100%',
		display: 'flex'
	},
	graphicContainer: {
		backgroundColor: 'green',
		width: '40%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column' as const
	},
	mediasContainer: {
		backgroundColor: 'blue',
		width: '60%',
		height: '100%'
	},
	buttonClose: {
		width: '3%',
		aspectRatio: '1/1',
		position: 'absolute' as const,
		top: 0,
		left: 0,
		borderRadius: '100%',
		marginTop: '1.5%',
		marginLeft: '1.5%'
	}
}

export default PopUpCardMember;