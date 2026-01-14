import ReactPlayer from 'react-player';

type Props = {
	url: string
}

const VideoPlayer = ( props : Props ) => {
  return (
    <div style={style.videoPlayer} className="video-player">
      <ReactPlayer
        src={props.url}
        controls
        width="94%"
        height="94%"
      />
    </div>
  );
};

const style = {
	videoPlayer: {
		backgroundColor: 'pink',
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
	}
}

export default VideoPlayer;