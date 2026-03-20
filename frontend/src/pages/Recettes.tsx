import { useSearchParams } from "react-router-dom";
import ButtonHomepage from "../modules/buttonHomepage";
import { checkPassword } from "../modules/utils/checkPassword";
import { useEffect, useMemo, useState } from "react";
import NoPage from "./Error404";
import Header from "../modules/header";
import Footer from "../modules/footer";
import { MediaInfos, UserDataBasic } from "../Types";
import { useLocation } from "react-router-dom";
import PopUpIconMemberMedia from "../modules/components/popUpIconMemberMedia";
import './Media.css'
import FileUploader from "../modules/components/fileUploader";
import PdfPlayer from "../modules/components/pdfPlayer";
import RecipeItem from "../modules/recipeItem";

function Recettes() {
	const apiURL = process.env.REACT_APP_AWS_API_URL

	const [searchParams] = useSearchParams();
	const password = searchParams.get("id")
	const [check,setCheck] = useState<boolean>(false)
	const [activeMedia, setActiveMedia] = useState<MediaInfos | undefined>(undefined)

	const [popUp, setPopUp] = useState<boolean>(false)
	const [pdfPlayerPop, setPdfPlayerPop] = useState<boolean>(false)
	
	const location = useLocation();
	const dataBasicMembers = location.state.dataBasicMembers
	const dictMembers : Map<number, UserDataBasic> = location.state.dictMembers
	const [search, setSearch] = useState<string>("");

	const [dataMedias, setDataMedias] = useState<MediaInfos[]>([])

	useEffect(() => {
		async function checker() {
			const response = await checkPassword(password)
			setCheck(response)
		}
		checker()

		async function getDataMedias() {
			const effectResponse = await fetch(`${apiURL}/recettes`, {
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
					name: media.name["S"].replaceAll('+', ' '),
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

		getDataMedias()
	}, [password])

	const removeMediaByUrl = (url: string) => {
		setDataMedias((prev) => prev.filter((media) => media.url !== url));
	}

	const onMembersAddedToActiveMedia = (newMemberIds: number[]) => {
		if (!activeMedia) return;

		setDataMedias((prev) =>
			prev.map((m) => {
				if (m.id !== activeMedia.id) return m;

				const merged = Array.from(new Set([...(m.membersId ?? []), ...newMemberIds]));
				return { ...m, membersId: merged };
			})
		);

		setActiveMedia((prev) => {
			if (!prev) return prev;
				const merged = Array.from(new Set([...(prev.membersId ?? []), ...newMemberIds]));
			return { ...prev, membersId: merged };
		});
	}

	const filteredMedias = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return dataMedias;

		return dataMedias.filter((m) => {
			const hay = `${m.name} ${m.extension} ${m.type}`.toLowerCase();
			return hay.includes(q);
		});
	}, [dataMedias, search]);

	return (
		<div style={style.background}>
			{check && <div style={style.background}>
				<Header password={password} dataBasicMembers={dataBasicMembers} dictMembers={dictMembers}/>
				<ButtonHomepage/>
				<div style={style.titleContainer}><label style={style.title}>RECETTES</label></div>
				<div style={style.searchBar}>
					<input
						style={style.searchInput}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Rechercher une recette..."
					/>
					{search && (
						<button style={style.searchClear} onClick={() => setSearch("")}>
						✕
						</button>
					)}
				</div>
				<div style={style.listContainers}>
					<div style={style.mediaContainerList}>
						{filteredMedias.filter((media) => media.type === "text")
						.map((media) => (
							<RecipeItem
								key={media.id}
								media={media}
								dictMembers={dictMembers}
								functionUserList={setPopUp}
								functionMediaSet={setActiveMedia}
								functionMediaPlay={setPdfPlayerPop}
								deleteMediaFunction={removeMediaByUrl}
							/>
						))}
					</div>
				</div>
				<FileUploader text={"Uploader une recette"}/>
				{pdfPlayerPop && <PdfPlayer mediaList={dataMedias.filter((media) => media.type === "text")} media={activeMedia} url={activeMedia?.url} functionClose={setPdfPlayerPop}/>}
				{popUp && (
					<PopUpIconMemberMedia
						mediaId={activeMedia?.id}
						membersId={activeMedia?.membersId}
						dictMembers={dictMembers}
						functionClose={setPopUp}
						onMembersAdded={onMembersAddedToActiveMedia}
					/>
				)}
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
		backgroundColor: "rgb(247, 237, 237)",
		overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column' as const,
		alignItems: 'center'
	},
	buttonExpand: {
		border: 'none',
		background: 'transparent',
		cursor: 'pointer'
	},
	listContainers: {
		width: '100%',
		height: '60vh',
		display: 'flex',
		alignItems: 'center'
	},
	titleContainer: {
		width: '100%',
		display: "flex",
		justifyContent: 'center',
		paddingTop: '2%'
	},
	title: {
		fontSize: '1.5rem',
		lineHeight: '1.5rem',
		color: '#000',
		fontWeight: 700,
		height: '5vh'
	},
	mediaContainerList: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexWrap: 'wrap' as const,
		alignContent: 'flex-start',
		overflowY: 'auto' as const
	},
	textListContainer: {
		width: '100%',
		height: '100%',
	},
	buttonAddMedia: {
		width: '10vw',
		height: '4vh'
	},
	searchBar: {
		width: "90%",
		display: "flex",
		alignItems: "center",
		gap: "0.5rem",
		marginTop: "1rem",
		marginBottom: "0.5rem",
	},
	searchInput: {
		flex: 1,
		padding: "0.6rem 0.9rem",
		borderRadius: "999px",
		border: "1px solid rgba(0,0,0,0.2)",
		outline: "none",
	},
	searchClear: {
		border: "none",
		cursor: "pointer",
		borderRadius: "999px",
		padding: "0.6rem 0.9rem",
	}
}

export default Recettes;