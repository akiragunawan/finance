import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Custom() {
	const [startDate, setStartDate] = useState(new Date());
	const [branch, setBranch] = useState([]);
	const [lb,setLb] = useState();
	const [lr,setLr] = useState();
	const [piob,setPiob] = useState();
	const [pior,setPior] = useState();
	const [dpkb,setDpkb] = useState();
	const [dpkr,setDpkr] = useState();
	const [biob,setBiob] = useState();
	const [bior,setBior] = useState();
	const [ckpnr,setCkpnr] = useState();
	
	// const

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/api/get/branch", {})
			.then((response) => {
				setBranch(response.data);
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const setparameter = () =>{
		
	}

	return (
		<div className="container mt-5">
			<div>
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
				<select className="w-100 form-select" onChange={setparameter}>
					<option selected disabled>
						.:: Branch ::.
					</option>
					{branch.map((item) => (
						<option value={item.branch_code} key={item.branch_code}>
							{item.branch_name}
						</option>
					))}
					input
				</select>
				<div className="mt-3">
					<div className="card">
						<div className="card-body">
							<h5 className="card-title">Parameters</h5>
							<div className="">
								<label className="form-label mt-3">Loan balance (.000)</label>
								<input
									value={lb}
									onChange={(e) => setLb(e.target.value)}
									className="form-control"
									id="Loan_Balance"
									placeholder="Input Number here without separator"
								></input>
							</div>
							<label className="form-label mt-3">Loan Rate (%)</label>
							<div className="input-group">
								<input
									className="form-control"
									id="Loan_Rate"
									placeholder="Input Number here without '%'"
								></input>
								<span class="input-group-text">%</span>
							</div>
							<div className="">
								<label className="form-label mt-3">
									Placement Inter Office Balance (.000)
								</label>
								<input
									className="form-control"
									id="Placement_Inter_Office_Balance"
									placeholder="Input Number here without separator"
								></input>
							</div>
							<label className="form-label mt-3">
								Placement Inter Office Rate (%)
							</label>
							<div className="input-group">
								<input
									className="form-control"
									id="Placement_Inter_Office_Rate"
									placeholder="Input Number here without '%'"
								></input>
								<span class="input-group-text">%</span>
							</div>
							<div className="">
								<label className="form-label mt-3">DPK Balance (.000)</label>
								<input
									className="form-control"
									id="DPK_Balance"
									placeholder="Input Number here without separator"
								></input>
							</div>
							<label className="form-label mt-3">DPK Rate (%)</label>
							<div className="input-group">
								<input
									className="form-control"
									id="DPK_Rate"
									placeholder="Input Number here without '%'"
								></input>
								<span class="input-group-text">%</span>
							</div>
							<div className="">
								<label className="form-label mt-3">
									Borrowing Inter Office Balance (.000)
								</label>
								<input
									className="form-control"
									id="Borrowing_Inter_Office_Balance"
									placeholder="Input Number here without separator"
								></input>
							</div>
							<label className="form-label mt-3">
								Borrowing Inter Office Rate(%)
							</label>
							<div className="input-group">
								<input
									className="form-control"
									id="Borrowing_Inter_Office_Rate"
									placeholder="Input Number here without '%'"
								></input>
								<span class="input-group-text">%</span>
							</div>
							<label className="form-label mt-3">CKPN Rate (%)</label>
							<div className="input-group">
								<input
									className="form-control"
									id="CKPN_Rate"
									placeholder="Input Number here without '%'"
								></input>
								<span class="input-group-text">%</span>
							</div>
							<div>
								<button className="btn btn-primary d-block w-100 mt-4">
									Calculate
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div></div>
		</div>
	);
}

export default Custom;
