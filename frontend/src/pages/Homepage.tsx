import { prototype } from "events";
import { useEffect, useState } from "react";

function Homepage() {
	const apiURL = "https://054nhdh1yj.execute-api.eu-west-3.amazonaws.com/dev"

	const [response, setResponse] = useState("")


	useEffect(() => {
		async function getMembers() {
			const effectResponse = await fetch(`${apiURL}/members`, {
				method: "GET",
				mode: 'cors'
			}).catch(() => {
				setResponse("lol")
			})
			const data = await effectResponse?.json()
			setResponse(JSON.stringify(data))
		}
		if (!response)
			getMembers()
	})
	console.log(response)


  return (
	<div></div>
  );
}

const style = {
}

export default Homepage;