const { connect } = require("puppeteer-real-browser")
async function createBrowser() {
    try {
        if (global.finished == true) return

        global.browser = null

        // console.log('Launching the browser...');

        const { browser } = await connect({
            headless: process.env.HEADLESS == "true",
            turnstile: true,
            connectOption: { defaultViewport: null },
            disableXvfb: false,
        })

        // console.log('Browser launched');

        global.browser = browser;

        browser.on('disconnected', async () => {
            if (global.finished == true) return
            console.log('Browser disconnected');
            await new Promise(resolve => setTimeout(resolve, 3000));
            await createBrowser();
        })

    } catch (e) {
        console.log(e.message);
        if (global.finished == true) return
        await new Promise(resolve => setTimeout(resolve, 3000));
        await createBrowser();
    }
}
createBrowser()
