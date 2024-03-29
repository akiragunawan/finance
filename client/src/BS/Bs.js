import React, { useEffect, useState } from "react";
import axios from "axios";

function Bs() {
	const [data, setData] = useState([]);
	const d = new Date();
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	const linksso = process.env.REACT_APP_LINK_API_SSO;
	const linkserver = process.env.REACT_APP_LINK_API_SERVER;
	const linkclientper = process.env.REACT_APP_LINK_CLIENT_PER;
	const linkclient = process.env.REACT_APP_LINK_CLIENT;

	function generateString(length) {
		let result = " ";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			// 👇️ redirects to an external URL
			if (
				!sessionStorage.getItem("_token") ||
				!sessionStorage.getItem("_sestoken")
			) {

				window.location.replace(
					`${process.env.REACT_APP_LINK_API_SSO}/oauth/authorize?client_id=98907a23-7b34-4bc0-8220-dc6bf0fbb104&redirect_uri=${process.env.REACT_APP_LINK_CLIENT_PER}/callback&response_type=code&scope=&state=${generateString(40)}`
				);
			} else {
				axios({
					method: "post",
					url: process.env.REACT_APP_LINK_API_SSO+ "/api/userToken",
					data: {
						access_token: sessionStorage.getItem("_sestoken"),
					},
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Headers": "*",
						"Access-Control-Allow-Credentials": "true",
						"Content-Type": "application/json",
						"Authorization": "Bearer " + sessionStorage.getItem("_sestoken"),
					},
				})
					.then(function (b) {
						console.log(b.data);
						if (b.data) {
							sessionStorage.setItem("_token", b.data.token);
						} else {
							sessionStorage.removeItem("_token");
							sessionStorage.removeItem("_sestoken");
							window.location.replace(linkclient + "/");
						}
					})
					.catch(function (c) {
						console.log(c);
						sessionStorage.removeItem("_token");
						sessionStorage.removeItem("_sestoken");
						window.location.replace(linkclient + "/");
					});
			}
		});

		return () => clearTimeout(timeout);
	}, []);

	useEffect(() => {
		// axios
		// 	.get(linkserver+"/api/logged_in", {})
		// 	.then((response) => {
		// 		console.log(response);
		// 		if(response.data == null){
		// 			window.location.replace(
		// 				linkserver+""
		// 			);
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});
	}, []);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_LINK_API_SERVER+ "/api/get/bs?year=2023&month=" + d.getMonth(), {})
			.then((response) => {
				setData(response.data);
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);
	// console.log(data)
	return (
		<div className="container p-5">
			<h2 className="fw-bold text-uppercase ">Balance Sheet</h2>
			<div className="mt-5">
				<div className="card shadow  mb-2 bg-body rounded d-flex flex-row">
					{data.map((subitem) => (
						<div className="d-flex flex-row">
							<div>
								{subitem.map((item) => (
									<div
										key={item.COA_num}
										className="card p-3 m-3 shadow p-3  bg-body rounded"
									>
										<div className="d-flex justify-content-between card-title mt-3 mx-3">
											<div className="d-flex flex-column ">
												<div className="fw-bold" style={{ fontSize: "20px" }}>
													{item.COA_name}
												</div>
												<div
													className="text-muted"
													style={{ fontSize: "15px" }}
												>
													{item.COA_num}
												</div>
											</div>
											<div>
												<p className="text-muted text-break">{item.COA_date}</p>
											</div>
										</div>
										<div className="d-flex flex-wrap justify-content-start card-body">
											{item.Branches.map((branch) => (
												<div
													className="card p-2 m-2"
													style={{ width: "200px" }}
												>
													<div className="d-flex flex-column">
														<div
															className="fw-bold"
															style={{ fontSize: "15px" }}
														>
															{branch.branch_name}
														</div>
														<div className="" style={{ fontSize: "10px" }}>
															{branch.branch_code}
														</div>
													</div>
													<div style={{ fontSize: "20px" }}>
														Rp. {branch.value}
													</div>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Bs;
