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
	const linksso = process.env.REACT_APP_LINK_API_SSO;
	const linkserver = process.env.REACT_APP_LINK_API_SERVER;
	const linkclientper = process.env.REACT_APP_LINK_CLIENT_PER;
	const linkclient = process.env.REACT_APP_LINK_CLIENT;

	useEffect(() => {
		const timeout = setTimeout(() => {
			// 👇️ redirects to an external URL
			if (
				!sessionStorage.getItem("_token") ||
				!sessionStorage.getItem("_sestoken")
			) {
				window.location.replace(
					`${process.env.REACT_APP_LINK_API_SSO}/oauth/authorize?client_id=98907a23-7b34-4bc0-8220-dc6bf0fbb104&redirect_uri=${process.env.REACT_APP_LINK_CLIENT_PER}2Fcallback&response_type=code&scope=&state=${generateString(40)}`
				);
			}
		});

		return () => clearTimeout(timeout);
	}, []);
	return <></>;
}

export default Home;
