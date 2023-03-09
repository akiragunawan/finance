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
						className="tab-pane fade show active"
						id={"nav-" + item.Kode_Cabang}
						role="tabpanel"
						aria-labelledby={"nav-" + item.Kode_Cabang + "-tab"}
					>
						<div className="card">
              <div className="row">
                <div className="col-6 text-start ">BASE ON FINANCIAL REPORT 2023</div>
                <div className="col-6 text-end ">(In Million Rp)</div>

              </div>
							<div className="row">
								<div className="col-12 text-center fw-bold p-2" style={{fontSize:'30px'}}>EXISTING</div>
							</div>
							<div className="row bg-danger">
                <div className="col-3">COA Name</div>
								<div className="col-3">Balance</div>
								<div className="col-3">Rate</div>
								<div className="col-3">Interest Income</div>
							</div>
              <div className="row">
                {/* <div className="col-3">Loan</div> */}
							{item.Data.map((subitem,index) => (
								<div className="col-3" key={subitem.balance}>{subitem.balance}<div style={{color:'red'}}>{index}</div></div>
								// <></>
							))}
              </div>
						</div>
            

					</div>
				))}
			</div>
		</div>
	);
}

export default Bep;
