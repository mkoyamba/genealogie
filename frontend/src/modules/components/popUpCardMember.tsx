import { useNavigate } from "react-router-dom";
import { UserDataBasic } from "../../Types";
import { Dispatch, SetStateAction } from "react";
import logo_exit from '../../assets/logo_exit.png'
import logo_plus from '../../assets/logo_plus.png'
import "./popUpCardMember.css";
import { getUserPicture } from "../card";

type Props = {
	memberId: number,
	dictMembers: Map<number, UserDataBasic>
	functionClose: Dispatch<SetStateAction<boolean>>
}

function PopUpCardMember( props : Props ) {

	const member : UserDataBasic | undefined = props.dictMembers.get(props.memberId)

	const navigate = useNavigate();

	const picture = member?.picture ? member.picture : getUserPicture(member)

	return (
		<div className="popupOverlay" style={style.background}>
			<div className="popupCard" style={style.container}>
				<button style={style.buttonClose} onClick={() => props.functionClose(false)}>X</button>
				<h1 style={style.title}>{`${member?.surname} ${member?.name}`}</h1>
				<div style={style.infoContainer}>
					<div style={style.graphicContainer}>
						<img style={{width:'100%', aspectRatio: 1}} src={picture}/>
						<span>Date de naissance : {member?.dateOfBirth}</span>				
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
		flexDirection: 'column' as const,
		alignItems: 'center'
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