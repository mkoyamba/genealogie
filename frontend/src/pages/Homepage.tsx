import { useEffect, useState } from "react";
import { UserDataBasic } from "../Types";
import Footer from "../modules/footer"
import Header from "../modules/header"
import Canva from "../modules/canva";
import FormEntryMember from "../modules/formEntryMember";
import { useSearchParams } from "react-router-dom";
import { checkPassword } from "../modules/utils/checkPassword";
import NoPage from "./Error404";
import PopUpCardMember from "../modules/components/popUpCardMember";

export function firstCapsName(input : string) {
	if (!input) return "";

	const lower = input.toLowerCase();
	return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function Homepage() {
	const apiURL = process.env.REACT_APP_AWS_API_URL

	const [searchParams] = useSearchParams();
	const [memberSelect, setMemberSelect] = useState<number>(-1)
	const [popUp, setPopUp] = useState<boolean>(false)

	const password = searchParams.get("id")
	const [check,setCheck] = useState<Boolean>(false)
	useEffect(() => {
		async function checker() {
			const response = await checkPassword(password)
			setCheck(response)
		}
		checker()
	})

	const [dataBasicMembers, setDataBasicMembers] = useState<UserDataBasic[]>([])
	const [dictMembers, setDictMembers] = useState<Map<number, UserDataBasic>>(new Map)


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
					surname: decodeURIComponent(firstCapsName(member["surname"]["S"])),
					name: decodeURIComponent(firstCapsName(member["name"]["S"])),
					dateOfBirth: member["dateOfBirth"]["S"],
					gender: member["gender"]["S"],
					couple: [],
					parent1: parseInt(member["parent1"]["S"]),
					parent2: parseInt(member["parent2"]["S"]),
					prime: member["prime"]["BOOL"],
					picture: member["picture"]["S"]
				}
				const coupleRaw = member["couple"]["NS"]
				coupleRaw.forEach((id: string) => {
					if (id !== "-1")
						dataMember.couple.push(parseInt(id))
				})
				dataBasicMembersTemp.push(dataMember)
			})
			
			function makeCouplesReciprocal(members: UserDataBasic[]): UserDataBasic[] {
				const byId = new Map<number, UserDataBasic>();
				
				for (const member of members) {
					byId.set(member.id, {
					...member,
					couple: Array.from(new Set(member.couple)),
					});
				}

				Array.from(byId.values()).forEach((member) => {
					for (const partnerId of member.couple) {
						const partner = byId.get(partnerId);
						if (!partner) continue;

						if (!partner.couple.includes(member.id)) {
							partner.couple.push(member.id);
						}
					}
				})
				
				return Array.from(byId.values()).map((member) => ({
					...member,
					couple: Array.from(new Set(member.couple)),
				}));
			}

			dataBasicMembersTemp = makeCouplesReciprocal(dataBasicMembersTemp)

			dataBasicMembersTemp.sort((a,b) => a.id > b.id ? 1 : -1)

			const dictMembersTemp = new Map
			dataBasicMembersTemp.forEach((member : UserDataBasic) => {
					dictMembersTemp.set(member.id, member)
			})

			setDictMembers(dictMembersTemp)
			setDataBasicMembers(dataBasicMembersTemp)
		}
		getMembers() //TODO
	}, [])
	

	return (
		<div style={style.background}>
			{check && <div style={style.background}>
				<Header password={password} dataBasicMembers={dataBasicMembers} dictMembers={dictMembers}/>
				<div style={style.content}>
					<div style={style.formAddContainer}>
						<FormEntryMember dataBasicMembers={dataBasicMembers}/>
					</div>
					<div style={style.canva}><Canva dataBasicMembers={dataBasicMembers} functionClose={setPopUp} memberSelect={setMemberSelect}/></div>
				</div>
				<div style={style.footer}><Footer password={password} dataBasicMembers={dataBasicMembers} dictMembers={dictMembers}/></div>
				{popUp && <PopUpCardMember dictMembers={dictMembers} memberId={memberSelect} functionClose={setPopUp}/>}
			</div>}
			{!check && <NoPage/>}
		</div>
	)
}

const style = {
	background: {
		width: "100vw",
		height: "100vh",
		backgroundColor: "rgb(247, 237, 237)"
	},
	footer: {
		width: "100vw",
		height: "5vh",
	},
	content: {
		width: "100vw",
		height: "85vh",
		display: "flex"
	},
	canva: {
		width: "100%",
		height: "83vh",
		backgroundColor: "white",
		margin: "1vh",
		borderRadius: "10px"
	},
	formAddContainer: {
		background: "transparent",
		width: "15vw",
		height: "83vh",
		margin: "1vh",
		borderRadius: "10px",
		padding: "1vh"
	}
}

export default Homepage;