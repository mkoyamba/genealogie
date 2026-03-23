import { useState } from "react";
import { UserDataBasic } from "../Types";
import logo_plus from '../assets/logo_plus.png'

type Props = {
  dataBasicMembers: UserDataBasic[];
};

const apiURL = process.env.REACT_APP_AWS_API_URL

function FormEntryMember( {dataBasicMembers} : Props ) {

	const [newMemberSurname, setNewMemberSurname] = useState<string>("")

	const [newMemberName, setNewMemberName] = useState<string>("")

	const [newMemberDay, setNewMemberDay] = useState<number>(1)
	const dayArray = []
	for (let i = 1; i < 32; i++)
		dayArray.push(i)

	const [newMemberMonth, setNewMemberMonth] = useState<number>(1)
	const monthArray = []
	for (let i = 1; i < 13; i++)
		monthArray.push(i)

	const [newMemberYear, setNewMemberYear] = useState<number>(2000)
	const yearArray = []
	for (let i = 2026; i > 1849; i--)
		yearArray.push(i)
	const [newMemberGender, setNewMemberGender] = useState<"male" | "female" | "other">("other");
	const [newMemberMale, setNewMemberMale] = useState(false);
	const [newMemberFemale, setNewMemberFemale] = useState(false);
	const [newMemberOther, setNewMemberOther] = useState(false);

	const [newMemberParent1, setNewMemberParent1] = useState<number>(-1)
	const [newMemberParent2, setNewMemberParent2] = useState<number>(-1)

	const [newMemberCouple, setNewMemberCouple] = useState<number[]>([]);
	
	function setGender(gender: number) {
		if (gender === 0) {
			setNewMemberMale(true)
			setNewMemberFemale(false)
			setNewMemberOther(false)
			setNewMemberGender("male")
		}
		else if (gender === 1) {
			setNewMemberMale(false)
			setNewMemberFemale(true)
			setNewMemberOther(false)
			setNewMemberGender("female")
		}
		else {
			setNewMemberMale(false)
			setNewMemberFemale(false)
			setNewMemberOther(true)
			setNewMemberGender("other")
		}
	}

	function addSpouse() {
		setNewMemberCouple((prev) => [...prev, -1]);
	}

	function removeSpouse(index: number) {
		setNewMemberCouple((prev) => prev.filter((_, i) => i !== index));
	}

	function updateSpouse(index: number, spouseId: number) {
		setNewMemberCouple((prev) => prev.map((v, i) => (i === index ? spouseId : v)));
	}

	function checkGoodInfo () {
		if (newMemberSurname === "" || newMemberName === "")
			return true
		return false
	}

	async function handleSubmit(e: any) {
			e.preventDefault();

			if (checkGoodInfo()) {
				alert("Il manque des informations")
				return
			}
			
			const dateOfBirth = `${String(newMemberDay).padStart(2, "0")}-${String(newMemberMonth).padStart(2, "0")}-${newMemberYear}`;

			let lastID = -1
			dataBasicMembers.forEach((member) => {
				if (member.id > lastID)
					lastID = member.id
			})

			const memberToSave: UserDataBasic = {
				id: lastID + 1,
				surname: newMemberSurname,
				name: newMemberName,
				dateOfBirth,
				gender: newMemberGender,
				parent1: newMemberParent1,
				parent2: newMemberParent2,
				couple: newMemberCouple.filter((id) => id !== -1),
				prime: newMemberParent1 === -1 && newMemberParent2 === -1 && !newMemberCouple.filter((id) => id !== -1)[0] ? true : false,
				picture: ""
			}

			await send(memberToSave)
			memberToSave.couple.forEach(async( coupleId) => {
				let memberToUpdate: UserDataBasic = memberToSave;
				dataBasicMembers.forEach((member) => {
					if (member.id === coupleId)
						memberToUpdate = member
				})
				memberToUpdate.couple.push(memberToSave.id)
				await send(memberToUpdate)
			})
		window.location.reload();
	}

	async function send(member: UserDataBasic) {
		const memberToSend = {
			id: { "N" : String(member.id) },
			surname: { "S" : member.surname },
			name: { "S" : member.name },
			dateOfBirth: { "S" : member.dateOfBirth },
			gender: { "S" : member.gender },
			parent1: { "S" : member.parent1 !== -1 ? String(member.parent1) : ""},
			parent2: { "S" : member.parent2 !== -1 ? String(member.parent2) : ""},
			couple: { "NS" : [...member.couple.map(String), "-1"] },
			prime: { "BOOL" : member.prime },
			picture: { "S" : ""}
		}

		const effectResponse = await fetch(`${apiURL}/members`, {
			method: "PUT",
			mode: 'cors',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(memberToSend)
		}).catch(() => {
			throw Error("Fetch error")
		})
	}
	

	return (
		<div style={style.container}>
			<h2 style={style.title}>
				Ajouter un membre
			</h2>
			<form onSubmit={handleSubmit} style={style.form}>
				<input
					style={style.entry}
					type="text"
					placeholder="  Prénom"
					value={newMemberSurname}
					onChange={(e) => setNewMemberSurname(e.target.value)}
				/>


				<input
					style={style.entry}
					type="text"
					placeholder="  Nom"
					value={newMemberName}
					onChange={(e) => setNewMemberName(e.target.value)}
				/>

				
				<div style={style.dateOfBirth}>
					<div style={style.containerDay}>
						<span style={style.labelDoB}>Jour</span>
						<select style={style.dateSelect} value={newMemberDay} onChange={(e: any) => setNewMemberDay(Number(e.target.value))}>
							{dayArray.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
							
						))}
						</select>
						<div style={style.containerGender}>
							<span style={style.labelDoB}>
								Homme
								
							</span>
							<input
									type="checkbox"
									checked={newMemberMale}
									onChange={(e) => setGender(0)}
							/>
						</div>
					</div>
					<div style={style.containerMonth}>
						<span style={style.labelDoB}>Mois</span>
						<select style={style.dateSelect} value={newMemberMonth} onChange={(e: any) => setNewMemberMonth(Number(e.target.value))}>
							{monthArray.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
						</select>
						<div style={style.containerGender}>
							<span style={style.labelDoB}>
								Femme
							</span>
							<input
									type="checkbox"
									checked={newMemberFemale}
									onChange={(e) => setGender(1)}
							/>
						</div>
					</div>
					<div style={style.containerYear}>
						<span style={style.labelDoB}>Année</span>
						<select style={style.dateSelect} value={newMemberYear} onChange={(e: any) => setNewMemberYear(Number(e.target.value))}>
							{yearArray.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
						</select>
						<div style={style.containerGender}>
							<span style={style.labelDoB}>
								Autre
							</span>
							<input
									type="checkbox"
									checked={newMemberOther}
									onChange={(e) => setGender(2)}
							/>
						</div>
					</div>
				</div>
				<div style={style.parentContainer}>
					<span style={style.labelDoB} >Parents</span>
					<select style={style.select} value={newMemberParent1} onChange={(e: any) => setNewMemberParent1(e.target.value)}>
						<option key={-1} value={-1}>
								{"Inconnu"}
						</option>
						{dataBasicMembers.map((opt) => (
							<option key={opt.id} value={opt.id}>
								{newMemberParent1?`${opt.surname} ${opt.name}`:""}
							</option>
						))}
					</select>
					<select style={style.select} value={newMemberParent2} onChange={(e: any) => setNewMemberParent2(e.target.value)}>
						<option key={-1} value={-1}>
								{"Inconnu"}
						</option>
						{dataBasicMembers.map((opt) => (
							<option key={opt.id} value={opt.id}>
								{newMemberParent2?`${opt.surname} ${opt.name}`:""}
							</option>
						))}
					</select>
				</div>
				<div style={style.coupleContainer}>
					<div style={style.coupleHeaderMargin}></div>
					<div style={style.coupleHeader}>
						<span style={style.labelCoupleHeader}>Couple</span>
						<button type="button" onClick={addSpouse} style={style.plusBtn}>
							<img style={{width:'100%', height:'100%'}} src={logo_plus}/>
						</button>
					</div>

					{newMemberCouple.map((spouseId, index) => (
					<div key={index} style={style.coupleRow}>
						<select
							style={style.select}
							value={spouseId}
							onChange={(e: any) => updateSpouse(index, Number(e.target.value))}
						>
							<option value={-1}>{"Inconnu"}</option>

							{dataBasicMembers.map((opt) => (
							<option key={opt.id} value={opt.id}>
								{`${opt.surname} ${opt.name}`}
							</option>
							))}
						</select>
						<button
							type="button"
							onClick={() => removeSpouse(index)}
							style={style.removeBtn}
							aria-label="Supprimer conjoint"
						>
							✕
						</button>
					</div>
					))}
				</div>

				<button style={style.submitBtn} type="submit">Envoyer</button>
			</form>
		</div>
	);
}

const style = {
	allDiv: {
		display: "flex",
		flexDirection: 'column' as const,
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	},
	title: {
		marginBottom: '20px',
		color: "rgba(58, 47, 47, 1)",
		fontSize: "22px"
	},
	container: {
		width: "100%",
		height: "100%",
		background: "transparent",
		display: "flex",
		flexDirection: 'column' as const,
		justifyContent: "center",
		alignItems: 'center'
	},

	form: {
		display: "flex",
		width: "100%",
		flexDirection: "column" as const,
		backgroundColor: "rgba(247, 237, 237, 0.95)",
		border: "1px solid rgba(156, 138, 138, 0.25)",
		borderRadius: "20px",
		padding: "24px",
		boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
		gap: "14px",
		boxSizing: "border-box" as const
	},

	entry: {
		width: "100%",
		padding: "12px 14px",
		borderRadius: "12px",
		border: "1px solid rgba(156, 138, 138, 0.35)",
		backgroundColor: "rgba(255,255,255,0.75)",
		fontSize: "14px",
		outline: "none",
		boxSizing: "border-box" as const,
	},

	dateOfBirth: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "flex-start",
		gap: "7%",
		paddingTop: "4px",
		paddingBottom: "4px",
	},

	labelDoB: {
		fontSize: "14px",
		fontWeight: 600,
		letterSpacing: "0.3px",
		color: "rgba(58, 47, 47, 0.95)",
		marginBottom: "8px",
	},

	containerDay: {
		flex: 1,
		minWidth: "0",
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
	},

	containerMonth: {
		flex: 1,
		minWidth: "0",
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
	},

	containerYear: {
		flex: 1,
		minWidth: "0",
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
	},

	containerGender: {
		marginTop: "10px",
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
	},

	parentContainer: {
		display: "flex",
		flexDirection: "column" as const,
		gap: "10px",
		padding: "16px",
		borderRadius: "16px",
		backgroundColor: "rgba(156, 138, 138, 0.10)",
		border: "1px solid rgba(156, 138, 138, 0.18)",
	},

	coupleContainer: {
		display: "flex",
		height: '15vh',
		flexDirection: "column" as const,
		alignItems: 'flex-start',
		paddingLeft: "16px",
		borderRadius: "16px",
		backgroundColor: "rgba(156, 138, 138, 0.10)",
		border: "1px solid rgba(156, 138, 138, 0.18)",
		overflowY: 'auto' as const
	},

	coupleHeader: {
		width: "100%",
		minHeight: '5vh',
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		position: "sticky" as const,
		top: 0,
		zIndex: 1,
		backgroundColor: "rgb(238, 227, 227)"
	},
	labelCoupleHeader: {
		fontSize: "14px",
		fontWeight: 600,
		letterSpacing: "0.3px",
		color: "rgba(58, 47, 47, 0.95)"
	},
	coupleRow: {
		marginTop: '0.7vh',
		width: "100%",
		display: "flex",
		alignItems: "center",
		gap: "10px",
	},

	plusBtn: {
		width: "1.5vw",
		aspectRatio: 1,
		borderRadius: "999px",
		border: "none",
		background: "transparent",
		cursor: "pointer",
	},

	removeBtn: {
		width: "34px",
		minWidth: "34px",
		height: "34px",
		borderRadius: "999px",
		border: "none",
		background: "transparent",
		color: "rgba(120, 70, 70, 0.95)",
		fontSize: "16px",
		fontWeight: 700,
		cursor: "pointer",
		flexShrink: 0,
	},

	dateSelect: {
		padding: "10% 12%",
		borderRadius: "12px",
		border: "1px solid rgba(156, 138, 138, 0.35)",
		backgroundColor: "rgba(255,255,255,0.75)",
		fontSize: "14px",
		outline: "none",
		boxSizing: "border-box" as const,
	},

	select: {
		width: "100%",
		padding: "12px 14px",
		borderRadius: "12px",
		border: "1px solid rgba(156, 138, 138, 0.35)",
		backgroundColor: "rgba(255,255,255,0.75)",
		fontSize: "12px",
		outline: "none",
		boxSizing: "border-box" as const,
	},
	submitBtn: {
		marginTop: "8px",
		padding: "12px 16px",
		borderRadius: "14px",
		border: "none",
		backgroundColor: "rgba(156, 138, 138, 0.9)",
		color: "rgba(255, 255, 255, 0.75)",
		fontSize: "15px",
		fontWeight: 600,
		letterSpacing: "0.3px",
		cursor: "pointer",
		boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
	},
	coupleHeaderMargin: {
		height: '2vh'
	}
};

export default FormEntryMember;