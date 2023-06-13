import React, { useEffect, useState } from "react";
import axios from "axios";
import "../BEP/Bep.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Bep() {
	const [dataCabang, setDataCabang] = useState([]);
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState(new Date());
	const [branch, setBranch] = useState([]);
	const d = new Date();
	const [profit, setProfit] = useState(null);
	const [error, setError] = useState(0);
	const [url_search, setUrl_search] = useState();
	//////////////////////////////////////////////////////////
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
				// console.log(`${process.env.REACT_APP_LINK_API_SSO}/oauth/authorize?client_id=98907a23-7b34-4bc0-8220-dc6bf0fbb104&redirect_uri=${process.env.REACT_APP_LINK_CLIENT_PER}2Fcallback&response_type=code&scope=&state=${generateString(40)}`)
				window.location.replace(
					`${
						process.env.REACT_APP_LINK_API_SSO
					}/oauth/authorize?client_id=98907a23-7b34-4bc0-8220-dc6bf0fbb104&redirect_uri=${
						process.env.REACT_APP_LINK_CLIENT_PER
					}/callback&response_type=code&scope=&state=${generateString(40)}`
				);
			} else {
				axios({
					method: "post",
					url: process.env.REACT_APP_LINK_API_SSO + "/api/userToken",
					data: {
						access_token: sessionStorage.getItem("_sestoken"),
					},
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Headers": "*",
						"Access-Control-Allow-Credentials": "true",
						"Content-Type": "application/json",
						Authorization: "Bearer " + sessionStorage.getItem("_sestoken"),
					},
				})
					.then(function (b) {
						console.log(b.data);
						if (b.data) {
							sessionStorage.setItem("_token", b.data.token);
						} else {
							sessionStorage.removeItem("_token");
							sessionStorage.removeItem("_sestoken");
							window.location.replace(process.env.REACT_APP_LINK_CLIENT + "/");
						}
					})
					.catch(function (c) {
						console.log(c);
						sessionStorage.removeItem("_token");
						sessionStorage.removeItem("_sestoken");
						window.location.replace(process.env.REACT_APP_LINK_CLIENT + "/");
					});
			}
		});

		return () => clearTimeout(timeout);
	}, []);
	///////////////////////////////////////////////////////

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		await axios
			.get(process.env.REACT_APP_LINK_API_SERVER + "/api/get/bep")
			.then((response) => {
				console.log("wah", response.data);

				setDataCabang(...dataCabang, response.data);

				if (!response.data) {
					window.location.reload(false);
				} else {
					setLoading(false);
				}
			})
			.catch((error) => {
				console.log(error);
				setLoading(true);
			});
	};

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_LINK_API_SERVER + "/api/get/branch", {})
			.then((response) => {
				// setBranch(response.data);
				setLoading(false);
				console.log(response.data);

				var filtered = response.data.filter(function (value, index, arr) {
					// console.log(value)
					return value > 15;
				});
				console.log(filtered);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	}, []);

	// useEffect(() => {
	const get_bep_final = () => {
		// console.log(url_search);
		if (url_search !== undefined) {
			if (startDate.getMonth() + 1 === d.getMonth() + 1) {
				if (isLastDate(d) === true) {
					setError(0);
					axios
						.get(url_search)
						.then((response) => {
							if (response.data != null) {
								setDataCabang(response.data);
							}
							setLoading(false);
							console.log(response);
						})
						.catch((error) => {
							console.log(error);
							setLoading(false);
						});
				} else {
					setError(1);
				}
			} else {
				setError(0);
				axios
					.get(url_search)
					.then((response) => {
						if (response.data != null) {
							setDataCabang(response.data);
						}
						setLoading(false);
						console.log(response);

						// setDataBalance(response.data.Data);
						// console.log(dataBalance);
					})
					.catch((error) => {
						console.log(error);
						setLoading(false);
					});
			}
		}
	};
	// }, []);

	if (loading) {
		return (
			<div className="position-absolute top-50 start-50 translate-middle">
				<div
					className="spinner-grow text-secondary"
					style={{ width: "5rem", height: "5em" }}
					role="status"
				>
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}
	const isLastDate = (date) => {
		const nextDay = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate() + 1
		);
		return nextDay.getMonth() !== date.getMonth();
	};

	//onsearch click
	const handleSubmit = (event) => {
		console.log(startDate);
		event.preventDefault();
		if (
			profit === null
			// && ftp == null
		) {
			console.log("non");
			if (startDate.getMonth() + 1 === d.getMonth() + 1) {
				setError(1);
			} else {
				setError(0);
				setUrl_search(
					process.env.REACT_APP_LINK_API_SERVER +
						"/api/get/bep?month=" +
						(startDate.getMonth() + 1) +
						"&year=" +
						startDate.getFullYear()
				);
				get_bep_final();
			}
		} else {
			console.log("parameter");
			if (startDate.getMonth() + 1 === d.getMonth() + 1) {
				setError(1);
			} else {
				setError(0);
				setUrl_search(
					process.env.REACT_APP_LINK_API_SERVER +
						"/api/get/bep?month=" +
						(startDate.getMonth() + 1) +
						"&year=" +
						startDate.getFullYear() +
						"&profit=" +
						profit
					// "&ftp=" +
					// ftp
				);
				get_bep_final();
			}
		}
	};
	dataCabang.length > 0 && console.log("wahset", dataCabang);
	if (error === 1) {
		return (
			<div className="container">
				<h4 className="fw-bold">BEP ANALISYS</h4>
				<div className="d-flex flex-column">
					<label htmlFor="monthPicker">Search Data By Month</label>
					<DatePicker
						className="w-100 mb-2 form-control"
						selected={startDate}
						onChange={(date) => setStartDate(date)}
						dateFormat="MM/yyyy"
						showMonthYearPicker
						showIcon
					/>

					{/* <input
						className="form-control mb-2 shadow"
						placeholder="FTP Parameter"
						onChange={(event) => setFtp(event.target.value)}
						name="ftp"
						id="ftp"
					/> */}
					<input
						className="form-control mb-2 shadow"
						placeholder="Profit Parameter"
						onChange={(event) => setProfit(event.target.value)}
						name="profit"
						id="profit"
					/>
					<button onClick={handleSubmit} className="btn btn-secondary">
						Search
					</button>
				</div>
				<div>
					<h5 className="text-center mt-5 fw-bold text-uppercase text-danger">
						Data Not Found
					</h5>
				</div>
			</div>
		);
	} else if (error === 0) {
		return !dataCabang ? null : (
			<div className="mt-5">
				<div className="container">
					<h4 className="fw-bold">BEP ANALISYS</h4>

					<div
						className="nav nav-tabs mb-3 mt-3 p-2 d-flex bg-white container rounded-1 d-flex justify-content-center shadow"
						id="nav-tab"
						role="tablist"
					>
						<div className="d-flex flex-column text-center">
							<div className="fw-bold mb-3 text-decoration-underline">
								<h3>Branch</h3>
							</div>
							<div className="d-flex justify-content-center flex-wrap">
								{branch.map((item) => (
									<button
										className="nav-link text-dark p-3 text-dark fw-bold"
										id={"nav-" + item.branch_code + "-tab"}
										data-bs-toggle="tab"
										data-bs-target={"#nav-" + item.branch_code}
										type="button"
										role="tab"
										aria-controls={"nav-" + item.branch_code}
										aria-selected="false"
										key={item.branch_code}
									>
										{item.branch_name}
									</button>
								))}
							</div>
						</div>
					</div>
					<div className="d-flex flex-column">
						<label htmlFor="monthPicker">Search Data By Month</label>
						<DatePicker
							className="w-100 mb-2 form-control"
							selected={startDate}
							onChange={(date) => setStartDate(date)}
							dateFormat="MM/yyyy"
							showMonthYearPicker
							showIcon
						/>

						{/* <input
							className="form-control mb-2 shadow"
							placeholder="FTP Parameter"
							onChange={(event) => setFtp(event.target.value)}
							name="ftp"
							id="ftp"
						/> */}
						<input
							className="form-control mb-2 shadow"
							placeholder="Profit Parameter"
							onChange={(event) => setProfit(event.target.value)}
							name="profit"
							id="profit"
						/>
						<button onClick={handleSubmit} className="btn btn-secondary">
							Search
						</button>
					</div>
				</div>

				<div className="container">
					<div className="tab-content" id="nav-tabContent">
						{dataCabang.length > 0 &&
							branch.map((brn, key) => (
								<div
									className="tab-pane fade section-to-print"
									id={"nav-" + brn.branch_code}
									role="tabpanel"
									key={brn.branch_code}
									aria-labelledby={"nav-" + brn.branch_code + "-tab"}
								>
									<div className=" ">
										<div className="col">
											<div className="card mb-3 " style={{ width: "900px" }}>
												<div className="card-body p-4">
													<div className="row">
														<div className="col-6 text-start ">
															Rate BASE ON FINANCIAL REPORT 2023
														</div>
														<div className="col-6 text-end ">
															(In Million Rp)
														</div>
													</div>
													<div className="row">
														<div
															className="col-12 text-center fw-bold"
															style={{ fontSize: "30px" }}
														>
															EXISTING
														</div>
													</div>
													<div className="row bg-opacity-50 bg-warning rounded-2 text-dark fw-bolder">
														<div className="col-3 ">COA Name</div>
														<div className="col-3">Balance</div>
														<div className="col-3">Rate</div>
														<div className="col-3">Interest Income</div>
													</div>
													<div className="row">
														<div className="col-3">Loan</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.loan.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3">
															{!dataCabang
																? "null"
																: dataCabang[0][key].Data.loan.rate.toFixed(2)}
															%
														</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.loan.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row">
														<div className="col-3">Placement Inter Office</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][key].Data.pio.balance.toFixed(
																			2
																		)
																  )}
														</div>
														<div className="col-3">
															{!dataCabang
																? "null"
																: dataCabang[0][key].Data.pio.rate.toFixed(2)}
															%
														</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.pio.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.total.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.total.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row p-2"></div>
													<div className="row">
														<div className="col-3">Pendapatan Lainnya</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.other.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3 fw-bold">Total Income</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.total_income.interest_income.toFixed(
																			2
																		)
																  )}
														</div>
													</div>
													<div className="row p-2"></div>
													<div className="row bg-danger bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3 fw-bold">
															Third-Party Funds
														</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">Interest Cost</div>
													</div>
													<div className="row">
														<div className="col-3">DPK</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][key].Data.dpk.balance.toFixed(
																			2
																		)
																  )}
														</div>
														<div className="col-3">
															{!dataCabang
																? "null"
																: dataCabang[0][key].Data.dpk.rate.toFixed(2)}
															%
														</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.dpk.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row">
														<div className="col-3">Borrowing Inter Office</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][key].Data.bio.balance.toFixed(
																			2
																		)
																  )}
														</div>
														<div className="col-3">
															{!dataCabang
																? "null"
																: dataCabang[0][key].Data.bio.rate.toFixed(2)}
															%
														</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.bio.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.total_interest.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.total_interest.interest_income.toFixed(
																			2
																		)
																  )}
														</div>
													</div>
													<div className="row p-2"></div>
													<div className="row">
														<div className="col-3 bg-info bg-opacity-10 border border-info border-start-0 rounded fw-bold">
															NET INTEREST INCOME
														</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.net.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row p-2"></div>
													<div className="row">
														<div className="col-3 bg-danger bg-opacity-10 border border-info border-start-0 rounded fw-bold">
															Operational COST :
														</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3"></div>
													</div>
													<div className="row">
														<div className="col-3">1. Salary</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.salary.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold"></div>
													</div>
													<div className="row">
														<div className="col-3">
															2. Rental cost of building
														</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.rental.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold"></div>
													</div>
													<div className="row">
														<div className="col-3">3. Biaya CKPN</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.ckpn.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3">
															{!dataCabang
																? "null"
																: dataCabang[0][key].Data.ckpn.rate.toFixed(2)}
															%
														</div>
														<div className="col-3 fw-bold"></div>
													</div>
													<div className="row">
														<div className="col-3">4. Operational Expenses</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.operational.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold"></div>
													</div>
													<div className="row">
														<div className="col-3">5. Non Operational </div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.non_operational.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold"></div>
													</div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.total_op_cost.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.total_op_cost.interest_income.toFixed(
																			2
																		)
																  )}
														</div>
													</div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded mt-2">
														<div className="col-3 fw-bold">Total Cost</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.total_cost.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row p-2"></div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3 fw-bold">Profit and Loss</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[0][
																			key
																		].Data.profit.interest_income.toFixed(2)
																  )}
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="col">
											<div className="card mb-3 " style={{ width: "900px" }}>
												<div className="card-body p-4">
													<div className="row">
														<div className="col-6 text-start ">
															Scenario BASE ON FINANCIAL REPORT 2023
														</div>
														<div className="col-6 text-end ">
															(In Million Rp)
														</div>
													</div>
													<div className="row">
														<div
															className="col-12 text-center fw-bold"
															style={{ fontSize: "30px" }}
														>
															BEP / INCREASE PROFIT
														</div>
													</div>
													<div className="row bg-opacity-50 bg-success rounded-2 text-dark fw-bolder">
														<div className="col-3 ">COA Name</div>
														<div className="col-3">Balance</div>
														<div className="col-3">Rate</div>
														<div className="col-3">Interest Income</div>
													</div>
													<div className="row">
														<div className="col-3">Loan</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][key].Data.loan.balance
																  )}
														</div>
														<div className="col-3">
															{!dataCabang
																? "null"
																: dataCabang[1][key].Data.loan.rate.toFixed(2)}
															%
														</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.loan.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row">
														<div className="col-3">Placement Inter Office</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][key].Data.pio.balance.toFixed(
																			2
																		)
																  )}
														</div>
														<div className="col-3">
															{!dataCabang
																? "null"
																: dataCabang[1][key].Data.pio.rate.toFixed(2)}
															%
														</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.pio.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.total.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.total.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row p-2"></div>
													<div className="row">
														<div className="col-3">Pendapatan Lainnya</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.other.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3 fw-bold">Total Income</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.total_income.interest_income.toFixed(
																			2
																		)
																  )}
														</div>
													</div>
													<div className="row p-2"></div>
													<div className="row bg-danger bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3 fw-bold">
															Third-Party Funds
														</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">Interest Cost</div>
													</div>
													<div className="row">
														<div className="col-3">DPK</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][key].Data.dpk.balance.toFixed(
																			2
																		)
																  )}
														</div>
														<div className="col-3">
															{!dataCabang
																? "null"
																: dataCabang[1][key].Data.dpk.rate.toFixed(2)}
															%
														</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.dpk.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row">
														<div className="col-3">Borrowing Inter Office</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][key].Data.bio.balance.toFixed(
																			2
																		)
																  )}
														</div>
														<div className="col-3">
															{!dataCabang
																? "null"
																: dataCabang[1][key].Data.bio.rate.toFixed(2)}
															%
														</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.bio.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.total_interest.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.total_interest.interest_income.toFixed(
																			2
																		)
																  )}
														</div>
													</div>
													<div className="row p-2"></div>
													<div className="row">
														<div className="col-3 bg-info bg-opacity-10 border border-info border-start-0 rounded fw-bold">
															NET INTEREST INCOME
														</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.net.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row p-2"></div>
													<div className="row">
														<div className="col-3 bg-danger bg-opacity-10 border border-info border-start-0 rounded fw-bold">
															Operational COST :
														</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3"></div>
													</div>
													<div className="row">
														<div className="col-3">1. Salary</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.salary.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold"></div>
													</div>
													<div className="row">
														<div className="col-3">
															2. Rental cost of building
														</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.rental.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold"></div>
													</div>
													<div className="row">
														<div className="col-3">3. Biaya CKPN</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.ckpn.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3">
															{!dataCabang
																? "null"
																: dataCabang[1][key].Data.ckpn.rate.toFixed(2)}
															%
														</div>
														<div className="col-3 fw-bold"></div>
													</div>
													<div className="row">
														<div className="col-3">4. Operational Expenses</div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.operational.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold"></div>
													</div>
													<div className="row">
														<div className="col-3">5. Non Operational </div>
														<div className="col-3">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.non_operational.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold"></div>
													</div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.total_op_cost.balance.toFixed(2)
																  )}
														</div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.total_op_cost.interest_income.toFixed(
																			2
																		)
																  )}
														</div>
													</div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded mt-2">
														<div className="col-3 fw-bold">Total Cost</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.total_cost.interest_income.toFixed(2)
																  )}
														</div>
													</div>
													<div className="row p-2"></div>
													<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
														<div className="col-3 fw-bold">Profit and Loss</div>
														<div className="col-3"></div>
														<div className="col-3"></div>
														<div className="col-3 fw-bold">
															Rp.{" "}
															{!dataCabang
																? "null"
																: new Intl.NumberFormat().format(
																		dataCabang[1][
																			key
																		].Data.profit.interest_income.toFixed(2)
																  )}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		);
	}
}

export default Bep;
