import React, { useEffect, useState } from "react";
import axios from "axios";
import "../BEP/Bep.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Bep() {
	const [dataCabang, setDataCabang] = useState([]);
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState(new Date());
	
	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/api/get/bep?year=2023&month=2", {})
			.then((response) => {
				setDataCabang(response.data);
				setLoading(false);
				console.log(response);
				// setDataBalance(response.data.Data);
				// console.log(dataBalance);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div class="position-absolute top-50 start-50 translate-middle">
				<div
					class="spinner-grow text-secondary"
					style={{ width: "5rem", height: "5em" }}
					role="status"
				>
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	const handleSubmit = (event) => {
		event.preventDefault(); 
		axios
			.get("http://127.0.0.1:8000/api/get/bep?year=2023&month="+startDate.getMonth()+1, {})
			.then((response) => {
				setDataCabang(response.data);
				setLoading(false);
				console.log(response);
				// setDataBalance(response.data.Data);
				// console.log(dataBalance);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	};

	// console.log(dataBalance);
	return (
		<div className="mt-5">
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
					<button onClick={handleSubmit} className="btn btn-secondary">Search</button>
				</div>
			</div>
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
						{dataCabang.map((item) => (
							<button
								className="nav-link text-dark p-3 text-dark fw-bold"
								id={"nav-" + item.Kode_Cabang + "-tab"}
								data-bs-toggle="tab"
								data-bs-target={"#nav-" + item.Kode_Cabang}
								type="button"
								role="tab"
								aria-controls={"nav-" + item.Kode_Cabang}
								aria-selected="false"
								key={item.Kode_Cabang}
							>
								{item.Nama_Cabang}
							</button>
						))}
					</div>
				</div>
			</div>
			<div className="container">
				<div className="tab-content " id="nav-tabContent">
					{dataCabang.map((item) => (
						<div
							className="tab-pane fade"
							id={"nav-" + item.Kode_Cabang}
							role="tabpanel"
							aria-labelledby={"nav-" + item.Kode_Cabang + "-tab"}
						>
							{/* <div className=""> */}
							<div className="scrolling-wrapper row flex-row flex-nowrap mt-4 pb-4 pt-2 ">
								<div className="col">
									<div className="card mb-3 " style={{ width: "900px" }}>
										<div className="card-body p-4">
											<div className="row">
												<div className="col-6 text-start ">
													BASE ON FINANCIAL REPORT 2023
												</div>
												<div className="col-6 text-end ">(In Million Rp)</div>
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
													{new Intl.NumberFormat().format(
														item.Data.loan.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.loan.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.loan.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row">
												<div className="col-3">Placement Inter Office</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.pio.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.pio.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.pio.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.other.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3 fw-bold">Total Income</div>
												<div className="col-3"></div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_income.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.dpk.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.dpk.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.dpk.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row">
												<div className="col-3">Borrowing Inter Office</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.bio.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.bio.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.bio.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_interest.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_interest.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.net.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.salary.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">2. Rental cost of building</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.rental.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">3. Biaya CKPN</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.ckpn.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.ckpn.rate.toFixed(2)}%
												</div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">4. Operational Expenses</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.operational.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">5. Non Operational </div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.non_operational.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_op_cost.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_op_cost.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded mt-2">
												<div className="col-3 fw-bold">Total Cost</div>
												<div className="col-3"></div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_cost.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.profit.interest_income.toFixed(2)
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col">
									<div
										className="col-xs-4 card mb-3 "
										style={{ width: "900px" }}
									>
										<div className="card-body p-4">
											<div className="row">
												<div className="col-6 text-start ">
													BASE ON FINANCIAL REPORT 2023
												</div>
												<div className="col-6 text-end ">(In Million Rp)</div>
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
													{new Intl.NumberFormat().format(
														item.Data.loan.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.loan.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.loan.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row">
												<div className="col-3">Placement Inter Office</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.pio.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.pio.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.pio.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.other.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3 fw-bold">Total Income</div>
												<div className="col-3"></div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_income.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.dpk.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.dpk.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.dpk.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row">
												<div className="col-3">Borrowing Inter Office</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.bio.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.bio.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.bio.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_interest.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_interest.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.net.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.salary.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">2. Rental cost of building</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.rental.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">3. Biaya CKPN</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.ckpn.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.ckpn.rate.toFixed(2)}%
												</div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">4. Operational Expenses</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.operational.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">5. Non Operational </div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.non_operational.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_op_cost.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_op_cost.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded mt-2">
												<div className="col-3 fw-bold">Total Cost</div>
												<div className="col-3"></div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_cost.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.profit.interest_income.toFixed(2)
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col">
									<div
										className="col-xs-4 card mb-3 "
										style={{ width: "900px" }}
									>
										<div className="card-body p-4">
											<div className="row">
												<div className="col-6 text-start ">
													BASE ON FINANCIAL REPORT 2023
												</div>
												<div className="col-6 text-end ">(In Million Rp)</div>
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
													{new Intl.NumberFormat().format(
														item.Data.loan.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.loan.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.loan.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row">
												<div className="col-3">Placement Inter Office</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.pio.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.pio.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.pio.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.other.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3 fw-bold">Total Income</div>
												<div className="col-3"></div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_income.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.dpk.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.dpk.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.dpk.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row">
												<div className="col-3">Borrowing Inter Office</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.bio.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.bio.rate.toFixed(2)}%
												</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.bio.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_interest.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_interest.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.net.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.salary.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">2. Rental cost of building</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.rental.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">3. Biaya CKPN</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.ckpn.balance.toFixed(2)
													)}
												</div>
												<div className="col-3">
													{item.Data.ckpn.rate.toFixed(2)}%
												</div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">4. Operational Expenses</div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.operational.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row">
												<div className="col-3">5. Non Operational </div>
												<div className="col-3">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.non_operational.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold"></div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_op_cost.balance.toFixed(2)
													)}
												</div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_op_cost.interest_income.toFixed(2)
													)}
												</div>
											</div>
											<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded mt-2">
												<div className="col-3 fw-bold">Total Cost</div>
												<div className="col-3"></div>
												<div className="col-3"></div>
												<div className="col-3 fw-bold">
													Rp.{" "}
													{new Intl.NumberFormat().format(
														item.Data.total_cost.interest_income.toFixed(2)
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
													{new Intl.NumberFormat().format(
														item.Data.profit.interest_income.toFixed(2)
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							ddsfds
							{/* </div> */}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Bep;
