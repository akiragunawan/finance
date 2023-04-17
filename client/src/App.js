import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bs from "./BS/Bs";
import Bep from "./BEP/Bep";
import Cs from "./Custom/Custom.js";
import "./App.css";
import Callback from "./Callback/Callback";
import Home from "./Home/Home";
import Pl from "./PL/Pl"

function App() {
	return (
		<BrowserRouter>
			<Sidebar />
			<Routes>
				<Route path="/" element={<Home />} />

				<Route path="/bs" element={<Bs />} />
				<Route path="/pl" element={<Pl />} />
				<Route path="/bep" element={<Bep />} />
				<Route path="/cs" element={<Cs />} />

				<Route path="/callback" element={<Callback />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
