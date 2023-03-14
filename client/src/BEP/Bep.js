import React, { useEffect, useState } from "react";
import axios from "axios";

function Bep() {
	const [dataCabang, setDataCabang] = useState([]);
	const [dataBalance, setDataBalance] = useState([]);

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/api/get/bep?year=2023&month=1", {})
			.then((response) => {
				setDataCabang(response.data);

				// setDataBalance(response.data.Data);
				// console.log(dataBalance);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);
	// console.log(dataBalance);
	return (
		<div className="container">
			<div className="nav nav-tabs" id="nav-tab" role="tablist">
				{dataCabang.map((item) => (
					<button
						className="nav-link"
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

			<div className="tab-content" id="nav-tabContent">
				{dataCabang.map((item) => (
					<div
						className="tab-pane fade"
						id={"nav-" + item.Kode_Cabang}
						role="tabpanel"
						aria-labelledby={"nav-" + item.Kode_Cabang + "-tab"}
					>
						<div className="card mb-3" style={{width:'900px'}}>
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
								<div className="row bg-danger rounded-2 text-white">
									<div className="col-3">COA Name</div>
									<div className="col-3">Balance</div>
									<div className="col-3">Rate</div>
									<div className="col-3">Interest Income</div>
								</div>
								<div className="row">
									<div className="col-3">Loan</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.loan.balance.toFixed(2))}</div>
									<div className="col-3">{item.Data.loan.rate.toFixed(2)}%</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.loan.interest_income.toFixed(2))}</div>

								</div>
								<div className="row">
									<div className="col-3">Placement Inter Office</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.pio.balance.toFixed(2))}</div>
									<div className="col-3">{item.Data.pio.rate.toFixed(2)}%</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.pio.interest_income.toFixed(2))}</div>

								</div>
								<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
									<div className="col-3"></div>
									<div className="col-3 fw-bold">Rp. {new Intl.NumberFormat().format(item.Data.total.balance.toFixed(2))}</div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold">Rp. {new Intl.NumberFormat().format(item.Data.total.interest_income.toFixed(2))}</div>

								</div>
								<div className="row p-2">
									

								</div>
								<div className="row">
									<div className="col-3">Pendapatan Lainnya</div>
									<div className="col-3"></div>
									<div className="col-3"></div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.other.interest_income.toFixed(2))}</div>

								</div>
								<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
									<div className="col-3 fw-bold">Total Income</div>
									<div className="col-3"></div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold">Rp. {new Intl.NumberFormat().format(item.Data.total_income.interest_income.toFixed(2))}</div>

								</div>
								<div className="row p-2">
									

								</div>
								<div className="row bg-danger bg-opacity-10 border border-info border-start-0 rounded">
									<div className="col-3 fw-bold">Third-Party Funds</div>
									<div className="col-3"></div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold">Interest Cost</div>

								</div>
								<div className="row">
									<div className="col-3">DPK</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.dpk.balance.toFixed(2))}</div>
									<div className="col-3">{item.Data.dpk.rate.toFixed(2)}%</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.dpk.interest_income.toFixed(2))}</div>

								</div>
								<div className="row">
									<div className="col-3">Borrowing Inter Office</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.bio.balance.toFixed(2))}</div>
									<div className="col-3">{item.Data.bio.rate.toFixed(2)}%</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.bio.interest_income.toFixed(2))}</div>

								</div>
								<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
									<div className="col-3"></div>
									<div className="col-3 fw-bold">Rp. {new Intl.NumberFormat().format(item.Data.total_interest.balance.toFixed(2))}</div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold">Rp. {new Intl.NumberFormat().format(item.Data.total_interest.interest_income.toFixed(2))}</div>

								</div>
								<div className="row p-2">
									

								</div>
								<div className="row">
									<div className="col-3 bg-info bg-opacity-10 border border-info border-start-0 rounded fw-bold">NET INTEREST INCOME</div>
									<div className="col-3"></div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold">Rp. {new Intl.NumberFormat().format(item.Data.net.interest_income.toFixed(2))}</div>

								</div>
								<div className="row p-2">
									

								</div>
								<div className="row">
									<div className="col-3 bg-danger bg-opacity-10 border border-info border-start-0 rounded fw-bold">Operational COST :</div>
									<div className="col-3"></div>
									<div className="col-3"></div>
									<div className="col-3"></div>

								</div>
								<div className="row">
									<div className="col-3">1. Salary</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.salary.balance.toFixed(2))}</div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold"></div>

								</div>
								<div className="row">
									<div className="col-3">2. Rental cost of building</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.rental.balance.toFixed(2))}</div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold"></div>

								</div>
								<div className="row">
									<div className="col-3">3. Biaya CKPN</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.ckpn.balance.toFixed(2))}</div>
									<div className="col-3">{item.Data.ckpn.rate.toFixed(2)}%</div>
									<div className="col-3 fw-bold"></div>

								</div>
								<div className="row">
									<div className="col-3">4. Operational Expenses</div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.operational.balance.toFixed(2))}</div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold"></div>

								</div>
								<div className="row">
									<div className="col-3">5. Non Operational </div>
									<div className="col-3">Rp. {new Intl.NumberFormat().format(item.Data.non_operational.balance.toFixed(2))}</div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold"></div>

								</div>
								<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
									<div className="col-3"></div>
									<div className="col-3 fw-bold">Rp. {new Intl.NumberFormat().format(item.Data.total_op_cost.balance.toFixed(2))}</div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold">Rp. {new Intl.NumberFormat().format(item.Data.total_op_cost.interest_income.toFixed(2))}</div>

								</div>
								<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
									<div className="col-3 fw-bold">Total Cost</div>
									<div className="col-3"></div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold">Rp. {new Intl.NumberFormat().format(item.Data.total_cost.interest_income.toFixed(2))}</div>

								</div>
								<div className="row p-2">
									

								</div>
								<div className="row bg-info bg-opacity-10 border border-info border-start-0 rounded">
									<div className="col-3 fw-bold">Profit and Loss</div>
									<div className="col-3"></div>
									<div className="col-3"></div>
									<div className="col-3 fw-bold">Rp. {new Intl.NumberFormat().format(item.Data.profit.interest_income.toFixed(2))}</div>

								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Bep;
