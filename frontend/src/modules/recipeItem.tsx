import { MediaInfos, UserDataBasic } from "../Types";
import { Dispatch, SetStateAction } from "react";
import logo_personne from '../assets/logo_personne.png'
import logo_document from '../assets/logo_document.png'
import DeleteMedia from "./utils/deleteMedia";

type Props = {
	media: MediaInfos,
	dictMembers: Map<number, UserDataBasic>
	functionUserList: Dispatch<SetStateAction<boolean>>
	functionMediaSet: Dispatch<SetStateAction<MediaInfos | undefined>>
	functionMediaPlay: Dispatch<SetStateAction<boolean>>
	deleteMediaFunction: (url: string) => void;
}

function RecipeItem( props : Props ) {

	return (
		<div style={style.mediaContainer}>
			<div style={style.buttonsContainer}>
				<button style={style.buttonExpand} onClick={() => {
					props.functionMediaSet(props.media)
					props.functionUserList(true)
				}}><img style={{width:'100%', height:'100%'}} src={logo_personne}/>
				</button>	
				<button style={style.buttonPlay} onClick={() => {
					props.functionMediaSet(props.media)
					props.functionMediaPlay(true)
				}}>
					<img style={{width:'100%', height:'100%'}} src={logo_document}/>
				</button>
				<DeleteMedia media={props.media} deleteMediaFunction={props.deleteMediaFunction}/>
			</div>
			<div style={style.labelContainer}><span style={style.labelMedia}>{props.media.name}</span></div>
		</div>
	);
}

const style = {
	mediaContainer: {
		display: "flex",
		flexDirection: "column" as const,
		justifyContent: "space-between",
		alignItems: "center",
		width: "10vw",
		height: "10vw",
		padding: "0.8vw",
		margin: "2%",
		borderRadius: "20px",
		backgroundColor: "rgba(156, 138, 138, 0.2)",
		boxSizing: "border-box" as const,
		boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
		transition: "transform 0.2s ease, box-shadow 0.2s ease",
		transform: "perspective(800px) translateZ(0)",
		border: "1px solid rgba(0,0,0,0.05)"
	},

	buttonsContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		gap: "0.5vw",
		marginTop: '1vw',
		width: "100%",
		height: "40%",
		flexShrink: 0,
	},

	labelContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		maxHeight: '50%',
		flex: 1,
		minHeight: 0,
	},

	labelMedia: {
		width: "80%",
		display: "-webkit-box",
		WebkitLineClamp: 3 as const,
		WebkitBoxOrient: "vertical" as const,
		overflow: "hidden",
		textOverflow: "ellipsis",
		wordBreak: "break-word" as const,
		textAlign: "center" as const,
		fontSize: "1rem",
		lineHeight: "1rem",
		maxHeight: "3rem",
	},

	buttonExpand: {
		border: "none",
		background: "transparent",
		cursor: "pointer",
		width: "2vw",
		borderRadius: "5%",
		aspectRatio: "1",
		flexShrink: 0,
	},

	buttonPlay: {
		border: "none",
		background: "transparent",
		cursor: "pointer",
		width: "2vw",
		height: "2vw",
		borderRadius: "5%",
		flexShrink: 0,
	}
}

export default RecipeItem;