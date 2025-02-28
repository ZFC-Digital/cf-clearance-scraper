function getSource({ url, proxy,callback,axios }) {
    return new Promise(async (resolve, reject) => {

        if (!url) return reject('Missing url parameter')
        const context = await global.browser.createBrowserContext().catch(() => null);
        if (!context) return reject('Failed to create browser context')

        let isResolved = false

        const { proxyRequest } = await import('puppeteer-proxy')

        var cl = setTimeout(async () => {
            if (!isResolved) {
                await context.close()
                reject("Timeout Error")
            }
        }, (global.timeOut || 60000))

        try {
            const page = await context.newPage();
            await page.setRequestInterception(true);
            page.on('request', async (request) => {
                try {
                    if (proxy) {
                        await proxyRequest({
                            page,
                            proxyUrl: `http://${proxy.username ? `${proxy.username}:${proxy.password}@` : ""}${proxy.host}:${proxy.port}`,
                            request,
                        });
                    } else {
                        request.continue()
                    }
                } catch (e) { }
            });
            page.on('response', async (res) => {
                try {
                    // if ([200, 302].includes(res.status()) && [url, url + '/'].includes(res.url())) {
                    if (true) {   
                        await page.waitForNavigation({ waitUntil: 'load', timeout: 5000 }).catch(() => { });
                        if (axios){
                            //读取src\data\axios.min.js
                            const axios = await fs.readFileSync(path.join(__dirname, '../src/data/axios.min.js'), 'utf8')
                            //在页面中执行axios.min.js
                            await page.evaluate(axios)
                        }
                        const html = await page.content();
                        if(callback){
                            //在页面中执行callback()
                            await page.evaluate(eval(callback))
                            //等待id为status的元素加载
                            await page.waitForSelector('#status', { timeout: 60000 })
                            //获取id为status的元素的文本
                            const text = await page.$eval('#status', el => el.innerText)
                            //返回执行结果
                            await context.close()
                            isResolved = true
                            clearInterval(cl)
                            resolve(text)
                        }else{
                            await context.close()
                            isResolved = true
                            clearInterval(cl)
                            //控制台执行callback
                            
                            resolve(html)
                        }
                        
                    }
                } catch (e) { }
            })
            await page.goto(url, {
                waitUntil: 'domcontentloaded'
            })
        } catch (e) {
            if (!isResolved) {
                await context.close()
                clearInterval(cl)
                reject(e.message)
            }
        }

    })
}
module.exports = getSource