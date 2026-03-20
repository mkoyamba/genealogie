import { Dispatch, SetStateAction } from 'react';
import ReactPlayer from 'react-player';

type Props = {
	url: string | undefined
	functionClose: Dispatch<SetStateAction<boolean>>
}

const VideoPlayer = (props: Props) => {

	const videoUrl = `${process.env.REACT_APP_AWS_S3_URL}${props.url}`;

	return (
		<div style={style.videoPlayer} className="video-player">

			<ReactPlayer
				src={videoUrl}
				controls
				width="94%"
				height="94%"
			/>

			<button
				style={style.buttonClose}
				onClick={() => props.functionClose(false)}
			>
				X
			</button>

			<a
				href={videoUrl}
				download
				style={style.buttonDownload}
			>
				Télécharger
			</a>

		</div>
	);
};

const style = {
	videoPlayer: {
		background: 'white',
		position: 'absolute' as const,
		left: 0,
		top: 0,
		width: '94vw',
		height: '94vh',
		marginLeft: '3vw',
		marginRight: '3vw',
		marginTop: '3vh',
		marginBottom: '3vh',
		zIndex: 9999,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonClose: {
		width: '3%',
		aspectRatio: '1/1',
		position: 'absolute' as const,
		top: 0,
		left: 0,
		borderRadius: '100%',
		marginTop: '1%',
		marginLeft: '1%'
	},
	buttonDownload: {
		position: 'absolute' as const,
		top: 0,
		right: 0,
		marginTop: '1%',
		marginRight: '1%',
		padding: '8px 14px',
		background: '#000',
		color: 'white',
		borderRadius: '6px',
		textDecoration: 'none'
	}
}

export default VideoPlayer;