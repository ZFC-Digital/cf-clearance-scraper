# CF Clearance Scraper

[Disclosure]
- Cloudflare no longer offers the Turnstile token with input on some sites. For this reason, some sites may have problems in getting Turnstile token.
- If you still see waf when you send a request with the received header information, there is probably tls fingerprint protection on the site. You can send your requests with such libraries. https://www.npmjs.com/package/cycletls
- If you are having problems, please delete the local image completely and install the latest image


[UPDATE] You can now get a Turnstile Captcha token. It will return it in 5 seconds on average.

This package provides an api that returns cookies (cf-clearance) that you can request on a website protected by Cloudflare WAF (corporate or normal) without being blocked by WAF.

When checking your requests, Cloudflare does not only check the Cookie. It also checks IP and User Agent. For this reason, you should send your requests by setting User Agent, IP and Cookie. If you add the headers object in the response directly to the headers of your request, your request will be successful. Tested on sites protected with Cloudflare enterprise plan.

Cookies with cf in the name belong to Cloudflare. You can find out what these cookies do and how long they are valid by **[Clicking Here](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/)**.

## Installation

Installation with Docker is recommended.

**Docker**

```bash

docker run -d -p 3000:3000 \
-e PORT=3000 \
-e browserLimit=20 \
-e timeOut=30000 \
zfcsoftware/cf-clearance-scraper:latest

```
**Github**

```bash
git clone https://github.com/zfcsoftware/cf-clearance-scraper
cd cf-clearance-scraper
npm install
npm run start
```

## Usage

It is not recommended to change the user agent information. You will be returned the User Agent information used when scraping.

```js
    fetch('http://localhost:3000/cf-clearance-scraper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // authToken: 'test', // Not mandatory. Checked if the env variable is set.
            url: 'https://nopecha.com/demo/cloudflare', // Link to engrave
            mode:"waf", // gets waf or captcha values
            // agent: null,
            // defaultCookies: [],
            // Proxy information (not mandatory)
            // proxy: {
            //     host: '1.1.1.1',
            //     port: '1111',
            //     username: 'test',
            //     password: 'test'
            // }
        })
    }).then(res => res.json()).then(console.log).catch(console.error)
```

**Variables**

*Request Body*

**authToken** If set to env, it is checked to keep the API secure. If it is not set to private, it does not need to be sent.

**url** Refers to the URL address to be scraped. You must send the exact link where you are stuck in WAF. If WAF does not exit, if the site uses Cloudflare, it will still successfully return the relevant Cookie.

**agent** Allows you to change your User Agent information. It is not recommended to change it. Using the default is safe and guaranteed. The default User Agent information is returned at the end of the request.

**proxy** Host, Port, Username and Password information is sent by the Proxy you send. Sending is not mandatory.

**defaultCookies** Puppeteer allows you to use your pre-existing cookies. If you send the cookies you received with page.cookies, it starts the process with them.

**mode** takes waf or captcha values. If waf is sent, it gets and returns the waf cookies, you can send a request directly with the returned header. If captcha is set, the turnstile on the page decodes the captcha and returns the token.

*ENV*

**browserLimit** Allows you to set the maximum number of browsers that can be opened at the same time. The default is 20. If exceeded, api will return error code 429.

**timeOut** Sets the maximum time a transaction will take. The default is 30000. Must be given in milliseconds.

**authToken** Not mandatory. If not set, all requests are allowed. If set, the request must be sent with the authToken variable in the request body.

**PORT** The default is 3000. It is not recommended to change it.


Sample WAF Response

```js
  {
    "code": 200,
    "cookies": [
        {
            "name": "cf_clearance",
            "value": "NOA3tAWyodzOAb8X3Ae3R5UFTIvvGflfnQaboTKJwZ8-1716899254-1.0.1.1-x18bw9OFEDYSLDNSXZY3E9huAowzZXX0qhd3n7_PnwsqtVSJi6JII7DZ_sBXVpS1drLeAOhaUIbMDYq4vbkBnA",
            "domain": ".nopecha.com",
            "path": "/",
            "expires": 1748435257.058819,
            "size": 161,
            "httpOnly": true,
            "secure": true,
            "session": false,
            "sameSite": "None",
            "priority": "Medium",
            "sameParty": false,
            "sourceScheme": "Secure",
            "partitionKey": "https://nopecha.com"
        }
    ],
    "agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "proxy": {},
    "url": "https://nopecha.com/demo/cloudflare",
    "headers": {
        "accept-language": "en-US,en;q=0.9",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "host": "nopecha.com",
        "sec-ch-ua-arch": "\"x86\"",
        "sec-ch-ua-bitness": "\"64\"",
        "sec-ch-ua-full-version": "\"124.0.6367.201\"",
        "sec-ch-ua-full-version-list": "\"Not-A.Brand\";v=\"99.0.0.0\", \"Chromium\";v=\"124.0.6367.201\"",
        "sec-ch-ua-model": "\"\"",
        "sec-ch-ua-platform-version": "\"6.5.0\"",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://nopecha.com",
        "referer": "https://nopecha.com/demo/cloudflare?__cf_chl_tk=zBTFi8_2iwW24b49NbcAZtppcSPfJhNgEqt31K4DpbM-1716899254-0.0.1.1-1365",
        "cookie": "cf_clearance=NOA3tAWyodzOAb8X3Ae3R5UFTIvvGflfnQaboTKJwZ8-1716899254-1.0.1.1-x18bw9OFEDYSLDNSXZY3E9huAowzZXX0qhd3n7_PnwsqtVSJi6JII7DZ_sBXVpS1drLeAOhaUIbMDYq4vbkBnA"
    }
}
```

Sample Captcha Response

```js
{
    "code": 200,
    "cookies": [],
    "agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "proxy": {},
    "url": "https://nopecha.com/demo/cloudflare",
    "headers": {
        "accept-language": "en-US,en;q=0.9",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "host": "nopecha.com"
    },
    "turnstile": {
        "token": "0.arxps90V2kIu__GmCYA_vnGaDrxxlpLLTxSapYw1HWAwePtX0gUiuI6x-04vg-h2GO0UTGfaBAFFlEvaKK2N-I8iFnWdXuMiwNDxdVI9HfOViAHdQyXo0SPXX_JjyKFzPMZC1ITEPrrgamRreQJYcqDFziyHguLgNAG_gIxGHyH14sOH9C-4s5MP0PGyxOZ2lIu-HTfSCWNPKsDp2XXU86fg8dpNsEAr-iZKvfeIDCFiDHJMAxCIbUHSECmuI6OvNbnThgrLBmXPoKeeXaFSsca2uAuifgREIOqkYiu01Z1taqkbHi5XPOkzGDPV9j28gfgA4Kw9toDw1LRLOCXMlA3UlLDGdCWczzB1heL2k9TjktFOY_IuXatphuDb25BEtt8IkX6f5nD8510hSiW1AaT19tgg8lJX9NOFEbRzpzp5VM5wzwhuNXuVWz0rWDDR.T1e1PogmtR4GZuk3nFmsXw.c6e5f9f47a81c53accd6ae5ad1761be39d3bcc566304fef659d96a56c329e719"
    }
}
```

## Support us

Please star the repo to help this open source project get updates. Your star will help us a lot.

## Disclaimer of Liability

This library has been created for testing and educational purposes. The user is responsible for any problems that may arise. You can start a discussion for any problems you are experiencing, but you should avoid messages that will disturb or force the developer. This project is completely open source. Please support it with a star rating.
