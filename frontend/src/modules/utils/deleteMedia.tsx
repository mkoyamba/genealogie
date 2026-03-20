import { Dispatch, SetStateAction } from "react";
import { MediaInfos } from "../../Types";
import logo_delete from '../../assets/logo_delete.png'

type Props = {
	media: MediaInfos,
	deleteMediaFunction: (url: string) => void;
}

function DeleteMedia( props : Props ) {

	const apiURL = process.env.REACT_APP_AWS_API_URL

	const deleteMedia = async () => {
		try {
			const res = await fetch(`${apiURL}/medias`, {
				method: "DELETE",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: props.media.url }),
			});

			if (!res.ok) {
				throw new Error(`HTTP error ${res.status}`);
			}

			props.deleteMediaFunction(props.media.url);

		} catch (err) {
			console.error("Delete failed:", err);
		}
	}

	return (
		<button style={style.buttonDelete} onClick={deleteMedia}>
			<img style={{width:'100%', height:'100%'}} src={logo_delete}/>
		</button>
	);
}

const style = {
	buttonDelete: {
		border: "none",
		background: "transparent",
		cursor: "pointer",
		width: "2vw",
		borderRadius: "20px",
		aspectRatio: "1",
		flexShrink: 0
	}
}

export default DeleteMedia;