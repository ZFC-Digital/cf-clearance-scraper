# CF Clearance Scraper

### 请我喝杯咖啡
ETH 0x72691a36ed1fac3b197fb42612dc15a8958bf9f2


This library was created for testing and training purposes to retrieve the page source of websites, create Cloudflare Turnstile tokens and create Cloudflare WAF sessions.

Cloudflare protection not only checks cookies in the request. It also checks variables in the header. For this reason, it is recommended to use it with the sample code in this readme file.

Cookies with cf in the name belong to Cloudflare. You can find out what these cookies do and how long they are valid by **[Clicking Here](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/)**.

## Sponsor

[![Capsolver](src/data/capsolver.png)](https://www.capsolver.com/?utm_source=github&utm_medium=repo&utm_campaign=scraping&utm_term=cf-clearance-scraper)

## Installation

Installation with Docker is recommended.

**Docker**

Please make sure you have installed the latest image. If you get an error, try downloading the latest version by going to Docker Hub.

```bash
sudo docker rmi zfcsoftware/cf-clearance-scraper:latest --force
```

```bash
docker run -d -p 3000:3000 \
-e PORT=3000 \
-e browserLimit=20 \
-e timeOut=60000 \
zfcsoftware/cf-clearance-scraper:latest
```

**Github**

```bash
git clone https://github.com/zfcsoftware/cf-clearance-scraper
cd cf-clearance-scraper
npm install
npm run start
```

## Create Cloudflare WAF Session

By creating a session as in the example, you can send multiple requests to the same site without being blocked. Since sites may have TLS protection, it is recommended to send requests with the library in the example.

```js
const initCycleTLS = require('cycletls');
async function test() {
    const session = await fetch('http://localhost:3000/cf-clearance-scraper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: 'https://nopecha.com/demo/cloudflare',
            mode: "waf-session",
            // proxy:{
            //     host: '127.0.0.1',
            //     port: 3000,
            //     username: 'username',
            //     password: 'password'
            // }
        })
    }).then(res => res.json()).catch(err => { console.error(err); return null });

    if (!session || session.code != 200) return console.error(session);

    const cycleTLS = await initCycleTLS();
    const response = await cycleTLS('https://nopecha.com/demo/cloudflare', {
        body: '',
        ja3: '772,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,23-27-65037-43-51-45-16-11-13-17513-5-18-65281-0-10-35,25497-29-23-24,0', // https://scrapfly.io/web-scraping-tools/ja3-fingerprint
        userAgent: session.headers["user-agent"],
        // proxy: 'http://username:password@hostname.com:443',
        headers: {
            ...session.headers,
            cookie: session.cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
        }
    }, 'get');

    console.log(response.status);
    cycleTLS.exit().catch(err => { });
}
test()
```

## Create Turnstile Token with Little Resource Consumption

This endpoint allows you to generate tokens for a Cloudflare Turnstile Captcha. It blocks the request that fetches the page resource and instead makes the page resource a simple Turnstile render page. This allows you to generate tokens without having to load any additional css or js files. 

However, in this method, the siteKey variable must be sent to Turnstile along with the site to create the token. If this does not work, you can examine the token generation system by loading the full page resource described in the next section.

```js
fetch('http://localhost:3000/cf-clearance-scraper', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        url: 'https://turnstile.zeroclover.io/',
        siteKey: "0x4AAAAAAAEwzhD6pyKkgXC0",
        mode: "turnstile-min",
        // proxy:{
        //     host: '127.0.0.1',
        //     port: 3000,
        //     username: 'username',
        //     password: 'password'
        // }
    })
})
    .then(res => res.json())
    .then(console.log)
    .catch(console.log);
```

## Creating Turnstile Token with Full Page Load

This example request goes to the page at the given url address with a real browser, resolves the Turnstile and returns you the token.

```js
fetch('http://localhost:3000/cf-clearance-scraper', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        url: 'https://turnstile.zeroclover.io/',
        mode: "turnstile-max",
        // proxy:{
        //     host: '127.0.0.1',
        //     port: 3000,
        //     username: 'username',
        //     password: 'password'
        // }
    })
})
    .then(res => res.json())
    .then(console.log)
    .catch(console.log);
```

## Getting Page Source from a Site Protected with Cloudflare WAF

With this request you can scrape the page source of a website protected with CF WAF.

```js
fetch('http://localhost:3000/cf-clearance-scraper', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        url: 'https://nopecha.com/demo/cloudflare',
        mode: "source"
        // proxy:{
        //     host: '127.0.0.1',
        //     port: 3000,
        //     username: 'username',
        //     password: 'password'
        // }
    })
})
    .then(res => res.json())
    .then(console.log)
    .catch(console.log);
```

## Quick Questions and Answers

### Does It Open A New Browser On Every Request?
No, a new context is started with each request and closed when the job is finished. Processes are executed with isolated contexts through a single browser.

### How Do I Limit the Browser Context to Open?
You can do this by changing the process.env.browserLimit value. The default is 20

### How Do I Add Authentication to Api?
You can add authorisation by changing the process.env.authToken variable. If this variable is added, it returns 401 if the authToken variable in the request body is not equal to the token you specify.

### How Do I Set The Timeout Time?
You can give the variable process.env.timeOut a value in milliseconds. The default is 60000.

## Disclaimer of Liability
This repository was created purely for testing and training purposes. The user is responsible for any prohibited liability that may arise from its use.
The library is not intended to harm any site or company. The user is responsible for any damage that may arise. 
Users of this repository are deemed to have accepted this disclaimer. 
