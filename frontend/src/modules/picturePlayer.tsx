import { Dispatch, SetStateAction } from 'react';

type Props = {
	url: string | undefined
	functionClose: Dispatch<SetStateAction<boolean>>
}

const PicturePlayer = ( props : Props ) => {
	return (
		<div style={style.videoPlayer}>
			<img src={`${process.env.REACT_APP_AWS_S3_URL}${props.url}`} style={style.image}/>
			<button style={style.buttonClose} onClick={() => props.functionClose(false)}>X</button>
		</div>
	);
};

const style = {
	videoPlayer: {
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		position: 'absolute' as const,
		left: 0,
		top: 0,
		width: '90vw',
		height: '86vh',
		marginLeft: '5vw',
		marginRight: '5vw',
		marginTop: '7vh',
		marginBottom: '7vh',
		zIndex: 9999,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
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
	image: {
		maxHeight: '86vh',
		maxWidth: '90vw',
		opacity: '1'
	}
}

export default PicturePlayer;