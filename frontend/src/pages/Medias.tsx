import { useSearchParams } from "react-router-dom";
import ButtonHomepage from "../modules/buttonHomepage";
import { checkPassword } from "../modules/utils/checkPassword";
import { useEffect, useRef, useState } from "react";
import NoPage from "./Error404";
import Header from "../modules/header";
import Footer from "../modules/footer";
import { MediaInfos, UserDataBasic } from "../Types";
import { useLocation } from "react-router-dom";
import IconMemberMedia from "../modules/iconeMemberMedia";
import PopUpIconMemberMedia from "../modules/components/popUpIconMemberMedia";
import './Media.css'
import React from "react";
import FileUploader from "../modules/fileUploader";


function Medias() {
	const apiURL = "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/dev"

	const [searchParams] = useSearchParams();
	const password = searchParams.get("id")
	const [check,setCheck] = useState<Boolean>(false)
	const [activeMedia, setActiveMedia] = useState<MediaInfos | undefined>(undefined)
	const [popUp, setPopUp] = useState<boolean>(false)
	
	const location = useLocation();
	const dataBasicMembers = location.state.dataBasicMembers
	const dictMembers : Map<number, UserDataBasic> = location.state.dictMembers

	const [dataMedias, setDataMedias] = useState<MediaInfos[]>([])
	const testMedia : MediaInfos[] = [//TODO
	{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},{
		id: 0,
		name: 'photo',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/photo.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1,2]
	},
	{
		id: 1,
		name: 'test',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/test.jpg",
		extension: ".jpg",
		type: "picture",
		membersId: [1]
	},
	{
		id: 2,
		name: 'oui',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/oui.mp4",
		extension: ".mp4",
		type: "video",
		membersId: [0]
	},
	{
		id: 3,
		name: 'non',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/non.txt",
		extension: ".txt",
		type: "text",
		membersId: [6]
	},
	{
		id: 4,
		name: 'audio',
		url: "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/S3fdsf/test.jpg",
		extension: ".jpg",
		type: "audio",
		membersId: [0,1,2]
	}
]

	useEffect(() => {
		async function checker() {
			const response = await checkPassword(password)
			setCheck(response)
		}
		checker()

		async function getDataMedias() {
			const effectResponse = await fetch(`${apiURL}/medias`, {
				method: "GET",
				mode: 'cors'
			}).catch(() => {
				throw Error("Fetch error")
			})
			const raw_data = await effectResponse?.json()
			let dataMediasTemp: MediaInfos[] = [];
			raw_data.forEach((media: any) => {
				let dataMedia: MediaInfos = {
					id: parseInt(media.id["N"]),
					name: media.name["S"],
					url: media.url["S"],
					extension: media.extension["S"],
					type: media.type["S"],
					membersId: []
				}
				const membersIdRaw = media.membersId["NS"]
				membersIdRaw.forEach((id: string) => {
					if (id !== "-1")
						dataMedia.membersId.push(parseInt(id))
				})
				dataMediasTemp.push(dataMedia)
			})
			setDataMedias(dataMediasTemp)
		}

		getDataMedias() //TODO
		//setDataMedias(testMedia) //TODO
	}, [password])

	return (
		<div style={style.background}>
			{check && <div style={style.background}>
				<Header password={password} dataBasicMembers={dataBasicMembers} dictMembers={dictMembers}/>
				<ButtonHomepage/>
				<div style={style.listContainers}>
					<div style={style.videoListContainer}>
						<div style={style.titleContainer}><label style={style.title}>VIDEOS</label></div>
						<div style={style.mediaContainerList}>
							{dataMedias.filter((media) => media.type === "video")
							.map((media) => (
								<div style={style.mediaContainer}>
									<label style={style.labelMedia}>{media.name}</label>
									<button className="buttonExpand" style={style.buttonExpand} onClick={() => {
											setActiveMedia(media)
											setPopUp(true)
									}}>plus...
									</button>
								</div>
							))}
						</div>
					</div>
					<div style={style.audioListContainer}>
						<div style={style.titleContainer}><label style={style.title}>AUDIOS</label></div>
						<div style={style.mediaContainerList}>
							{dataMedias.filter((media) => media.type === "audio")
							.map((media) => (
								<div style={style.mediaContainer}>
									<label style={style.labelMedia}>{media.name}</label>
									<button className="buttonExpand" style={style.buttonExpand} onClick={() => {
											setActiveMedia(media)
											setPopUp(true)
									}}>plus...
									</button>
								</div>
							))}
						</div>
					</div>
					<div style={style.pictureListContainer}>
						<div style={style.titleContainer}><label style={style.title}>PHOTOS</label></div>
						<div style={style.mediaContainerList}>
							{dataMedias.filter((media) => media.type === "picture")
							.map((media) => (
								<div style={style.mediaContainer}>
									<label style={style.labelMedia}>{media.name}</label>
									<button className="buttonExpand" style={style.buttonExpand} onClick={() => {
											setActiveMedia(media)
											setPopUp(true)
									}}>plus...
									</button>
								</div>
							))}
						</div>
					</div>
					<div style={style.textListContainer}>
						<div style={style.titleContainer}><label style={style.title}>ARTICLES</label></div>
						<div style={style.mediaContainerList}>
							{dataMedias.filter((media) => media.type === "text")
							.map((media) => (
								<div style={style.mediaContainer}>
									<label style={style.labelMedia}>{media.name}</label>
									<button className="buttonExpand" style={style.buttonExpand} onClick={() => {
											setActiveMedia(media)
											setPopUp(true)
									}}>plus...
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
				<FileUploader/>
				{popUp && <PopUpIconMemberMedia membersId={activeMedia?.membersId} dictMembers={dictMembers} functionClose={setPopUp}/>}
				<Footer password={password} dataBasicMembers={dataBasicMembers} dictMembers={dictMembers}/>
			</div>}
			{!check && <NoPage/>}
		</div>
	)
};

const style = {
	background: {
		width: "100vw",
		height: "100vh",
		backgroundColor: "pink",
		overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column' as const,
		alignItems: 'center'
	},
	mediaContainer: {
		display: "flex",
		alignItems: 'center',
		padding: '5%'
	},
	labelMedia: {
		width: '92%',
	},
	buttonExpand: {
		border: 'none',
		background: 'transparent',
		cursor: 'pointer'
	},
	listContainers: {
		width: '100%',
		height: '80vh',
		display: "flex",
		justifyContent: 'center',
	},
	titleContainer: {
		width: '100%',
		display: "flex",
		justifyContent: 'center',
		padding: '5%'
	},
	title: {
		fontSize: '1.5rem',
		lineHeight: '1.5rem',
		color: '#000',
		fontWeight: 700,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '90%'
	},
	mediaContainerList: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column' as const,
		alignContent: 'flex-start',
		overflowY: 'auto' as const
	},
	videoListContainer: {
		width: '25%',
		height: '80%'
	},
	audioListContainer: {
		width: '25%',
		height: '80%'
	},
	pictureListContainer: {
		width: '25%',
		height: '80%'
	},
	textListContainer: {
		width: '25%',
		height: '80%'
	},
	buttonAddMedia: {
		width: '10vw',
		height: '4vh'
	}
}

export default Medias;