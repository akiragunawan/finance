import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import XLSX from "xlsx";
// import { Renderer } from "xlsx-renderer";
import "./Custom.css";

// import { saveAs } from "file-saver";

function Custom() {
	const linksso = process.env.REACT_APP_LINK_API_SSO;
	const linkserver = process.env.REACT_APP_LINK_API_SERVER;
	const linkclientper = process.env.REACT_APP_LINK_CLIENT_PER;
	const linkclient = process.env.REACT_APP_LINK_CLIENT;

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
					`${process.env.REACT_APP_LINK_API_SSO}/oauth/authorize?client_id=98907a23-7b34-4bc0-8220-dc6bf0fbb104&redirect_uri=${process.env.REACT_APP_LINK_CLIENT_PER}2Fcallback&response_type=code&scope=&state=${generateString(40)}`
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
							window.location.replace(process.env.REACT_APP_LINK_CLIENT+ "/");
						}
					})
					.catch(function (c) {
						console.log(c);
						sessionStorage.removeItem("_token");
						sessionStorage.removeItem("_sestoken");
						window.location.replace(process.env.REACT_APP_LINK_CLIENT+ "/");
					});
			}
		});

		return () => clearTimeout(timeout);
	}, []);

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	const [startDate, setStartDate] = useState(new Date());
	const [branch, setBranch] = useState([]);
	const [selBranch, setSelBranch] = useState(0);
	const [lb, setLb] = useState("");
	const [lr, setLr] = useState("");
	const [piob, setPiob] = useState("");
	const [pior, setPior] = useState("");
	const [dpkb, setDpkb] = useState("");
	const [dpkr, setDpkr] = useState("");
	const [biob, setBiob] = useState("");
	const [bior, setBior] = useState("");
	const [ckpnr, setCkpnr] = useState("");
	const [profit, setProfit] = useState("");
	const [projection, setProjection] = useState("");

	// const [ilb, setiLb] = useState("");
	// const [ilr, setiLr] = useState("");
	// const [ipiob, setiPiob] = useState("");
	// const [ipior, setiPior] = useState("");
	// const [idpkb, setiDpkb] = useState("");
	// const [idpkr, setiDpkr] = useState("");
	// const [ibiob, setiBiob] = useState("");
	// const [ibior, setiBior] = useState("");
	// const [ickpnr, setiCkpnr] = useState("");

	let ilb = "";
	let ilr = "";
	let ipiob = "";
	let ipior = "";
	let idpkb = "";
	let idpkr = "";
	let ibiob = "";
	let ibior = "";
	let ickpnr = "";
	let iprofit = "";
	let iProjection = "";

	// const [showSce, setShowsce] = useState(true);
	const d = new Date();
	// const [error, setError] = useState(1);
	const [sceData, setScedata] = useState([]);

	const [elb, setElb] = useState(false);
	const [elr, setElr] = useState(false);
	const [ePiob, setEpiob] = useState(false);
	const [ePior, setEpior] = useState(false);
	const [eDpkb, setEdpkb] = useState(false);
	const [eDpkr, setEdpkr] = useState(false);
	const [eBiob, setEbiob] = useState(false);
	const [eBior, setEbior] = useState(false);
	const [eCkpnr, setEckpnr] = useState(false);
	const [eProfit, setEprofit] = useState(false);
	const [eProjection, setEprojection] = useState(false);

	// const
	const isLastDate = (date) => {
		const nextDay = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate() + 1
		);
		return nextDay.getMonth() !== date.getMonth();
	};

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_LINK_API_SERVER+ "/api/get/branch", {})
			.then((response) => {
				setBranch(response.data);
				// console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const setparameter = (e) => {
		// console.log(startDate,d)
		// console.log(startDate.getTime());
		// console.log(d.getTime());
		if (startDate.getTime() > d.getTime()) {
			alert(
				"Data hasnt Ready for " +
					(startDate.getMonth() + 1) +
					"-" +
					startDate.getFullYear()
			);
		} else {
			if (startDate.getMonth() + 1 === d.getMonth() + 1) {
				if (isLastDate(d) === true) {
					axios
						.get(
							process.env.REACT_APP_LINK_API_SERVER+
								"/api/get/bep?year=" +
								startDate.getFullYear() +
								"&month=" +
								(startDate.getMonth() + 1) +
								"&branch=" +
								selBranch,
							// e.target.value,
							{}
						)
						.then((response) => {
							console.log(response);
							setLb(response.data[0].Data.loan.balance);
							setLr(response.data[0].Data.loan.rate);
							setPiob(response.data[0].Data.pio.balance);
							setPior(response.data[0].Data.pio.rate);
							setDpkb(response.data[0].Data.dpk.balance);
							setDpkr(response.data[0].Data.dpk.rate);
							setBiob(response.data[0].Data.bio.balance);
							setBior(response.data[0].Data.bio.rate);
							setCkpnr(response.data[0].Data.ckpn.rate);
						})
						.catch((error) => {
							console.log(error);
						});
				} else {
					alert(
						"Data hasnt Ready for " +
							(startDate.getMonth() + 1) +
							"-" +
							startDate.getFullYear()
					);
				}
			} else {
				if (selBranch === 0) {
					alert("Please select the brach");
				} else {
					axios
						.get(
							process.env.REACT_APP_LINK_API_SERVER+
								"/api/get/bep?year=" +
								startDate.getFullYear() +
								"&month=" +
								(startDate.getMonth() + 1) +
								"&branch=" +
								selBranch,
							// e.target.value,
							{}
						)
						.then((response) => {
							console.log(response);
							setLb(response.data[0].Data.loan.balance);
							setLr(response.data[0].Data.loan.rate);
							setPiob(response.data[0].Data.pio.balance);
							setPior(response.data[0].Data.pio.rate);
							setDpkb(response.data[0].Data.dpk.balance);
							setDpkr(response.data[0].Data.dpk.rate);
							setBiob(response.data[0].Data.bio.balance);
							setBior(response.data[0].Data.bio.rate);
							setCkpnr(response.data[0].Data.ckpn.rate);
						})
						.catch((error) => {
							console.log(error);
						});
				}
			}
		}
	};

	const Calculate = (e) => {
		console.log(lb);
		console.log(ilb);

		if (elb) {
			// setiLb(lb);
			ilb = lb;
		}

		if (elr) {
			// setiLr(lr);
			ilr = lr;
		}
		if (ePiob) {
			// setiPiob(piob);
			ipiob = piob;
		}
		if (ePior) {
			// setiPior(pior);
			ipior = pior;
		}
		if (eDpkb) {
			// setiDpkb(dpkb);
			idpkb = dpkb;
		}
		if (eDpkr) {
			// setiDpkr(dpkr);
			idpkr = dpkr;
		}
		if (eBiob) {
			// setiBiob(biob);
			ibiob = biob;
		}
		if (eBior) {
			// setiBior(bior);
			ibior = bior;
		}
		if (eCkpnr) {
			// setiCkpnr(ckpnr);
			ickpnr = ckpnr;
		}
		if (eProfit) {
			iprofit = profit;
		}
		if (eProjection) {
			iProjection = projection;
		}

		if (selBranch === 0) {
			alert("Please Select Branch and date for Data Initiation First");
		} else if (lb === "" && elb) {
			alert("Loan Balance must bee fill");
		} else if (lr === "" && elr) {
			alert("Loan Rate must be fill");
		} else if (piob === "" && ePiob) {
			alert("Placement Inter Office Balance must be fill");
		} else if (pior === "" && ePior) {
			alert("Placement Inter Office Rate must be fill");
		} else if (dpkb === "" && eDpkb) {
			alert("DPK Balance must be fill");
		} else if (dpkr === "" && eDpkr) {
			alert("DPK Rate must be fill");
		} else if (biob === "" && eBiob) {
			alert("Borrowing Inter Office Balance must be fill");
		} else if (bior === "" && eBior) {
			alert("Borrwing Iner Office Rate must be fill");
		} else if (ckpnr === "" && eCkpnr) {
			alert("CKPN Rate must be fill");
		} else if (profit === "" && eProfit) {
			alert("Profit Must be fill");
		} else if (projection === "" && eProjection) {
			alert("Projection Month Must be fill");
		} else {
			axios
				.get(
					`${process.env.REACT_APP_LINK_API_SERVER}/api/get/scenario?year= 
						${startDate.getFullYear()} 
						&month= 
						${startDate.getMonth() + 1} 
						&loan_bal=
						${ilb}
						
						&loan_rate=
						${ilr}
						&pio_bal=
						${ipiob}
						&pio_rate=
						${ipior}
						&dpk_bal=
						${idpkb}
						&dpk_rate=
						${idpkr}
						&bio_bal=
						${ibiob} 
						&bio_rate=
						${ibior}
						&ckpn_rate=
						${ickpnr} 
						&branch=
						${selBranch}
						&profit=
						${iprofit}
						&projection_month=
						${iProjection}`,

					{}
				)
				.then((response) => {
					// setShowsce(!showSce);
					setScedata(response.data);
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	return (
		<div className="container mt-5">
			<div>
				<div>
					<div className="card">
						<div className="card-body">
							<h5 className="card-title">Search</h5>
							<label>Select Date of Data</label>
							<DatePicker
								className="w-100 mb-2 form-control"
								selected={startDate}
								onChange={(date) => setStartDate(date)}
								dateFormat="MM/yyyy"
								showMonthYearPicker
								showIcon
							/>
							<label>Branch</label>
							<select
								required
								className="w-100 form-select"
								value={selBranch}
								onChange={(e) => {
									setSelBranch(e.target.value);
								}}
							>
								<option value="0" disabled>
									.:: Branch ::.
								</option>
								{branch.map((item) => (
									<option value={item.branch_code} key={item.branch_code}>
										{item.branch_name}
									</option>
								))}
							</select>
							<button
								className="btn btn-warning d-block w-100 mt-3"
								onClick={setparameter}
							>
								Search
							</button>
						</div>
					</div>
				</div>

				<div className="mt-3">
					<div className="card">
						<div className="card-body">
							<div className="d-flex justify-content-between">
								<h5 className="card-title">Parameters</h5>
								<h5 className="card-title">
									{startDate.getMonth() + 1}-{startDate.getFullYear()}
								</h5>
							</div>
							<div className="">
								<div className="d-flex justify-content-between my-2">
									<label className="form-label my-auto">
										Loan balance (.000)
									</label>
									<div className="form-check form-switch my-auto">
										<input
											className="form-check-input"
											type="checkbox"
											id={"LoanBCheckChecked"}
											onChange={(e) => {
												setElb(!elb);
												if (eProfit == true) {
													setEprofit(false);
												}
											}}
											checked={elb}
										></input>
										<label
											className="form-check-label"
											htmlFor="LoanBCheckChecked"
										>
											{elb ? "Enable" : "Disable"}
										</label>
									</div>
								</div>
								<div className="input-group">
									<span className="input-group-text">Rp.</span>
									<input
										disabled={!elb}
										value={lb.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
										onChange={(e) => setLb(e.target.value)}
										className="form-control"
										id="Loan_Balance"
										placeholder="Input Number here without separator"
									></input>
								</div>
							</div>
							<div className="d-flex justify-content-between my-2">
								<label className="form-label my-auto">Loan Rate (%)</label>
								<div className="form-check form-switch my-auto">
									<input
										className="form-check-input"
										type="checkbox"
										id="LoanRCheckChecked"
										onChange={(e) => {
											setElr(!elr);
										}}
										checked={elr}
									></input>
									<label
										className="form-check-label"
										htmlFor="LoanRCheckChecked"
									>
										{elr ? "Enable" : "Disable"}
									</label>
								</div>
							</div>
							<div className="input-group">
								<input
									disabled={!elr}
									value={lr.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									onChange={(e) => setLr(e.target.value)}
									className="form-control"
									id="Loan_Rate"
									placeholder="Input Number here without '%'"
								></input>
								<span className="input-group-text">%</span>
							</div>
							<div className="">
								<div className="d-flex justify-content-between my-2">
									<label className="form-label my-auto">
										Placement Inter Office Balance (.000)
									</label>

									<div className="form-check form-switch my-auto">
										<input
											className="form-check-input"
											type="checkbox"
											id="piobCheckChecked"
											onChange={(e) => {
												setEpiob(!ePiob);
											}}
											checked={ePiob}
										></input>
										<label
											className="form-check-label"
											htmlFor="piobCheckChecked"
										>
											{ePiob ? "Enable" : "Disable"}
										</label>
									</div>
								</div>
								<div className="input-group">
									<span className="input-group-text">Rp.</span>
									<input
										disabled={!ePiob}
										value={piob.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
										onChange={(e) => {
											setPiob(e.target.value);
										}}
										className="form-control"
										id="Placement_Inter_Office_Balance"
										placeholder="Input Number here without separator"
									></input>
								</div>
							</div>
							<div className="d-flex justify-content-between my-2">
								<label className="form-label my-auto">
									Placement Inter Office Rate (%)
								</label>
								<div className="form-check form-switch my-auto">
									<input
										className="form-check-input"
										type="checkbox"
										id="piorCheckChecked"
										onChange={(e) => {
											setEpior(!ePior);
										}}
										checked={ePior}
									></input>
									<label
										className="form-check-label"
										htmlFor="piorCheckChecked"
									>
										{ePior ? "Enable" : "Disable"}
									</label>
								</div>
							</div>

							<div className="input-group">
								<input
									disabled={!ePior}
									value={pior.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									onChange={(e) => {
										setPior(e.target.value);
									}}
									className="form-control"
									id="Placement_Inter_Office_Rate"
									placeholder="Input Number here without '%'"
								></input>
								<span className="input-group-text">%</span>
							</div>
							<div className="">
								<div className="d-flex justify-content-between my-2">
									<label className="form-label my-auto">
										DPK Balance (.000)
									</label>
									<div className="form-check form-switch my-auto">
										<input
											className="form-check-input"
											type="checkbox"
											id="dpkbCheckChecked"
											onChange={(e) => {
												setEdpkb(!eDpkb);
											}}
											checked={eDpkb}
										></input>
										<label
											className="form-check-label"
											htmlFor="dpkbCheckChecked"
										>
											{eDpkb ? "Enable" : "Disable"}
										</label>
									</div>
								</div>
								<div className="input-group">
									<span className="input-group-text">Rp.</span>
									<input
										disabled={!eDpkb}
										value={dpkb.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
										onChange={(e) => {
											setDpkb(e.target.value);
										}}
										className="form-control"
										id="DPK_Balance"
										placeholder="Input Number here without separator"
									></input>
								</div>
							</div>
							<div className="d-flex justify-content-between my-2">
								<label className="form-label my-auto">DPK Rate (%)</label>
								<div className="form-check form-switch my-auto">
									<input
										className="form-check-input"
										type="checkbox"
										id="dpkrCheckChecked"
										onChange={(e) => {
											setEdpkr(!eDpkr);
										}}
										checked={eDpkr}
									></input>
									<label
										className="form-check-label"
										htmlFor="dpkrCheckChecked"
									>
										{eDpkr ? "Enable" : "Disable"}
									</label>
								</div>
							</div>
							<div className="input-group">
								<input
									disabled={!eDpkr}
									value={dpkr.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									onChange={(e) => {
										setDpkr(e.target.value);
									}}
									className="form-control"
									id="DPK_Rate"
									placeholder="Input Number here without '%'"
								></input>
								<span className="input-group-text">%</span>
							</div>
							<div className="">
								<div className="d-flex justify-content-between my-2">
									<label className="form-label my-auto">
										Borrowing Inter Office Balance (.000)
									</label>
									<div className="form-check form-switch my-auto">
										<input
											className="form-check-input"
											type="checkbox"
											id="biobCheckChecked"
											onChange={(e) => {
												setEbiob(!eBiob);
											}}
											checked={eBiob}
										></input>
										<label
											className="form-check-label"
											htmlFor="biobCheckChecked"
										>
											{eBiob ? "Enable" : "Disable"}
										</label>
									</div>
								</div>
								<div className="input-group">
									<span className="input-group-text">Rp.</span>
									<input
										disabled={!eBiob}
										value={biob.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
										onChange={(e) => {
											setBiob(e.target.value);
										}}
										className="form-control"
										id="Borrowing_Inter_Office_Balance"
										placeholder="Input Number here without separator"
									></input>
								</div>
							</div>
							<div className="d-flex justify-content-between my-2">
								<label className="form-label my-auto">
									Borrowing Inter Office Rate(%)
								</label>
								<div className="form-check form-switch my-auto">
									<input
										className="form-check-input"
										type="checkbox"
										id="biorCheckChecked"
										onChange={(e) => {
											setEbior(!eBior);
										}}
										checked={eBior}
									></input>
									<label
										className="form-check-label"
										htmlFor="biorCheckChecked"
									>
										{eBiob ? "Enable" : "Disable"}
									</label>
								</div>
							</div>
							<div className="input-group">
								<input
									disabled={!eBior}
									value={bior.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									onChange={(e) => {
										setBior(e.target.value);
									}}
									className="form-control"
									id="Borrowing_Inter_Office_Rate"
									placeholder="Input Number here without '%'"
								></input>
								<span className="input-group-text">%</span>
							</div>

							<div className="d-flex justify-content-between my-2">
								<label className="form-label my-auto">CKPN Rate (%)</label>
								<div className="form-check form-switch my-auto">
									<input
										className="form-check-input"
										type="checkbox"
										id="ckpnrCheckChecked"
										onChange={(e) => {
											setEckpnr(!eCkpnr);
										}}
										checked={eCkpnr}
									></input>
									<label
										className="form-check-label"
										htmlFor="ckpnrCheckChecked"
									>
										{eCkpnr ? "Enable" : "Disable"}
									</label>
								</div>
							</div>
							<div className="input-group">
								<input
									disabled={!eCkpnr}
									value={ckpnr.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									onChange={(e) => {
										setCkpnr(e.target.value);
									}}
									className="form-control"
									id="CKPN_Rate"
									placeholder="Input Number here without '%'"
								></input>
								<span className="input-group-text">%</span>
							</div>

							<div className="d-flex justify-content-between my-2">
								<label className="form-label my-auto">Profit (.000)</label>
								<div className="form-check form-switch my-auto">
									<input
										className="form-check-input"
										type="checkbox"
										id="profitCheckChecked"
										onChange={(e) => {
											setEprofit(!eProfit);
											if (elb === true) {
												setElb(false);
											}
										}}
										checked={eProfit}
									></input>
									<label
										className="form-check-label"
										htmlFor="profitCheckChecked"
									>
										{eProfit ? "Enable" : "Disable"}
									</label>
								</div>
							</div>
							<div className="input-group">
								<input
									disabled={!eProfit}
									value={profit.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									onChange={(e) => {
										setProfit(e.target.value);
									}}
									className="form-control"
									id="Profit_rate"
									placeholder="Input Number here without '%'"
								></input>
								<span className="input-group-text">%</span>
							</div>

							<div className="d-flex justify-content-between my-2">
								<label className="form-label my-auto">
									12 Month Projection
								</label>
								<div className="form-check form-switch my-auto">
									<input
										className="form-check-input"
										type="checkbox"
										id="Projection"
										onChange={(e) => {
											setEprojection(!eProjection);
										}}
										checked={eProjection}
									></input>
									<label className="form-check-label" htmlFor="Projection">
										{eProjection ? "Enable" : "Disable"}
									</label>
								</div>
							</div>
							<div className="input-group">
								<input
									disabled={!eProjection}
									value={projection}
									onChange={(e) => {
										setProjection(e.target.value);
									}}
									className="form-control"
									id="Projection_input"
									placeholder="Input Number here without '%'"
								></input>
								<span className="input-group-text">%</span>
							</div>
							<div>
								<button
									className="btn btn-primary d-block w-100 mt-4"
									onClick={Calculate}
								>
									Calculate
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* <div className={showSce ? "" : "visually-hidden"}> */}
			{/* {console.log(sceData)} */}
			{sceData.length === 0 ? (
				""
			) : (
				<div className="card mt-3 mb-3 ">
					<div className="card-body p-4">
						<div className="row">
							<div className="col-6 text-start my-auto">
								Scenario BASE ON FINANCIAL REPORT 2023
							</div>
							<div className="col-6 text-end ">
								(In Million Rp)<br></br>
								<button
									onClick={async () => {
										const htmlTable = `
  <table>
    <thead>
      <tr>
        <th>BEP Analisys</th>
      </tr>
	  <tr>
		<th>${selBranch}</th>
	  </tr>
	  <tr>
	  <th>Base On Financial Report 2023</th>
	</tr>
	<tr>
	  <th>Exixting</th>
	</tr>
	<tr>
	  <th>COA Name</th>
	  <th>Balance</th>
	  <th>Rate</th>
	  <th>Interest Income</th>

	</tr>
	<tr>
	  <th></th>
	  <th></th>
	  <th></th>
	  <th></th>

	</tr>
    </thead>
    <tbody>
      <tr>
        <td>Loan</td>
        <td>${sceData.Data.loan.balance}</td>
        <td>${sceData.Data.loan.rate}</td>
        <td>${sceData.Data.loan.interest_income}</td>

      </tr>
      <tr>
	  	<td>Placement Inter Office</td>
	  	<td>${sceData.Data.pio.balance}</td>
	  	<td>${sceData.Data.pio.rate}</td>
	  	<td>${sceData.Data.pio.interest_income}</td>
      </tr>
      <tr>
	  	<td></td>
	  	<td>${sceData.Data.total.balance}</td>
	  	<td></td>
	  	<td>${sceData.Data.total.interest_income}</td>
      </tr>
	  <tr>
	  	<td></td>
	  	<td></td>
	  	<td></td>
	  	<td></td>
      </tr>
	  <tr>
	  	<td>Pendapatan Lainnya</td>
	  	<td></td>
	  	<td></td>
	  	<td>${sceData.Data.other.interest_income}</td>
      </tr>
	  
	  <tr>
	  	<td></td>
	  	<td></td>
	  	<td></td>
	  	<td></td>
      </tr>
	  <tr>
	  	<td>Third-Party Funds</td>
	  	<td></td>
	  	<td></td>
	  	<td></td>
      </tr>
	  <tr>
	  	<td>DPK</td>
	  	<td>${sceData.Data.dpk.balance}</td>
	  	<td>${sceData.Data.dpk.rate}</td>
	  	<td>${sceData.Data.dpk.interest_income}</td>
      </tr>
	  <tr>
	  	<td>Borrowing Inter Office</td>
	  	<td>${sceData.Data.bio.balance}</td>
	  	<td>${sceData.Data.bio.rate}</td>
	  	<td>${sceData.Data.bio.interest_income}</td>
      </tr>
	  <tr>
	  	<td></td>
	  	<td>${sceData.Data.total_interest.balance}</td>
	  	<td></td>
	  	<td>${sceData.Data.total_interest.interest_income}</td>
      </tr>
	  <tr>
	  	<td></td>
	  	<td></td>
	  	<td></td>
	  	<td></td>
      </tr>
	  <tr>
	  	<td>NET INTEREST INCOME</td>
	  	<td></td>
	  	<td></td>
	  	<td>${sceData.Data.net.interest_income}</td>
      </tr>
	  <tr>
	  	<td></td>
	  	<td></td>
	  	<td></td>
	  	<td></td>
      </tr>
	  <tr>
	  	<td>OPERATIONAL COST :</td>
	  	<td></td>
	  	<td></td>
	  	<td></td>
      </tr>
	  <tr>
	  	<td>1. Salary</td>
	  	<td>${sceData.Data.salary.balance}</td>
	  	<td></td>
	  	<td></td>
  	  </tr>
		<tr>
		<td>2. Rental Cost Of Building</td>
		<td>${sceData.Data.rental.balance}</td>
		<td></td>
		<td></td>
	  </tr>
	  <tr>
		<td>3. Biaya CKPN</td>
		<td>${sceData.Data.ckpn.balance}</td>
		<td>${sceData.Data.ckpn.rate}</td>
		<td></td>
	  </tr>
	  <tr>
		<td>4. Operational Expenses</td>
		<td>${sceData.Data.operational.balance}</td>
		<td></td>
		<td></td>
	  </tr>
	  <tr>
		<td>5. Non Operational</td>
		<td>${sceData.Data.non_operational.balance}</td>
		<td></td>
		<td></td>
	  </tr>
	  <tr>
		<td></td>
		<td>${sceData.Data.total_op_cost.balance}</td>
		<td></td>
		<td>${sceData.Data.total_op_cost.interest_income}</td>
	  </tr>
	  <tr>
		<td>Total COST : </td>
		<td></td>
		<td></td>
		<td>${sceData.Data.total_cost.interest_income}</td>
	  </tr>
	  <tr>
		<td>Profit And Loss</td>
		<td></td>
		<td></td>
		<td>${sceData.Data.profit.interest_income}</td>
	  </tr>
    </tbody>
  </table>
`;

										// Parse the HTML table and create a worksheet
										const table = document.createElement("table");
										table.innerHTML = htmlTable;

										const sheet = XLSX.utils.table_to_sheet(table);

										// Set column widths
										sheet["!cols"] = [
											{ width: 30 },
											{ width: 20 },
											{ width: 20 },
											{ width: 20 },
										];
										sheet["!merges"] = [
											{
												s: { r: 0, c: 0 },
												e: { r: 0, c: 3 },
											},
											{
												s: { r: 1, c: 0 },
												e: { r: 1, c: 3 },
											},
											{
												s: { r: 2, c: 0 },
												e: { r: 2, c: 3 },
											},
											{
												s: { r: 3, c: 0 },
												e: { r: 3, c: 3 },
											},
										];
										const currencyFormatCurr = "Rp #,##0.00";
										for (let row = 6; row < 28; row++) {
											for (let col = 1; col < 2; col++) {
												const cell = XLSX.utils.encode_cell({ r: row, c: col });
												const value = sheet[cell]?.v;
												if (typeof value === "number") {
													sheet[cell] = {
														...sheet[cell],
														t: "n",
														z: currencyFormatCurr,
													};
												}
											}
										}

										const currencyFormatCurr2 = "Rp #,##0.00";
										for (let row = 6; row < 28; row++) {
											for (let col = 3; col < 4; col++) {
												const cell = XLSX.utils.encode_cell({ r: row, c: col });
												const value = sheet[cell]?.v;
												if (typeof value === "number") {
													sheet[cell] = {
														...sheet[cell],
														t: "n",
														z: currencyFormatCurr2,
													};
												}
											}
										}

										const currencyFormatrate = "0\\.00%";
										for (let row = 6; row < 28; row++) {
											for (let col = 2; col < 3; col++) {
												const cellrate = XLSX.utils.encode_cell({
													r: row,
													c: col,
												});
												const value = sheet[cellrate]?.v;
												if (typeof value === "number") {
													sheet[cellrate] = {
														...sheet[cellrate],
														t: "n",
														z: currencyFormatrate,
													};
												}
											}
										}
										const style = {
											font: {
												bold: true,
												color: "#ffffff",
												size: 16,
											},
											fill: {
												type: "pattern",
												patternType: "solid",
												fgColor: "#008000",
											},
											alignment: {
												horizontal: "center",
												vertical: "center",
											},
											border: {
												top: {
													style: "thin",
													color: "#000000",
												},
												bottom: {
													style: "thin",
													color: "#000000",
												},
												left: {
													style: "thin",
													color: "#000000",
												},
												right: {
													style: "thin",
													color: "#000000",
												},
											},
										};
										//   sheet.getCell('A1').setStyle(style);
										// Create a workbook and add the worksheet
										const workbook = XLSX.utils.book_new();

										XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");

										// Save the workbook to a file
										XLSX.writeFile(workbook, "output.xlsx");
									}}
									className="btn btn-success mt-3"
								>
									Export to Excel
								</button>
							</div>
						</div>
						<div className="row">
							<div
								className="col-12 text-center fw-bold"
								style={{ fontSize: "30px" }}
							>
								SCENARIO
								<hr></hr>
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
								{sceData.Data.loan.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className="col-3">{sceData.Data.loan.rate.toFixed(2)}%</div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.loan.interest_income.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
						</div>
						<div className="row">
							<div className="col-3">Placement Inter Office</div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.pio.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className="col-3">{sceData.Data.pio.rate.toFixed(2)}%</div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.pio.interest_income.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
						</div>
						<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
							<div className="col-3"></div>
							<div className="col-3 fw-bold">
								Rp.{" "}
								{sceData.Data.total.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className="col-3"></div>
							<div className="col-3 fw-bold">
								Rp.{" "}
								{sceData.Data.total.interest_income.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
						</div>
						<div className="row p-2"></div>
						<div className="row">
							<div className="col-3">Pendapatan Lainnya</div>
							<div className="col-3"></div>
							<div className="col-3"></div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.other.interest_income.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
						</div>
						<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
							<div className="col-3 fw-bold">Total Income</div>
							<div className="col-3"></div>
							<div className="col-3"></div>
							<div className="col-3 fw-bold">
								Rp.{" "}
								{sceData.Data.total_income.interest_income.toLocaleString(
									undefined,
									{
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}
								)}
							</div>
						</div>
						<div className="row p-2"></div>
						<div className="row bg-danger bg-opacity-10 border border-info border-start-0 rounded">
							<div className="col-3 fw-bold">Third-Party Funds</div>
							<div className="col-3"></div>
							<div className="col-3"></div>
							<div className="col-3 fw-bold">Interest Cost</div>
						</div>
						<div className="row">
							<div className="col-3">DPK</div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.dpk.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className="col-3">{sceData.Data.dpk.rate.toFixed(2)}%</div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.dpk.interest_income.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
						</div>
						<div className="row">
							<div className="col-3">Borrowing Inter Office</div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.bio.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className="col-3">{sceData.Data.bio.rate.toFixed(2)}%</div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.bio.interest_income.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
						</div>
						<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
							<div className="col-3"></div>
							<div className="col-3 fw-bold">
								Rp.{" "}
								{sceData.Data.total_interest.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className="col-3"></div>
							<div className="col-3 fw-bold">
								Rp.{" "}
								{sceData.Data.total_interest.interest_income.toLocaleString(
									undefined,
									{
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}
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
								{sceData.Data.net.interest_income.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
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
								{sceData.Data.salary.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className="col-3"></div>
							<div className="col-3 fw-bold"></div>
						</div>
						<div className="row">
							<div className="col-3">2. Rental cost of building</div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.rental.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className="col-3"></div>
							<div className="col-3 fw-bold"></div>
						</div>
						<div className="row">
							<div className="col-3">3. Biaya CKPN</div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.ckpn.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className="col-3">{sceData.Data.ckpn.rate.toFixed(2)}%</div>
							<div className="col-3 fw-bold"></div>
						</div>
						<div className="row">
							<div className="col-3">4. Operational Expenses</div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.operational.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className="col-3"></div>
							<div className="col-3 fw-bold"></div>
						</div>
						<div className="row">
							<div className="col-3">5. Non Operational </div>
							<div className="col-3">
								Rp.{" "}
								{sceData.Data.non_operational.balance.toLocaleString(
									undefined,
									{
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}
								)}
							</div>
							<div className="col-3"></div>
							<div className="col-3 fw-bold"></div>
						</div>
						<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
							<div className="col-3"></div>
							<div className="col-3 fw-bold">
								Rp.{" "}
								{sceData.Data.total_op_cost.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className="col-3"></div>
							<div className="col-3 fw-bold">
								Rp.{" "}
								{sceData.Data.total_op_cost.interest_income.toLocaleString(
									undefined,
									{
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}
								)}
							</div>
						</div>
						<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded mt-2">
							<div className="col-3 fw-bold">Total Cost</div>
							<div className="col-3"></div>
							<div className="col-3"></div>
							<div className="col-3 fw-bold">
								Rp.{" "}
								{sceData.Data.total_cost.interest_income.toLocaleString(
									undefined,
									{
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}
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
								{sceData.Data.profit.interest_income.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
		// </div>
	);
}

export default Custom;
