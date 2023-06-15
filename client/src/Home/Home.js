import axios from "axios";
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
	var date_now = new Date();
	const [Dts, setDts] = useState([]);
	const [SelDate, setSelDate] = useState();
	const [Month, setMonth] = useState(("0" + date_now.getMonth()).slice(-2));
	const [Year, setYear] = useState(date_now.getFullYear());
	const [MonthYear, setMonthYear] = useState(`${Year}-${Month}`);
	const [Loading, setLoading] = useState(false);

	useEffect(() => {
		console.log();

		getbep();
	}, []);

	const Get_New_Bep = async (e) => {
		setLoading(true);
		// console.log(e.target.value);
		setMonthYear(e.target.value);
		var M = e.target.value.slice(-2);
		var Y = e.target.value.slice(0, 4);
		console.log(Y);
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_LINK_API_SERVER}/api/get/bep?year=${Y}&month=${M}`
			);

			const filteredData = response.data[0].filter(
				(item) => item.Data.profit.interest_income < 0
			);

			const updatedDts = filteredData.map((item) => ({
				Nama_Cabang: item.Nama_Cabang,
				Profit: item.Data.profit.interest_income,
			}));

			setDts(updatedDts);
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	if (Loading) {
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

	const getbep = async () => {
		try {
			const response = await axios.get(
				`${
					process.env.REACT_APP_LINK_API_SERVER
				}/api/get/bep?year=${date_now.getFullYear()}&month=${date_now.getMonth()}`
			);

			const filteredData = response.data[0].filter(
				(item) => item.Data.profit.interest_income < 0
			);

			const updatedDts = filteredData.map((item) => ({
				Nama_Cabang: item.Nama_Cabang,
				Profit: item.Data.profit.interest_income,
			}));

			setDts(updatedDts);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="container">
			{/* Render the Dts array */}
			<div className="d-flex justify-content-between my-5">
				<div>
					<h3 className="fw-bold  text-uppercase">Profit Minus By Branch</h3>
				</div>
				<div>
					<input
						className="form-control"
						value={MonthYear}
						type="month"
						onChange={(e) => {
							Get_New_Bep(e);
						}}
					/>
				</div>
			</div>
			<div className="d-flex justify-content-around flex-wrap">
				{Dts.map((item, index) => (
					<div
						className="card shadow my-3"
						style={{ minWidth: "300px" }}
						key={index}
					>
						<div className="card-body bg-warning bg-opacity-75 ">
							<div className="card-title text-uppercase">
								<h4>{item.Nama_Cabang}</h4>
							</div>
							<div className="card-text">
								<p className="my-auto fw-bold">
									RP. {new Intl.NumberFormat().format(item.Profit.toFixed(2))}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Home;
