import { MediaInfos, UserDataBasic } from "../Types";
import { Dispatch, SetStateAction } from "react";
import logo_video from '../assets/logo_play_video.png'
import logo_personne from '../assets/logo_personne.png'
import DeleteMedia from "./utils/deleteMedia";

type Props = {
	media: MediaInfos,
	dictMembers: Map<number, UserDataBasic>
	functionUserList: Dispatch<SetStateAction<boolean>>
	functionMediaSet: Dispatch<SetStateAction<MediaInfos | undefined>>
	functionMediaPlay: Dispatch<SetStateAction<boolean>>
	deleteMediaFunction: (url: string) => void;
}

function VideoItem( props : Props ) {

	return (
		<div style={style.mediaContainer}>
			<button style={style.buttonExpand} onClick={() => {
					props.functionMediaSet(props.media)
					props.functionUserList(true)
				}}><img style={{width:'100%', height:'100%'}} src={logo_personne}/>
			</button>
			<span style={style.labelMedia}>{props.media.name}</span>
			<button style={style.buttonPlay} onClick={() => {
					props.functionMediaSet(props.media)
					props.functionMediaPlay(true)
				}}>
				<img style={{width:'100%', height:'100%'}} src={logo_video}/>
			</button>
			<DeleteMedia media={props.media} deleteMediaFunction={props.deleteMediaFunction}/>
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
		backgroundColor: "rgba(156, 138, 138, 0.2)",
		boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
		transition: "transform 0.2s ease, box-shadow 0.2s ease",
		transform: "perspective(800px) translateZ(0)"
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
		width: "2vw",
		borderRadius: "20px",
		aspectRatio: "1",
	},
}

export default VideoItem;