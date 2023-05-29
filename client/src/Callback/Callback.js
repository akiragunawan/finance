import React, { useEffect, useState } from "react";
import { json, useSearchParams } from "react-router-dom";
import axios from "axios";
function Callback() {
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get("code");
	const linksso = process.env.REACT_APP_LINK_API_SSO;
	const linkserver = process.env.REACT_APP_LINK_API_SERVER;
	const linkclientper = process.env.REACT_APP_LINK_CLIENT_PER;
	const linkclient = process.env.REACT_APP_LINK_CLIENT;

	useEffect(() => {
		axios({
			method: "post",
			url: process.env.REACT_APP_LINK_API_SSO+ "/oauth/token",
			data: {
				grant_type: "authorization_code",
				client_id: "98907a23-7b34-4bc0-8220-dc6bf0fbb104",
				client_secret: "9RaZC3IBZImb5r93hB0onyJkrTpgrC0S8wd5JuTG",
				redirect_uri: process.env.REACT_APP_LINK_CLIENT+ "/callback",
				code: code,
			},
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "*",
				"Access-Control-Allow-Credentials": "true",
				"Content-Type": "application/json",
			},
		})
			.then(function (e) {
				console.log(e.data);
				axios({
					method: "post",
					url: process.env.REACT_APP_LINK_API_SSO+ "/api/userToken",
					data: {
						access_token: e.data.access_token,
					},
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Headers": "*",
						"Access-Control-Allow-Credentials": "true",
						"Content-Type": "application/json",
						"Authorization": "Bearer " + e.data.access_token,
					},
				})
					.then(function (b) {
						console.log(b.data);
						if (b.data) {
							sessionStorage.setItem("_token", b.data.token);
							sessionStorage.setItem("_sestoken", e.data.access_token);
							window.location.replace(process.env.REACT_APP_LINK_CLIENT+ "/");
						} else {
							sessionStorage.removeItem("_token");
							sessionStorage.removeItem("_sestoken");
							window.location.replace(process.env.REACT_APP_LINK_CLIENT+ "/");
						}
					})
					.catch(function (c) {
						console.log(c);
					});
			})
			.catch(function (e) {
				console.log(e);
			});
	}, []);
	return <></>;
}

export default Callback;
