import React, { useState, useEffect } from "react";

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function Home() {



	

	useEffect(() => {
		const timeout = setTimeout(() => {
			// 👇️ redirects to an external URL
            
			window.location.replace(
				"http://127.0.0.1:8000/oauth/authorize?client_id=98907a23-7b34-4bc0-8220-dc6bf0fbb104&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&response_type=code&scope=&state="+ generateString(40)
			);
		});

		return () => clearTimeout(timeout);
	}, []);
	return <></>;
}

export default Home;
