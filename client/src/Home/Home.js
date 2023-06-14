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
	const [Dts, setDts] = useState([]);
  
	useEffect(() => {
	  getbep();
	}, []);
  
	const getbep = async () => {
	  try {
		const response = await axios.get(
		  `${process.env.REACT_APP_LINK_API_SERVER}/api/get/bep?year=2023&month=4`
		);
  
		const filteredData = response.data[0].filter(
		  item => item.Data.profit.interest_income < 0
		);
  
		const updatedDts = filteredData.map(item => ({
		  Nama_Cabang: item.Nama_Cabang,
		  Profit: item.Data.profit.interest_income,
		}));
  
		setDts(updatedDts);
	  } catch (error) {
		console.log(error);
	  }
	};
  
	console.log(Dts);
  
	return (
	  <div>
		{/* Render the Dts array */}
		{Dts.map((item, index) => (
		  <div key={index}>
			<p>Nama Cabang: {item.Nama_Cabang}</p>
			<p>Profit: {item.Profit}</p>
		  </div>
		))}
	  </div>
	);
  }
  
  export default Home;