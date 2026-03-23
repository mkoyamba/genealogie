import { useNavigate } from "react-router-dom";
import { UserDataBasic } from "../Types";
import { getUserPicture } from "./card";

type Props = {
	user: UserDataBasic | undefined
}

function IconMemberMedia( props : Props ) {

	const navigate = useNavigate();

	const picture = getUserPicture(props.user)

	return (
		<div>
			{props.user && <div style={style.background}>
				<div style={style.imageContainer}>
					<img style={style.image} src={picture}/>
				</div>
				<div style={style.labels}>
					<span style={style.labelText}>{props.user?.surname}</span>
					<span style={style.labelText}>{props.user?.name}</span>
				</div>
			</div>}
		</div>
	);
}

const style = {
	background: {
		width: "8vw",
		aspectRatio: "1/1",
		borderRadius: "100%",
		display: 'flex',
		flexDirection: 'column' as const,
		alignItems: 'center',
		justifyContent: 'center'
	},
	imageContainer: {
		width: "100%",
		height: "50%",
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	image: {
		height: "100%",
		aspectRatio: '1/1'
	},
	labels: {
		width: "100%",
		display: 'flex',
		flexDirection: 'column' as const,
		alignItems: 'center',
		paddingBottom: '0.5rem'
	},
	labelText: {
		fontSize: '0.6rem',
		lineHeight: '0.7rem',
		color: '#000',
		fontWeight: 500,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '90%'
	}
}

export default IconMemberMedia;