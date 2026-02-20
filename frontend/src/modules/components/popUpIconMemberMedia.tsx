import { UserDataBasic } from "../../Types";
import IconMemberMedia from "../iconeMemberMedia";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import "./popUpIconMemberMedia.css";
import logo_plus from '../../assets/logo_plus.svg'

type Props = {
	mediaId: number | undefined,
	membersId: number[] | undefined,
	dictMembers: Map<number, UserDataBasic>,
	functionClose: Dispatch<SetStateAction<boolean>>,
	onMembersAdded: (ids: number[]) => void
}

function PopUpIconMemberMedia( props : Props ) {
	const apiURL = process.env.REACT_APP_AWS_API_URL

	const [toAdd, setToAdd] = useState<number[]>([]);
	const [selectedId, setSelectedId] = useState<number | "">("");
	const [popUpAdd, setPopUpAdd] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const presentIds = useMemo(() => new Set(props.membersId ?? []), [props.membersId]);

	const selectableMembers = useMemo(() => {
		const res: { id: number; user: UserDataBasic }[] = [];
		for (const [id, user] of Array.from(props.dictMembers.entries())) {
			if (!presentIds.has(id) && !toAdd.includes(id)) res.push({ id, user });
		}
		return res;
	}, [props.dictMembers, presentIds, toAdd]);

	const selectedUsers = useMemo(() => {
		return toAdd
		.map((id) => ({ id, user: props.dictMembers.get(id) }))
		.filter((x): x is { id: number; user: UserDataBasic } => Boolean(x.user));
	}, [toAdd, props.dictMembers]);

	const addSelected = () => {
		if (selectedId === "") return;
		const id = Number(selectedId);
		if (Number.isNaN(id)) return;
		if (presentIds.has(id)) return;
		if (toAdd.includes(id)) return;
		setToAdd((prev) => [...prev, id]);
		setSelectedId("");
	};

	const removeFromToAdd = (id: number) => {
		setToAdd((prev) => prev.filter((x) => x !== id));
	};

	const submitToAdd = async () => {
		if (toAdd.length === 0) return;

		try {
			setIsSubmitting(true);

			const res = await fetch(`${apiURL}/medias/members`, {
				method: "PUT",
				mode: 'cors',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					mediaId: props.mediaId,
					membersToAdd: toAdd,
				}),
			});

			if (!res.ok) {
				const txt = await res.text().catch(() => "");
				throw new Error(`Fetch failed: ${res.status} ${txt}`);
			}

			props.onMembersAdded(toAdd);
			setToAdd([]);
			setPopUpAdd(false);

		} catch (e) {
			console.error(e);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="popupOverlay" style={style.background}>
			<div className="popupCard" style={style.container}>
				<button style={style.buttonClose} onClick={() => props.functionClose(false)}>X</button>
				<button style={style.buttonAdd} onClick={() => setPopUpAdd(true)}>
					<img style={{width:'100%', height:'100%'}} src={logo_plus}/>
				</button>
				<h1 style={style.title}>Personnes presentes</h1>
				<div style={style.list}>
					{props.membersId?.map((member) => (
						props.dictMembers.get(member) !== undefined && <IconMemberMedia user={props.dictMembers.get(member)}/>
					))}
				</div>
			</div>
			{popUpAdd && (
			<div style={style.popUpAddContainer}>
			<div style={style.popUpAddCard}>
				<button style={style.buttonCloseAdd} onClick={() => setPopUpAdd(false)}>
				X
				</button>

				<h2 style={style.popUpAddTitle}>Ajouter des membres</h2>

				<div style={style.chips}>
				{selectedUsers.length === 0 ? (
					<div style={style.chipsEmpty}>Aucun membre sélectionné.</div>
				) : (
					selectedUsers.map(({ id, user }) => (
					<div key={id} style={style.chip}>
						<span style={style.chipText}>
						{`${(user as any).surname} ${(user as any).name}`}
						</span>
						<button style={style.chipRemove} onClick={() => removeFromToAdd(id)}>
						×
						</button>
					</div>
					))
				)}
				</div>

				<div style={style.selectRow}>
				<select
					style={style.select}
					value={selectedId}
					onChange={(e) => setSelectedId(e.target.value === "" ? "" : Number(e.target.value))}
				>
					<option value="">— Choisir un membre —</option>
					{selectableMembers.map(({ id, user }) => (
					<option key={id} value={id}>
						{`${(user as any).surname} ${(user as any).name}`}
					</option>
					))}
				</select>

				<button style={style.addOneBtn} onClick={addSelected} disabled={selectedId === ""}>
					Ajouter
				</button>
				</div>

				<button
				style={style.submitBtn}
				onClick={submitToAdd}
				disabled={toAdd.length === 0 || isSubmitting}
				>
				{isSubmitting ? "Envoi..." : `Valider (${toAdd.length})`}
				</button>
			</div>
			</div>
		)}
		</div>
  );
}

const style = {
	background: {
		padding: "3%",
		width: "100vw",
		height: "100vh",
		position: "absolute" as const,
		top: 0,
		zIndex: 10,
	},
	container: {
		width: "100%",
		height: "100%",
		backgroundColor: "lightGrey",
		borderRadius: "3vh",
		display: "flex",
		flexDirection: "column" as const,
		alignContent: "center",
		justifyContent: "center",
		padding: "1rem",
		gap: "0.5rem",
	},
	title: {
		padding: "1%",
		fontSize: "2rem",
		lineHeight: "2rem",
		color: "#000",
		fontWeight: 1000,
		whiteSpace: "nowrap",
		textAlign: "center" as const,
	},
	list: {
		width: "100%",
		height: "90%",
		borderRadius: "3vh",
		display: "flex",
		flexWrap: "wrap" as const,
		alignContent: "flex-start",
		overflowY: "auto" as const,
		padding: "1rem",
		gap: "0.5rem",
	},
	buttonClose: {
		width: "3%",
		aspectRatio: "1/1",
		position: "absolute" as const,
		top: 0,
		left: 0,
		borderRadius: "100%",
		marginTop: "4%",
		marginLeft: "4%",
	},
	buttonAdd: {
		background: "transparent",
		border: "none",
		width: "3%",
		aspectRatio: "1",
		position: "absolute" as const,
		top: 0,
		right: 0,
		borderRadius: "100%",
		marginTop: "3%",
		marginRight: "4%",
		cursor: "pointer",
	},

	popUpAddContainer: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		position: "absolute" as const,
		top: 0,
		right: 0,
		width: "100%",
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "2rem",
	},
	popUpAddCard: {
		width: "min(900px, 95vw)",
		backgroundColor: "#fff",
		borderRadius: "16px",
		padding: "1.25rem",
		position: "relative" as const,
		display: "flex",
		flexDirection: "column" as const,
		gap: "1rem",
	},
	buttonCloseAdd: {
		width: "40px",
		height: "40px",
		position: "absolute" as const,
		top: "12px",
		right: "12px",
		borderRadius: "100%",
		cursor: "pointer",
	},
	popUpAddTitle: {
		margin: 0,
		paddingRight: "52px",
	},
	chips: {
		display: "flex",
		flexWrap: "wrap" as const,
		gap: "0.5rem",
		minHeight: "42px",
		alignItems: "center",
	},
	chipsEmpty: {
		opacity: 0.7,
	},
	chip: {
		display: "flex",
		alignItems: "center",
		gap: "0.5rem",
		padding: "0.4rem 0.6rem",
		borderRadius: "999px",
		backgroundColor: "#f1f1f1",
	},
	chipText: {
		fontSize: "0.95rem",
	},
	chipRemove: {
		border: "none",
		background: "transparent",
		cursor: "pointer",
		fontSize: "1.1rem",
		lineHeight: 1,
	},
	selectRow: {
		display: "flex",
		gap: "0.75rem",
		alignItems: "center",
	},
	select: {
		flex: 1,
		padding: "0.6rem",
		borderRadius: "10px",
	},
	addOneBtn: {
		padding: "0.6rem 1rem",
		borderRadius: "10px",
		cursor: "pointer",
	},
	submitBtn: {
		padding: "0.8rem 1rem",
		borderRadius: "12px",
		cursor: "pointer",
		fontWeight: 700,
	},
	};

export default PopUpIconMemberMedia;