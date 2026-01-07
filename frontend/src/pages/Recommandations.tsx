import { useNavigate, useSearchParams } from "react-router-dom";
import ButtonHomepage from "../modules/buttonHomepage";
import { checkPassword } from "../modules/utils/checkPassword";
import { useEffect, useState } from "react";
import NoPage from "./Error404";
import Header from "../modules/header";
import Footer from "../modules/footer";

function Recommandations() {
	const [searchParams] = useSearchParams();
	const password = searchParams.get("id")
	const [check,setCheck] = useState<Boolean>(false)
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
				<Header password={password}/>
				<ButtonHomepage/>
				<h1>Recommandations</h1>
				<Footer password={password}/>
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

export default Recommandations;