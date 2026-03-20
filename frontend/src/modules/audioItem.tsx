import { MediaInfos, UserDataBasic } from "../Types";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import logo_personne from '../assets/logo_personne.png'
import DeleteMedia from "./utils/deleteMedia";
import logo_play from '../assets/logo_play_son.png'
import logo_pause from '../assets/logo_pause.png'

type Props = {
	media: MediaInfos
	dictMembers: Map<number, UserDataBasic>
	functionUserList: Dispatch<SetStateAction<boolean>>
	functionMediaSet: Dispatch<SetStateAction<MediaInfos | undefined>>
	deleteMediaFunction: (url: string) => void;
}

function AudioItem(props: Props) {

	const audioRef = useRef<HTMLAudioElement>(null)

	const [isPlaying, setIsPlaying] = useState(false)
	const [progress, setProgress] = useState(0)
	const [duration, setDuration] = useState(0)

	const togglePlay = () => {
		const audio = audioRef.current
		if (!audio) return

		props.functionMediaSet(props.media)

		if (isPlaying) {
			audio.pause()
			setIsPlaying(false)
		} else {
			audio.play()
			setIsPlaying(true)
		}
	}

	const updateProgress = () => {
		const audio = audioRef.current
		if (!audio) return
		setProgress(audio.currentTime)
	}

	const formatTime = (time: number) => {
		const min = Math.floor(time / 60)
		const sec = Math.floor(time % 60)
		return `${min}:${sec.toString().padStart(2, "0")}`
	}

	return (
		<div style={style.mediaContainer}>
			<button style={style.buttonExpand} onClick={() => {
					props.functionMediaSet(props.media)
					props.functionUserList(true)
				}}><img style={{width:'100%', height:'100%'}} src={logo_personne}/>
			</button>

			<label style={style.labelMedia}>{props.media.name}</label>

			<div style={style.progressContainer}>
				<input
					type="range"
					min={0}
					max={duration}
					value={progress}
					step={0.01}
					style={style.range}
					onChange={(e) => {
						const audio = audioRef.current
						if (!audio) return
						audio.currentTime = Number(e.target.value)
						setProgress(Number(e.target.value))
					}}
				/>
			</div>

			<span style={style.time}>{formatTime(progress)}</span>

			<button
				style={style.buttonPlay}
				onClick={togglePlay}
			>
				{isPlaying ? <img style={{width:'100%', height:'100%'}} src={logo_pause}/> : <img style={{width:'100%', height:'100%'}} src={logo_play}/>}
			</button>

			<audio
				ref={audioRef}
				preload="none"
				src={`${process.env.REACT_APP_AWS_S3_URL}${props.media.url}`}
				onTimeUpdate={updateProgress}
				onLoadedMetadata={() => {
					if (audioRef.current) setDuration(audioRef.current.duration)
				}}
				onEnded={() => {
					setIsPlaying(false)
					setProgress(0)
				}}
			/>
			<DeleteMedia media={props.media} deleteMediaFunction={props.deleteMediaFunction}/>
		</div>
	)
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
		transform: "perspective(800px) translateZ(0)",
		gap: "10px"
	},
	buttonExpand: {
		border: "none",
		background: "transparent",
		cursor: "pointer",
		width: "50px",
		borderRadius: "20px",
		aspectRatio: "1",
	},
	labelMedia: {
		maxWidth: "30%",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis"
	},

	progressContainer: {
		flex: 1
	},

	range: {
		width: "100%"
	},

	time: {
		fontSize: "12px",
		minWidth: "40px"
	},

	buttonPlay: {
		border: "none",
		background: "transparent",
		cursor: "pointer",
		width: "1.5vw",
		borderRadius: "20px",
		aspectRatio: "1",
	}
}

export default AudioItem