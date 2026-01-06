import { useEffect, useState } from "react";
import { UserDataBasic } from "../Types";
import Footer from "../modules/footer"
import Header from "../modules/header"
import Canva from "../modules/canva";
import FormEntryMember from "../modules/formEntryMember";

function Homepage() {
	const apiURL = "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/dev"

	const [dataBasicMembers, setDataBasicMembers] = useState<UserDataBasic[]>([])


	useEffect(() => {
		let n = false
		async function getMembers() {
			const effectResponse = await fetch(`${apiURL}/members`, {
				method: "GET",
				mode: 'cors'
			}).catch(() => {
				throw Error("Fetch error")
			})
			const raw_data = await effectResponse?.json()
			let dataBasicMembersTemp: UserDataBasic[] = [];

			raw_data.forEach((member: any) => {
				let dataMember: UserDataBasic = {
					id: parseInt(member["id"]["N"]),
					surname: member["surname"]["S"],
					name: member["name"]["S"],
					dateOfBirth: member["dateOfBirth"]["S"],
					gender: member["gender"]["S"],
					couple: [],
					parent1: parseInt(member["parent1"]["S"]),
					parent2: parseInt(member["parent2"]["S"]),
					prime: member["prime"]["BOOL"]
				}
				const coupleRaw = member["couple"]["NS"]
				coupleRaw.forEach((id: string) => {
					if (id !== "-1")
						dataMember.couple.push(parseInt(id))
				})
				dataBasicMembersTemp.push(dataMember)
			})
			setDataBasicMembers(dataBasicMembersTemp)
		}
		getMembers()
	}, [])

	console.log(dataBasicMembers)
	

	return (
		<div style={style.background}>
			<div style={style.header}><Header/></div>
			<div style={style.content}>
				<div style={style.formAddContainer}>
					<FormEntryMember dataBasicMembers={dataBasicMembers}/>
				</div>
				<div style={style.canva}><Canva dataBasicMembers={dataBasicMembers}/></div>
			</div>
			<div style={style.footer}><Footer/></div>
		</div>
	)
}

const style = {
	background: {
		"width": "100vw",
		"height": "100vh",
		"backgroundColor": "pink"
	},
	header: {
		"width": "100vw",
		"height": "10vh",
	},
	footer: {
		"width": "100vw",
		"height": "5vh",
	},
	content: {
		"width": "100vw",
		"height": "85vh",
		"display": "flex"
	},
	canva: {
		"width": "100%",
		"height": "83vh",
		"backgroundColor": "white",
		"margin": "1vh",
		"borderRadius": "10px"
	},
	formAddContainer: {
		"backgroundColor": "lightblue",
		"width": "15vw",
		"height": "81vh",
		"margin": "1vh",
		"borderRadius": "10px",
		padding: "1vh"
	}
}

export default Homepage;