import { MediaInfos, UserDataBasic } from "../../Types";
import { Dispatch, SetStateAction } from "react";

type Props = {
	media: MediaInfos,
	dictMembers: Map<number, UserDataBasic>
	functionUserList: Dispatch<SetStateAction<boolean>>
	functionMediaSet: Dispatch<SetStateAction<MediaInfos | undefined>>
	functionMediaPlay: Dispatch<SetStateAction<boolean>>
}

function AudioItem( props : Props ) {

	return (
		<div style={style.mediaContainer}>
			<label style={style.labelMedia}>{props.media.name}</label>
			<button style={style.buttonExpand} onClick={() => {
					props.functionMediaSet(props.media)
					props.functionUserList(true)
				}}>plus...
			</button>
			<button style={style.buttonPlay} onClick={() => {
					props.functionMediaSet(props.media)
					props.functionMediaPlay(true)
				}}>▶
			</button>
		</div>
	);
}

const style = {
	mediaContainer: {
		display: "flex",
		alignItems: 'center',
		padding: '5%',
		margin: '2%',
		borderRadius: '20px',
		backgroundColor: 'lightGrey'
	},
	labelMedia: {
		display: "inline-block",
		maxWidth: "60%",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis"
	},
	buttonExpand: {
		border: 'none',
		background: 'transparent',
		cursor: 'pointer',
		marginLeft: 'auto'
	},
	buttonPlay: {
		border: 'none',
		background: 'transparent',
		cursor: 'pointer',
		width: '40px',
		borderRadius: '20px',
		aspectRatio: '1'
	}
}

export default AudioItem;