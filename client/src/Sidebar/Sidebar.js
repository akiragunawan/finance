import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

function Sidebar() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const handleSidebarToggle = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const logout = () => {
		sessionStorage.removeItem("_token");
		sessionStorage.removeItem("_sestoken");

		window.location.replace(process.env.REACT_APP_LINK_SSO + "/logout");
	};

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleDropdownToggle = (e) => {
		e.preventDefault();
		setIsDropdownOpen(!isDropdownOpen);
	};

	return (
		<nav className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
			<div className="sidebar-header">
				<svg className="mt-4 pe-3" height="210" width="400">
					<g data-v-28c0316e="">
						<path
							data-v-28c0316e=""
							d="M7.27795 3.23047C3.2802 3.23047 0 6.25679 0 10.0012C0 14.3099 2.97268 17.2849 7.27795 17.2849C11.5832 17.2849 14.5559 14.3099 14.5559 10.0012C14.6072 6.25679 11.327 3.23047 7.27795 3.23047ZM7.27795 14.2586C5.02281 14.2586 3.2802 12.412 3.2802 10.0525C3.2802 8.05207 5.12532 6.30808 7.27795 6.30808C9.37933 6.30808 11.2757 8.05207 11.2757 10.0525C11.2757 12.412 9.53309 14.2586 7.27795 14.2586Z"
							fill="black"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M24.9611 16.8226H28.7538L22.8085 9.89793V9.84664L28.2413 3.69141H24.6536L19.4257 9.59017V3.69141H16.248V16.8226H19.4257V10.616L19.477 10.6673L24.9611 16.8226Z"
							fill="black"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M42.4367 3.12891C40.8478 1.12846 38.4902 0 35.9275 0C33.3649 0 31.0072 1.12846 29.4184 3.12891L29.1621 3.48797L29.5209 3.74443L30.9047 4.8216L31.2635 5.07807L31.5198 4.71901C32.5961 3.38538 34.2362 2.56468 35.9275 2.56468C37.6701 2.56468 39.259 3.33408 40.3353 4.71901L40.5916 5.07807L41.0016 4.8216L42.3854 3.74443L42.7442 3.48797L42.4367 3.12891Z"
							fill="#FAA61A"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M35.9273 17.3373C36.7198 17.3373 37.3624 16.6943 37.3624 15.9011C37.3624 15.1079 36.7198 14.4648 35.9273 14.4648C35.1347 14.4648 34.4922 15.1079 34.4922 15.9011C34.4922 16.6943 35.1347 17.3373 35.9273 17.3373Z"
							fill="#F04923"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M37.7723 6.36024C37.7723 5.33437 36.9522 4.51367 35.9271 4.51367C34.9021 4.51367 34.082 5.33437 34.082 6.36024C34.082 6.46283 34.9533 12.7206 34.9533 12.7206C34.9533 13.2336 35.4146 13.6952 35.9271 13.6952C36.4397 13.6952 36.901 13.2849 36.901 12.7206C36.901 12.7719 37.7723 6.56542 37.7723 6.36024Z"
							fill="#F04923"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M45.4609 4.41211H51.7651V6.20739H47.7673V9.59276H51.6113V11.388H47.7673V16.8252H45.5122V4.41211H45.4609Z"
							fill="black"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M53.7129 4.41211H55.968V16.8252H53.7129V4.41211Z"
							fill="black"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M58.582 4.41211H61.2984L65.45 14.1579H65.5012V4.41211H67.5513V16.8252H64.8349L60.7347 7.13067H60.6834V16.8252H58.6333V4.41211H58.582Z"
							fill="black"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M76.3668 13.8501H72.1128L71.2415 16.8252H68.9863L73.1378 4.41211H75.6492L79.647 16.8252H77.2893L76.3668 13.8501ZM75.9055 12.1062L74.3167 6.30997L72.6253 12.1062H75.9055Z"
							fill="black"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M81.0312 4.41211H83.7477L87.8992 14.1579H87.9504V4.41211H90.0005V16.8252H87.2841L83.1839 7.13067H83.1326V16.8252H81.0825V4.41211H81.0312Z"
							fill="black"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M100.456 16.5688C99.9946 16.8253 98.867 17.0304 97.7907 17.0304C93.9979 17.0304 92.1016 14.2606 92.1016 10.6187C92.1016 6.97689 94.0492 4.20703 97.7394 4.20703C99.0207 4.20703 100.046 4.56609 100.507 4.71997L100.405 6.77171C99.9433 6.51524 99.2258 6.10489 98.0469 6.10489C96.1506 6.10489 94.5617 7.38724 94.5617 10.6187C94.5617 13.8502 96.2018 15.1326 98.0469 15.1326C99.1745 15.1326 99.892 14.8761 100.405 14.4658L100.456 16.5688Z"
							fill="black"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M102.455 4.41211H104.71V16.8252H102.455V4.41211Z"
							fill="black"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M113.627 13.8501H109.373L108.501 16.8252H106.246L110.398 4.41211H112.909L116.907 16.8252H114.549L113.627 13.8501ZM113.165 12.1062L111.576 6.30997H111.525L109.834 12.1062H113.165Z"
							fill="black"
						></path>{" "}
						<path
							data-v-28c0316e=""
							d="M118.189 4.41211H120.445V15.0299H124.545V16.8252H118.189V4.41211Z"
							fill="black"
						></path>{" "}
					</g>
				</svg>
				<button className="sidebar-toggle " onClick={handleSidebarToggle}>
					<FontAwesomeIcon icon={faBars} />
				</button>
			</div>

			<ul className="sidebar-nav">
				<li className="sidebar-nav-item">
					<NavLink to="/" className="sidebar-nav-link" activeclassname="active">
						<i className="fas fa-home mr-2"></i>
						<span>Home</span>
					</NavLink>
				</li>
				<li className="sidebar-nav-item">
					<a
						href="#"
						className="sidebar-nav-link"
						onClick={handleDropdownToggle}
					>
						<i className="fas fa-users mr-2"></i>
						<span>BEP</span>
						<div className="chevron">
							<FontAwesomeIcon
								icon={faChevronDown}
								className={`chevron ${isDropdownOpen ? "open" : ""}`}
							/>
						</div>
					</a>
					<ul className={`dropdown ${isDropdownOpen ? "open" : ""}`}>
						<li className="dropdown-items">
							<NavLink
								to="/bs"
								className="dropdown-link"
								activeclassname="active"
							>
								BS
							</NavLink>
						</li>
						<li className="dropdown-items">
							<NavLink
								to="/pl"
								className="dropdown-link"
								activeclassname="active"
							>
								PL
							</NavLink>
						</li>
						<li className="dropdown-items">
							<NavLink
								to="/Bep"
								className="dropdown-link"
								activeclassname="active"
							>
								Final BEP
							</NavLink>
						</li>
						<li className="dropdown-items">
							<NavLink
								to="/cs"
								className="dropdown-link"
								activeclassname="active"
							>
								Custom Scenario
							</NavLink>
						</li>
					</ul>
				</li>
				{/* <li className="sidebar-nav-item">
          <NavLink to="/settings" className="sidebar-nav-link" activeclassname="active">
            <i className="fas fa-cog mr-2"></i>
            <span>Settings</span>
          </NavLink>
        </li> */}
			</ul>
			{/* <ul className="sidebar-nav">
				<li className="sidebar-nav-item mt-3">
					<NavLink to="/" className="sidebar-nav-link" activeclassname="active">
						<i className="fas fa-home mr-2"></i>
						<span>Homesdsd</span>
					</NavLink>
				</li>
			</ul> */}
			<a
				onClick={logout}
				className="btn btn-secondary w-100"
				style={{ marginTop: " 800px" }}
			>
				Logout
			</a>
		</nav>
	);
}

export default Sidebar;
