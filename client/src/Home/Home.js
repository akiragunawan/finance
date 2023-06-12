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
	var dts = [];
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

	const getbep = async () => {
		
		await fetch(
			process.env.REACT_APP_LINK_API_SERVER +
				"/api/get/bep?year=2023&month=4",
			{
				method: "GET",
				// mode: "cors",
				// cache: "no-cache",
				// credentials: "same-origin",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Accept": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "*",
					"Access-Control-Allow-Credentials": "true",
					// "Authorization":
					// 	"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3YxL2F1dGgvbG9naW4iLCJpYXQiOjE2ODUwMDgxMjMsImV4cCI6MTY4NTA5NDUyMywibmJmIjoxNjg1MDA4MTIzLCJqdGkiOiJmUncwNnJSVDA5a0hXU0VQIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.Ee_vG_iep7dwipDpQgXKCnbQ9Ok7PZHPqRfOPcWoRI4",
					// // "Content-Type": "application/json",
				},
				// redirect: "follow",
				// referrerPolicy: "no-referrer",
				// body: new URLSearchParams(data),
			}
		).then((response) => {
			response
				.json()
				.then((data) => {
					console.log(data)
					for (let i = 0; i < data[0].length; i++) {
						if (data[0][i].Data.profit.interest_income < 0) {
							console.log(
								data[0][i].Nama_Cabang,
								data[0][i].Data.profit.interest_income
							);
							dts.push(
								data[0][i].Nama_Cabang,
								data[0][i].Data.profit.interest_income
							);
						}
					}
					console.log(dts);
					// var decode = jwtDecode(data.access_token);
					// var exp_date = new Date(decode.exp *1000);
				})
				.catch((err) => {
					console.log(err);
				});
		});
	};

	return (
		<>
			<div>{}</div>
		</>
	);
}

export default Home;
