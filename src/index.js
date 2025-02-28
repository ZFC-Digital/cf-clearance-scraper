const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const authToken = process.env.authToken || null
const cors = require('cors')
const reqValidate = require('./module/reqValidate')

global.browserLength = 0
global.browserLimit = Number(process.env.browserLimit) || 20
global.timeOut = Number(process.env.timeOut || 60000)

app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
if (process.env.NODE_ENV !== 'development') {
    let server = app.listen(port, () => { console.log(`Server running on port ${port}`) })
    try {
        server.timeout = global.timeOut
    } catch (e) { }
}
if (process.env.SKIP_LAUNCH != 'true') require('./module/createBrowser')

const getSource = require('./endpoints/getSource')
const solveTurnstileMin = require('./endpoints/solveTurnstile.min')
const solveTurnstileMax = require('./endpoints/solveTurnstile.max')
const solveRecaptchaV3 = require('./endpoints/solveRecaptcha.v3')
const solveRecaptchaV3Enterprise = require('./endpoints/solveRecaptcha.v3.enterprise')
const wafSession = require('./endpoints/wafSession')


app.post('/cf-clearance-scraper', async (req, res) => {
    try{
        const data = req.body

        const check = reqValidate(data)
    
        if (check !== true) return res.status(400).json({ code: 400, message: 'Bad Request', schema: check })
    
        if (authToken && data.authToken !== authToken) return res.status(401).json({ code: 401, message: 'Unauthorized' })
    
        if (global.browserLength >= global.browserLimit) return res.status(429).json({ code: 429, message: 'Too Many Requests' })
    
        if (process.env.SKIP_LAUNCH != 'true' && !global.browser) return res.status(500).json({ code: 500, message: 'The scanner is not ready yet. Please try again a little later.' })
    
        var result = { code: 500 }
    
        global.browserLength++
    
        switch (data.mode) {
            case "source":
                result = await getSource(data).then(res => { return { source: res, code: 200 } }).catch(err => { return { code: 500, message: err.message } })
                break;
            case "turnstile-min":
                result = await solveTurnstileMin(data).then(res => { return { token: res, code: 200 } }).catch(err => { return { code: 500, message: err.message } })
                break;
            case "turnstile-max":
                result = await solveTurnstileMax(data).then(res => { return { token: res, code: 200 } }).catch(err => { return { code: 500, message: err.message } })
                break;
            case "waf-session":
                result = await wafSession(data).then(res => { return { ...res, code: 200 } }).catch(err => { return { code: 500, message: err.message } })
                break;
            case "recaptcha-v3":
                result = await solveRecaptchaV3(data).then(res => { return { ...res, code: 200 } }).catch(err => { return { code: 500, message: err.message } })
                break;
            case "recaptcha-v3-enterprise":
                    result = await solveRecaptchaV3Enterprise(data).then(res => { return { ...res, code: 200 } }).catch(err => { return { code: 500, message: err.message } })
                    break;
        }
    
        global.browserLength--
    
        res.status(result.code ?? 500).send(result)
    }catch(err){
        res.status(result.code ?? 504).send(result)
    }
    
})

app.use((req, res) => { res.status(404).json({ code: 404, message: 'Not Found' }) })

if (process.env.NODE_ENV == 'development') module.exports = app
process.on('uncaughtException', function (err) {
    console.log(err);
    console.log('No worries,still working on~~~');
});