import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { MediaInfos } from "../../Types";

type Props = {
		url: string | undefined;
		media: MediaInfos | undefined;
		mediaList: MediaInfos[];
		functionClose: Dispatch<SetStateAction<boolean>>;
	};

	const PdfPlayer = (props: Props) => {
	const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(-1);

	const initialIndex = useMemo(() => {
		if (!props.media) return -1;
		return props.mediaList.findIndex((m) => m.id === props.media!.id);
	}, [props.media, props.mediaList]);

	useEffect(() => {
		setCurrentMediaIndex(initialIndex);
	}, [initialIndex]);

	const hasMedia = currentMediaIndex >= 0 && currentMediaIndex < props.mediaList.length;

	const goPrev = () => {
		if (!props.mediaList.length) return;
		setCurrentMediaIndex((prev) => {
		if (prev <= 0) return props.mediaList.length - 1;
		return prev - 1;
		});
	};

	const goNext = () => {
		if (!props.mediaList.length) return;
		setCurrentMediaIndex((prev) => {
		if (prev === -1) return 0;
		if (prev >= props.mediaList.length - 1) return 0;
		return prev + 1;
		});
	};

	if (!hasMedia) return null;

	const currentMedia = props.mediaList[currentMediaIndex];
	const pdfUrl = `${process.env.REACT_APP_AWS_S3_URL}${currentMedia.url}`;

	return (
		<div style={style.videoPlayer}>
			<label style={style.picName}>{currentMedia.name}</label>
			<button style={style.buttonPrev} onClick={goPrev} aria-label="Précédent">
				←
			</button>
			<iframe
				src={pdfUrl}
				style={style.pdf}
				title={currentMedia.name}
			/>
			<button style={style.buttonNext} onClick={goNext} aria-label="Suivant">
				→
			</button>
			<button style={style.buttonClose} onClick={() => props.functionClose(false)}>
				X
			</button>
		</div>
	);
};

const style = {
	videoPlayer: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		position: "absolute" as const,
		left: 0,
		top: 0,
		width: "90vw",
		height: "86vh",
		marginLeft: "5vw",
		marginRight: "5vw",
		marginTop: "7vh",
		marginBottom: "7vh",
		zIndex: 9999,
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
		justifyContent: "center",
	},
	picName: {
		position: "absolute" as const,
		top: 0,
		marginTop: "0.5vh",
		color: "white",
	},
	buttonClose: {
		width: "3%",
		aspectRatio: "1/1",
		position: "absolute" as const,
		top: 0,
		left: 0,
		borderRadius: "100%",
		marginTop: "1%",
		marginLeft: "1%",
		cursor: "pointer",
	},
	buttonPrev: {
		position: "absolute" as const,
		left: "2%",
		top: "50%",
		transform: "translateY(-50%)",
		width: "50px",
		height: "50px",
		borderRadius: "999px",
		border: "none",
		cursor: "pointer",
		fontSize: "24px",
	},
	buttonNext: {
		position: "absolute" as const,
		right: "2%",
		top: "50%",
		transform: "translateY(-50%)",
		width: "50px",
		height: "50px",
		borderRadius: "999px",
		border: "none",
		cursor: "pointer",
		fontSize: "24px",
	},
	pdf: {
		height: "80vh",
		width: "80vw",
		opacity: "1",
	}
};

export default PdfPlayer;