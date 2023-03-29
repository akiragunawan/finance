import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Custom() {
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
	const [showSce, setShowsce] = useState(true);
	const d = new Date();
	const [error, setError] = useState(1);
	const [sceData, setScedata] = useState([]);

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
			.get("http://127.0.0.1:8000/api/get/branch", {})
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
							"http://127.0.0.1:8000/api/get/bep?year=" +
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
							"http://127.0.0.1:8000/api/get/bep?year=" +
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
		// console.log(lb);
		if (lb === 0) {
			alert("Loan Balance must bee fill");
		} else if (lr === undefined) {
			alert("Loan Rate must be fill");
		} else if (piob === undefined) {
			alert("Placement Inter Office Balance must be fill");
		} else if (pior === undefined) {
			alert("Placement Inter Office Rate must be fill");
		} else if (dpkb === undefined) {
			alert("DPK Balance must be fill");
		} else if (dpkr === undefined) {
			alert("DPK Rate must be fill");
		} else if (biob === undefined) {
			alert("Borrowing Inter Office Balance must be fill");
		} else if (bior === undefined) {
			alert("Borrwing Iner Office Rate must be fill");
		} else if (ckpnr === undefined) {
			alert("CKPN Rate must be fill");
		} else {
			axios
				.get(
					"http://127.0.0.1:8000/api/get/scenario?year=" +
						startDate.getFullYear() +
						"&month=" +
						startDate.getMonth() +
						1 +
						"&loan_bal=" +
						lb +
						"&loan_rate=" +
						lr +
						"&pio_bal=" +
						piob +
						"&pio_rate=" +
						pior +
						"&dpk_bal=" +
						dpkb +
						"&dpk_rate=" +
						dpkr +
						"&bio_bal=" +
						biob +
						"&bio_rate=" +
						bior +
						"&ckpn_rate=" +
						ckpnr +
						"&branch=" +
						selBranch,

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
	// console.log(sceData.Data.loan);
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
								onChange={(e) => setSelBranch(e.target.value)}
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
								<label className="form-label mt-3">Loan balance (.000)</label>
								<div className="input-group">
									<span className="input-group-text">Rp.</span>
									<input
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
							<label className="form-label mt-3">Loan Rate (%)</label>
							<div className="input-group">
								<input
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
								<label className="form-label mt-3">
									Placement Inter Office Balance (.000)
								</label>
								<div className="input-group">
									<span className="input-group-text">Rp.</span>
									<input
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
							<label className="form-label mt-3">
								Placement Inter Office Rate (%)
							</label>
							<div className="input-group">
								<input
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
								<label className="form-label mt-3">DPK Balance (.000)</label>
								<div className="input-group">
									<span className="input-group-text">Rp.</span>
									<input
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
							<label className="form-label mt-3">DPK Rate (%)</label>
							<div className="input-group">
								<input
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
								<label className="form-label mt-3">
									Borrowing Inter Office Balance (.000)
								</label>
								<div className="input-group">
									<span className="input-group-text">Rp.</span>
									<input
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
							<label className="form-label mt-3">
								Borrowing Inter Office Rate(%)
							</label>
							<div className="input-group">
								<input
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
							<label className="form-label mt-3">CKPN Rate (%)</label>
							<div className="input-group">
								<input
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
				<div className="card mt-3 mb-3">
					<div className="card-body p-4">
						<div className="row">
							<div className="col-6 text-start ">
								Scenario BASE ON FINANCIAL REPORT 2023
							</div>
							<div className="col-6 text-end ">(In Million Rp)</div>
						</div>
						<div className="row">
							<div
								className="col-12 text-center fw-bold"
								style={{ fontSize: "30px" }}
							>
								SCENARIO
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
