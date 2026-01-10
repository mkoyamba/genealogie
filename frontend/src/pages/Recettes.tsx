import { useLocation, useSearchParams } from "react-router-dom";
import ButtonHomepage from "../modules/buttonHomepage";
import { checkPassword } from "../modules/utils/checkPassword";
import { useEffect, useState } from "react";
import NoPage from "./Error404";
import Header from "../modules/header";
import Footer from "../modules/footer";
import { UserDataBasic } from "../Types";

function Recettes() {
	const [searchParams] = useSearchParams();
	const password = searchParams.get("id")
	const [check,setCheck] = useState<Boolean>(false)

	const location = useLocation();
	const dataBasicMembers = location.state.dataBasicMembers
	const dictMembers : Map<number, UserDataBasic> = location.state.dictMembers
	
	useEffect(() => {
		async function checker() {
			const response = await checkPassword(password)
			setCheck(response)
		}
		checker()
	})

	return (
		<div style={style.background}>
			{check && <div style={style.background}>
				<Header password={password} dataBasicMembers={dataBasicMembers} dictMembers={dictMembers}/>
				<ButtonHomepage/>
				<h1>Recettes</h1>
				<Footer password={password} dataBasicMembers={dataBasicMembers} dictMembers={dictMembers}/>
			</div>}
			{!check && <NoPage/>}
		</div>
	)
};

const style = {
	background: {
		"width": "100vw",
		"height": "100vh",
		"backgroundColor": "pink"
	}
}

export default Recettes;