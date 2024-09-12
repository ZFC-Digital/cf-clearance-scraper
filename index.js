const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    authToken = process.env.authToken || null,
    scrape = require('./module/scrape'),
    cors = require('cors')


global.browserLength = 0
global.browserLimit = process.env.browserLimit || 20
global.timeOut = process.env.timeOut || 30000

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

app.listen(port, () => { console.log(`Server running on port ${port}`) })

app.post('/cf-clearance-scraper', async (req, res) => {

    if (authToken && req.body.authToken !== authToken) return res.status(401).json({ code: 401, message: 'Unauthorized' })

    if (global.browserLength >= global.browserLimit) return res.status(429).json({ code: 429, message: 'Too Many Requests' })

    var response = await scrape({
        proxy: req.body['proxy'],
        agent: req.body['agent'],
        url: req.body['url'],
        defaultCookies: req.body['defaultCookies'],
        mode: (req.body['mode'] && req.body['mode'] == 'captcha') ? 'captcha' : 'waf',
        // blockMedia: req.body['blockMedia']
    }).catch(err => { return { code: 500, message: err.message } })

    res.send(response)
})

app.use((req, res) => { res.status(404).json({ code: 404, message: 'Not Found' }) })
