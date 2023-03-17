import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
function Callback() {
	const [searchParams, setSearchParams] = useSearchParams();


	useEffect(() => {
		axios({
			method: "post",
			url: "https://sso.okbank.co.id/oauth/token",
			data: {
				grant_type: "authorization_code",
				client_id: "98907a23-7b34-4bc0-8220-dc6bf0fbb104",
				client_secret: "9RaZC3IBZImb5r93hB0onyJkrTpgrC0S8wd5JuTG",
				redirect_uri: "http://127.0.0.1:3000/callback",
				code: searchParams.get("code").substring(5, 8),
			},
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "*",
				"Access-Control-Allow-Credentials": "true",
                'Content-Type': 'application/json',
			},
		})
			.then(function (e) {
                console.log(e);
            })
			.catch(function (e) {
                console.log(e);
            });
	}, []);
	return <div>data: </div>;
}

export default Callback;
