import React, { useEffect, useState } from "react";
import axios from "axios";

function Pl() {
	const [data, setData] = useState([]);
	const d = new Date();

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

	useEffect(() => {
		const timeout = setTimeout(() => {
			// 👇️ redirects to an external URL
			if (
				!sessionStorage.getItem("_token") ||
				!sessionStorage.getItem("_sestoken")
			) {
				window.location.replace(
					"http://127.0.0.1:8000/oauth/authorize?client_id=98907a23-7b34-4bc0-8220-dc6bf0fbb104&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&response_type=code&scope=&state=" +
						generateString(40)
				);
			}else{
				axios({
					method: "post",
					url: "http://127.0.0.1:8000/api/userToken",
					data: {
						access_token: sessionStorage.getItem('_sestoken'),
					},
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Headers": "*",
						"Access-Control-Allow-Credentials": "true",
						"Content-Type": "application/json",
						"Authorization": "Bearer " + sessionStorage.getItem('_sestoken'),
					},
				})
					.then(function (b) {
						console.log(b.data);
						if(b.data){
							sessionStorage.setItem('_token',b.data.token);
							
						}else{
							sessionStorage.removeItem('_token');
							sessionStorage.removeItem('_sestoken');
							window.location.replace(
								"http://127.0.0.1:3000/");
						}
						
					})
					.catch(function (c) {
						console.log(c);
						sessionStorage.removeItem("_token");
						sessionStorage.removeItem("_sestoken");
						window.location.replace("http://127.0.0.1:3000/");
					});
			}
		});

		return () => clearTimeout(timeout);
	}, []);
	useEffect(() => {
		axios
			.get("http://127.0.0.1:8001/api/get/pl?year=2023&month="+ d.getMonth(), {})
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
			<h2 className="fw-bold text-uppercase ">Profit And Loss</h2>
			<div className="mt-5">
				<div className="card shadow p-3 mb-5 bg-body rounded d-flex flex-row">
					{data.map((subitem) => (
						<div className="d-flex flex-row">
							<div>
								{subitem.map((item) => (
									<div
										key={item.COA_num}
										className="card p-3 m-3 shadow p-3  bg-body rounded"
									>
										<div className="d-flex justify-content-between card-title mt-3 ms-4 me-4">
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
												<p className="text-muted">{item.COA_date}</p>
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

export default Pl;
