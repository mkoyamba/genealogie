import { useNavigate } from "react-router-dom";
import { UserDataBasic } from "../../Types";
import IconMemberMedia from "../iconeMemberMedia";
import { Dispatch, SetStateAction } from "react";
import "./popUpIconMemberMedia.css";

type Props = {
	membersId: number[] | undefined,
	dictMembers: Map<number, UserDataBasic>
	functionClose: Dispatch<SetStateAction<boolean>>
}

function PopUpIconMemberMedia( props : Props ) {

	const navigate = useNavigate();

	return (
		<div className="popupOverlay" style={style.background}>
			<div className="popupCard" style={style.container}>
				<button style={style.buttonClose} onClick={() => props.functionClose(false)}>X</button>
				<h1 style={style.title}>Personnes presentes</h1>
				<div style={style.list}>
					{props.membersId?.map((member) => (
						props.dictMembers.get(member) !== undefined && <IconMemberMedia user={props.dictMembers.get(member)}/>
					))}
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
		zIndex: 10,
	},
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: 'lightGrey',
		borderRadius: '3vh',
		display: 'flex',
		flexDirection: 'column' as const,
		alignContent: 'center',
		justifyContent: 'center',
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
	list: {
		width: '100%',
		height: '90%',
		borderRadius: '3vh',
		display: 'flex',
		flexWrap: 'wrap' as const,
		alignContent: 'flex-start',
		overflowY: 'auto' as const,
		padding: '1rem',
		gap: '0.5rem'
	},
	buttonClose: {
		width: '3%',
		aspectRatio: '1/1',
		position: 'absolute' as const,
		top: 0,
		left: 0,
		borderRadius: '100%',
		marginTop: '4%',
		marginLeft: '4%'
	}
}

export default PopUpIconMemberMedia;