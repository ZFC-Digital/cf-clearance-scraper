const {getPageTurnstileMin,solveTurnstileMin} = require('../endpoints/solveTurnstile.min')
//page缓存pool对象,page对象(标记为可用状态)
class Page {
    
    constructor(page) {
        this.page = page;
        this.available = true;
    }
    // setAvailable(),设置page的可用状态
    setAvailable(available) {
        this.available = available;
    }
    // isAvailable(),返回page的可用状态
    isAvailable() {
        return this.available;
    }

}
class PagePool {
    constructor(params) {
        this.params = params;
        this.type = params.mode;
        this.maxSize = params.maxSize;
        this.pool = [

        ];
        
        
    }
    // getPage(),如果pool中有可用的page,则返回一个可用的page,否则阻塞等待
    async usePage(callback) {
        while (true) {
            for (let i = 0; i < this.pool.length; i++) {
                if (this.pool[i].isAvailable()) {
                    this.pool[i].setAvailable(false);
                    const data=await callback(this.pool[i].page)
                    this.pool[i].setAvailable(true);
                    return data
                }
            }
            //间隔0.1s
            await new Promise(resolve => setTimeout(resolve, 100));
            
        
        } 
    }
    // addPage(),添加一个page到pool中
    addPage(page) {
        if (this.pool.length < this.maxSize) {
            this.pool.push(new Page(page));
            global.browserLength++
        }
    }
    //初始化pool
    async initPool() {
        for (let i = 0; i < this.maxSize; i++) {

            //类型有turnstile-min,turnstile-max,recaptcha-v3,recaptcha-v3-enterprise
            if (this.type === 'turnstile-min') {
                const page=await getPageTurnstileMin(this.params)
                this.addPage(page);
            }
        } 
    }
    // removePage(),从pool中删除一个page
    removePage(page) {
        for (let i = 0; i < this.pool.length; i++) {
            if (this.pool[i].getPage() === page) {
                this.pool.splice(i, 1);
                global.browserLength--
                break; 
            } 
        }  
    }


}
//PagePoolManager对象,管理url对应的pagePool
class PagePoolManager {
    constructor() {
        this.poolMap = new Map();
    }
    // getPagePool(),返回一个url对应的pagePool
    getPagePool(url) {
        if (this.poolMap.has(url)) {
            return this.poolMap.get(url);
        } else {
            return null;
        }
    }
    // addPagePool(),添加一个url对应的pagePool
    async addPagePool(params) {
        if (this.poolMap.has(params.url)) {
            return null
        } else {
            const pagePool = new PagePool(params);
            await pagePool.initPool();
            this.poolMap.set(params.url, pagePool);
            return true
        }
            
    }
    // removePagePool(),删除一个url对应的pagePool
    async removePagePool(params) {
        if (this.poolMap.has(params.url)) {
            const pagePool = this.poolMap.get(params.url);
            for (let i = 0; i < pagePool.pool.length; i++) {
                const page = pagePool.pool[i];
                await page.page.close();
            }
            this.poolMap.delete(params.url);
            return true
        } else {
            return null
        }
    }
}
async function createPagePoolManager() {
    try {
        if (global.finished == true) return

        global.page_pool_manager = null

        console.log('Launching the page_pool_manager...');

        global.page_pool_manager = new PagePoolManager();

        global.page_pool_manager = page_pool_manager;

    } catch (e) {
        console.log(e.message);
        if (global.finished == true) return
        await new Promise(resolve => setTimeout(resolve, 3000));
        await createPagePoolManager();
    }
}
createPagePoolManager()

