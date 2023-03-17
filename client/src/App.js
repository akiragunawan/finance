import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bs from "./BS/Bs";
import Bep from "./BEP/Bep";
import "./App.css";
import Callback from "./Callback/Callback";
import Home from "./Home/Home";

function App() {
	return (
		<BrowserRouter>
			<Sidebar />
			<Routes>
				<Route path="/" element={<Home />} />

				<Route path="/bs" element={<Bs />} />
				<Route path="/bep" element={<Bep />} />
				<Route path="/callback" element={<Callback />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
