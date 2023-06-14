import axios from "axios";
import React, { useState, useEffect } from "react";

const characters =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length) {
	let result = " ";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}

function Home() {
	const linksso = process.env.REACT_APP_LINK_API_SSO;
	const linkserver = process.env.REACT_APP_LINK_API_SERVER;
	const linkclientper = process.env.REACT_APP_LINK_CLIENT_PER;
	const linkclient = process.env.REACT_APP_LINK_CLIENT;

	const [MinusProfit, setMinusProfit] = useState([]);
	var arr = [];
	const [Dts, setDts] = useState([]);
	// var dts = [];
	// useEffect(() => {
	// 	const timeout = setTimeout(() => {
	// 		// 👇️ redirects to an external URL
	// 		if (
	// 			!sessionStorage.getItem("_token") ||
	// 			!sessionStorage.getItem("_sestoken")
	// 		) {
	// 			window.location.replace(
	// 				`${process.env.REACT_APP_LINK_API_SSO}/oauth/authorize?client_id=98907a23-7b34-4bc0-8220-dc6bf0fbb104&redirect_uri=${process.env.REACT_APP_LINK_CLIENT_PER}/callback&response_type=code&scope=&state=${generateString(40)}`
	// 			);
	// 		}
	// 	});

	// 	return () => clearTimeout(timeout);
	// }, []);

	useEffect(() => {
		getbep();
	}, []);
	var ddd = [];
	const getbep = async () => {
		await axios
			.get(
				process.env.REACT_APP_LINK_API_SERVER + "/api/get/bep?year=2023&month=4"
			)
			.then((response) => {
				for (var i = 0; i < response.data[0].length; i++) {
					if (response.data[0][i].Data.profit.interest_income < 0) {
						// console.log(response.data[0][i]);
						 ddd = {
							Nama_Cabang: response.data[0][i].Nama_Cabang,
							Profit: response.data[0][i].Data.profit.interest_income,
						};
						console.log(ddd)
						// setDts([...Dts, ddd]);
						setDts(prevDTS => [...prevDTS, ddd]);
						
					}

					// console.log(response.data[0][i]);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};
	console.log(Dts);
	return (
		<>
			<div></div>
		</>
	);
}

export default Home;
