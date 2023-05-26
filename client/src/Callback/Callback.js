import React, { useEffect, useState } from "react";
import { json, useSearchParams } from "react-router-dom";
import axios from "axios";
function Callback() {
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get("code");
	var linksso = process.env.REACT_APP_LINK_API_SSO;
	// const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		// window.location.replace(
		// 	linksso+"/oauth/authorize?grant_type=authorization_code&client_id=98907a23-7b34-4bc0-8220-dc6bf0fbb104&client_secret=9RaZC3IBZImb5r93hB0onyJkrTpgrC0S8wd5JuTG&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&code=" +
		// 		code
		// );
		// var url =
		// 	linksso+"/oauth/authorize?client_id=98907a23-7b34-4bc0-8220-dc6bf0fbb104&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&code=" +
		// 	code;

		// var form = $(
		// 	'<form action="' +
		// 		url +
		// 		'" method="post">' +
		// 		'<input type="text" name="api_url" value="' +
		// 		Return_URL +
		// 		'" />' +
		// 		"</form>"
		// );
		// $("body").append(form);
		// form.submit();

		axios({
			method: "post",
			url: linksso+"/oauth/token",
			data: {
				grant_type: "authorization_code",
				client_id: "98907a23-7b34-4bc0-8220-dc6bf0fbb104",
				client_secret: "9RaZC3IBZImb5r93hB0onyJkrTpgrC0S8wd5JuTG",
				redirect_uri: "http://127.0.0.1:3000/callback",
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
					url: linksso+"/api/userToken",
					data: {
						access_token: e.data.access_token,
					},
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Headers": "*",
						"Access-Control-Allow-Credentials": "true",
						"Content-Type": "application/json",
						Authorization: "Bearer " + e.data.access_token,
					},
				})
					.then(function (b) {
						console.log(b.data);
						if (b.data) {
							sessionStorage.setItem("_token", b.data.token);
							sessionStorage.setItem("_sestoken", e.data.access_token);
							window.location.replace("http://127.0.0.1:3000/");
						} else {
							sessionStorage.removeItem("_token");
							sessionStorage.removeItem("_sestoken");
							window.location.replace("http://127.0.0.1:3000/");
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
