import { useEffect, useState } from "react";
import { UserDataBasic } from "../Types";

type Props = {
  dataBasicMembers: UserDataBasic[];
};

const apiURL = "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/dev"

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
				prime: newMemberParent1 === -1 && newMemberParent2 === -1 && !newMemberCouple.filter((id) => id !== -1)[0] ? true : false
			}

			console.log(memberToSave)

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
			parent2: { "S" : member.parent1 !== -1 ? String(member.parent2) : ""},
			couple: { "NS" : [...member.couple.map(String), "-1"] },
			prime: { "BOOL" : member.prime }
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
						<label style={style.labelDoB}>Jour</label>
						<select style={style.dateSelect} value={newMemberDay} onChange={(e: any) => setNewMemberDay(e.target.value)}>
							{dayArray.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
							
						))}
						</select>
						<div style={style.containerGender}>
						<label style={style.labelDoB}>
							Homme
							
						</label>
						<input
								type="checkbox"
								checked={newMemberMale}
								onChange={(e) => setGender(0)}
						/>
					</div>
					</div>
					<div style={style.containerMonth}>
						<label style={style.labelDoB}>Mois</label>
						<select style={style.dateSelect} value={newMemberMonth} onChange={(e: any) => setNewMemberMonth(e.target.value)}>
							{monthArray.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
						</select>
						<div style={style.containerGender}>
							<label style={style.labelDoB}>
								Femme
							</label>
							<input
									type="checkbox"
									checked={newMemberFemale}
									onChange={(e) => setGender(1)}
							/>
						</div>
					</div>
					<div style={style.containerYear}>
						<label style={style.labelDoB}>Année</label>
						<select style={style.dateSelect} value={newMemberYear} onChange={(e: any) => setNewMemberYear(e.target.value)}>
							{yearArray.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
						</select>
						<div style={style.containerGender}>
							<label style={style.labelDoB}>
								Autre
							</label>
							<input
									type="checkbox"
									checked={newMemberOther}
									onChange={(e) => setGender(2)}
							/>
						</div>
					</div>
				</div>
				<div style={style.parentContainer}>
					<label style={style.labelDoB} >Parents</label>
					<select value={newMemberParent1} onChange={(e: any) => setNewMemberParent1(e.target.value)}>
						<option key={-1} value={-1}>
								{"Inconnu"}
						</option>
						{dataBasicMembers.map((opt) => (
							<option key={opt.id} value={opt.id}>
								{newMemberParent1?`${opt.surname} ${opt.name} né le ${opt.dateOfBirth}`:""}
							</option>
						))}
					</select>
					<select value={newMemberParent2} onChange={(e: any) => setNewMemberParent2(e.target.value)}>
						<option key={-1} value={-1}>
								{"Inconnu"}
						</option>
						{dataBasicMembers.map((opt) => (
							<option key={opt.id} value={opt.id}>
								{`${opt.surname} ${opt.name} né le ${opt.dateOfBirth}`}
							</option>
						))}
					</select>
				</div>
				<div style={style.coupleContainer}>
					<div style={style.coupleHeader}>
						<label style={style.labelDoB}>Couple</label>

						<button type="button" onClick={addSpouse} style={style.plusBtn}>
						+
						</button>
					</div>

					{newMemberCouple.map((spouseId, index) => (
					<div key={index} style={style.coupleRow}>
						<select
							value={spouseId}
							onChange={(e: any) => updateSpouse(index, Number(e.target.value))}
						>
							<option value={-1}>{"Inconnu"}</option>

							{dataBasicMembers.map((opt) => (
							<option key={opt.id} value={opt.id}>
								{`${opt.surname} ${opt.name} né le ${opt.dateOfBirth}`}
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

				<button type="submit">Envoyer</button>
			</form>
		</div>
	);
}

const style = {
	container: {
		width: "100%",
		height: "100%",
		background: "transparent"
	},
	form: {
		display: "flex",
		width: "100%",
		flexDirection: "column" as const,
	},
	entry: {
		marginTop: "1vh",
		marginBottom: "1vh",
		borderRadius: "1vh"
	},
	dateOfBirth: {
		width: "100%",
		display: "flex",
		justifyContent: "center",
		paddingTop: "1vh",
		paddingBottom: "1vh"
	},
	labelDoB: {
		justifyContent: "center",
		paddingTop: "1vh",
		paddingBottom: "1vh"
	},
	containerDay: {
		marginLeft: "5%",
		marginRight: "5%",
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		flexDirection: "column" as const,
	},
	containerMonth: {
		marginLeft: "5%",
		marginRight: "5%",
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		flexDirection: "column" as const
	},
	containerYear: {
		marginLeft: "5%",
		marginRight: "5%",
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		flexDirection: "column" as const
	},
	containerGender: {
		marginLeft: "5%",
		marginRight: "5%",
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		flexDirection: "column" as const
	},
	parentContainer: {
		marginLeft: "5%",
		marginRight: "5%",
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		flexDirection: "column" as const,
		paddingTop: "1vh",
		paddingBottom: "1vh"
	},
	coupleContainer: {
		marginLeft: "5%",
		marginRight: "5%",
		marginTop: 10,
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		flexDirection: "column" as const,
		gap: 8,
		paddingTop: "1vh",
		paddingBottom: "1vh"
	},
	coupleHeader: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between"
	},
	coupleRow: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: 8
	},
	plusBtn: {
		width: "2vw",
		aspectRatio: "1/1",
		borderRadius: "100%",
		border: "1px solid #333",
		cursor: "pointer",
	},
	removeBtn: {
		width: "2vw",
		aspectRatio: "1/1",
		borderRadius: "100%",
		border: "1px solid #333",
		cursor: "pointer",
	},
	dateSelect: {
		marginBottom: "3vh"
	}
}

export default FormEntryMember;