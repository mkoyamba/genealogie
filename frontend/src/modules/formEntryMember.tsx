import { useState } from "react";
import { UserDataBasic } from "../Types";


function FormEntryMember() {

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
	const [newMemberGender, setnewMemberGender] = useState("");
	const [newMemberMale, setnewMemberMale] = useState(false);
	const [newMemberFemale, setnewMemberFemale] = useState(false);
	const [newMemberOther, setnewMemberOther] = useState(false);

	const [newMember, setNewMember] = useState<UserDataBasic>({
		id: -1,
		surname: "",
		name: "",
		dateOfBirth: "",
		gender: "other",
		couple: [],
		parent1: -1,
		parent2: -1,
		prime: true
	})



	function handleSubmit(e: any) {
		e.preventDefault();
		alert("Valeur saisie : " + newMemberSurname);
	}

	function setGender(gender: number) {
		if (gender === 0) {
			setnewMemberMale(true)
			setnewMemberFemale(false)
			setnewMemberOther(false)
		}
		else if (gender === 1) {
			setnewMemberMale(false)
			setnewMemberFemale(true)
			setnewMemberOther(false)
		}
		else {
			setnewMemberMale(false)
			setnewMemberFemale(false)
			setnewMemberOther(true)
		}
	}

	return (
		<div style={style.container}>
			<form onSubmit={handleSubmit} style={style.form}>
				<input
					type="text"
					placeholder="Prénom"
					value={newMemberSurname}
					onChange={(e) => setNewMemberSurname(e.target.value)}
				/>


				<input
					type="text"
					placeholder="Nom"
					value={newMemberName}
					onChange={(e) => setNewMemberName(e.target.value)}
				/>

				
				<div style={style.dateOfBirth}>
					<div style={style.containerDay}>
						<text style={style.labelDoB}>Jour</text>
						<select value={newMemberDay} onChange={(e: any) => setNewMemberDay(e.target.value)}>
							{dayArray.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
							
						))}
						</select>
					</div>
					<div style={style.containerMonth}>
						<text style={style.labelDoB}>Mois</text>
						<select value={newMemberMonth} onChange={(e: any) => setNewMemberMonth(e.target.value)}>
							{monthArray.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
						</select>
					</div>
					<div style={style.containerYear}>
						<text style={style.labelDoB}>Année</text>
						<select value={newMemberYear} onChange={(e: any) => setNewMemberYear(e.target.value)}>
							{yearArray.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
						</select>
					</div>
				</div>


				<div style={style.dateOfBirth}>
					<div style={style.containerDay}>
						<label style={style.labelDoB}>
							Homme
							<input
								type="checkbox"
								checked={newMemberMale}
								onChange={(e) => setGender(0)}
							/>
						</label>
					</div>
					<div style={style.containerMonth}>
						<label style={style.labelDoB}>
							Femme
							<input
								type="checkbox"
								checked={newMemberFemale}
								onChange={(e) => setGender(1)}
							/>
						</label>
					</div>
					<div style={style.containerYear}>

						<label style={style.labelDoB}>
							Autre
							<input
								type="checkbox"
								checked={newMemberOther}
								onChange={(e) => setGender(2)}
							/>
						</label>
					</div>
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
		backgroundColor: "grey"
	},
	form: {
		display: "flex",
		width: "100%",
		flexDirection: "column" as const,
	},
	dateOfBirth: {
		width: "100%",
		display: "flex",
		justifyContent: "center"
	},
	labelDoB: {
		justifyContent: "center"
	},
	containerDay: {
		marginLeft: "5%",
		marginRight: "5%",
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		flexDirection: "column" as const
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
	}
}

export default FormEntryMember;