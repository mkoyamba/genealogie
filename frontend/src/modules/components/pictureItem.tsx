import { MediaInfos, UserDataBasic } from "../../Types";
import { Dispatch, SetStateAction } from "react";
import logo_picture from '../../assets/logo_apercu_image.webp'
import logo_plus from '../../assets/logo_plus.svg'

type Props = {
	media: MediaInfos,
	dictMembers: Map<number, UserDataBasic>
	functionUserList: Dispatch<SetStateAction<boolean>>
	functionMediaSet: Dispatch<SetStateAction<MediaInfos | undefined>>
	functionMediaPlay: Dispatch<SetStateAction<boolean>>
}

function PictureItem( props : Props ) {

	return (
		<div style={style.mediaContainer}>
			<button style={style.buttonExpand} onClick={() => {
					props.functionMediaSet(props.media)
					props.functionUserList(true)
				}}><img style={{width:'100%', height:'100%'}} src={logo_plus}/>
			</button>
			<label style={style.labelMedia}>{props.media.name}</label>
			<button style={style.buttonPlay} onClick={() => {
					props.functionMediaSet(props.media)
					props.functionMediaPlay(true)
				}}>
				<img style={{width:'100%', height:'100%'}} src={logo_picture}/>
			</button>
		</div>
	);
}

const style = {
	mediaContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "5%",
		margin: "2%",
		borderRadius: "20px",
		backgroundColor: "lightGrey",
	},
	labelMedia: {
		flex: 1,
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
	buttonExpand: {
		border: "none",
		background: "transparent",
		cursor: "pointer",
		width: "50px",
		borderRadius: "20px",
		aspectRatio: "1",
	},
	buttonPlay: {
		border: "none",
		background: "transparent",
		cursor: "pointer",
		width: "40px",
		borderRadius: "20px",
		aspectRatio: "1",
	},
	};

export default PictureItem;