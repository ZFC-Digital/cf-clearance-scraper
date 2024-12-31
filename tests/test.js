fetch('http://localhost:3000/cf-clearance-scraper', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        url: "https://nextcaptcha.com/zh/demo/recaptcha_v3",
        siteKey: "6LcVYwIqAAAAAL0eGyLRnmbBmqUmjix5uAeRIrle",
        mode: "recaptcha-v3",
        // proxy: {
        //     host: '127.0.0.1',
        //     port: 3000,
        //     username: 'username',
        //     password: 'password'
        // }
    })
})
    .then(async (res) => {
        // Handle response and get the JSON token
        const jsonResponse = await res.json(); // Await JSON response
        console.log(jsonResponse); // Log the full response for debugging
        const token = jsonResponse.token; // Extract token from the response
        const data=JSON.stringify({
            siteKey: "6LcVYwIqAAAAAL0eGyLRnmbBmqUmjix5uAeRIrle",
            gRecaptchaResponse: token
        })
        console.log(data)
        // Now use the token to make the next request
        return fetch("https://next.nextcaptcha.com/api/captcha-demo/recaptcha_v2/verify?", {
            method: "POST",
            headers: {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"130\", \"Microsoft Edge\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": "https://nextcaptcha.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: data
        })
        .then(async (verifyRes) => {
            const verifyJson = await verifyRes.json(); // Await JSON response
            console.log(verifyJson); // Log the verify response
        })
        .catch(error => {
            console.error('Error during captcha verification:', error);
        });
    })
    .catch(error => {
        console.error('Error during initial scraper request:', error);
    });
