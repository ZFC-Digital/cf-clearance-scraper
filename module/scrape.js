const browserCreator = require('./browser');


function checkTimeOut(startTime, endTime = new Date().getTime()) {
    return (endTime - startTime) > global.timeOut
}


function formatLanguage(languages) {
    var str = ''
    if (languages.length == 1) return languages[0]
    if (languages[0]) str += `${languages[0]},${languages[1]};q=0.9`
    if (languages[2]) str += `,${languages[2]};q=0.8`
    if (languages[3]) str += `,${languages[3]};q=0.7`
    return str
}

const scrape = async ({ proxy = {},
    agent = null,
    url = 'https://nopecha.com/demo/cloudflare',
    defaultCookies = false,
    mode = 'waf', // or captcha
    // blockMedia = false
}) => {
    return new Promise(async (resolve, reject) => {
        global.browserLength++
        var brw = null,
            startTime = new Date().getTime(),
            headers = {}
        try {
            setTimeout(() => {
                global.browserLength--
                try { brw.close() } catch (err) { }
                return resolve({ code: 500, message: 'Request Timeout' })
            }, global.timeOut);
            var { page, browser } = await browserCreator({ proxy, agent })

            brw = browser

            try { if (defaultCookies) await page.setCookie(...defaultCookies) } catch (err) { }

            var browserLanguages = await page.evaluate(() => navigator.languages);

            headers['accept-language'] = formatLanguage(browserLanguages)

            // await page.setExtraHTTPHeaders({
            //     'accept-language': headers['accept-language']
            // });

            if (!agent) agent = await page.evaluate(() => navigator.userAgent);


            await page.setRequestInterception(true);

            page.on('request', (request) => {
                request.continue();
                if (request.url() === url) {
                    const reqHeaders = request.headers();
                    delete reqHeaders['cookie'];
                    headers = { ...headers, ...reqHeaders, host: new URL(url).hostname };
                }
            });



            page.on('response', async (response) => {
                if (response.url().includes('/verify/turnstile') && mode == 'captcha') {
                    try {
                        const responseBody = await response.json();
                        if (responseBody && responseBody.token) {
                            var cookies = await page.cookies()
                            global.browserLength--
                            try { browser.close() } catch (err) { }
                            resolve({ code: 200, cookies, agent, proxy, url, headers, turnstile: responseBody })
                        }
                    } catch (err) { }
                } else if (mode == 'captcha') {
                    var checkToken = await page.evaluate(() => {
                        var cfItem = document.querySelector('[name="cf-turnstile-response"]')
                        return cfItem && cfItem.value && cfItem.value.length > 0 ? cfItem.value : false
                    }).catch(err => { return false })
                    if (checkToken) {
                        var cookies = await page.cookies()
                        global.browserLength--
                        try { browser.close() } catch (err) { }
                        return resolve({ code: 200, cookies, agent, proxy, url, headers, turnstile: { token: checkToken } })
                    }
                }
            });

            page.goto(url).catch(err => { })
            await page.waitForSelector('body', { timeout: 20000 }).catch(err => { })
            if (mode == 'captcha') return

            var cookies = false

            while (!cookies) {
                try {
                    cookies = await page.cookies()
                    if (!cookies.find(cookie => cookie.name === 'cf_clearance')) cookies = false
                } catch (err) { cookies = false }
                await new Promise(resolve => setTimeout(resolve, 50))
                if (checkTimeOut(startTime)) {
                    await browser.close()
                    global.browserLength--
                    return resolve({ code: 500, message: 'Request Timeout' })
                }
            }

            headers['cookie'] = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')

            await browser.close()
            global.browserLength--

            return resolve({ code: 200, cookies, agent, proxy, url, headers })

        } catch (err) {
            global.browserLength--
            try { brw.close() } catch (err) { }
            return resolve({ code: 500, message: err.message })
        }
    })
}


module.exports = scrape;