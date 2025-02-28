import requests
from loguru import logger
import requests
import secrets,json
def get_cf_token(site='https://testnet.monad.xyz/',siteKey='0x4AAAAAAA-3X4Nd7hf3mNGx',method="turnstile-min",url='http://127.0.0.1:3000/cf-clearance-scraper',authToken=None,action=None):
    data = {
            "url": site,
            "siteKey": siteKey,
            "mode": method
        }
    if authToken:
        data.update({
            "authToken": authToken,
        })

    if action:
        data.update({
            "action": action
        })
        
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # 检查请求是否成功
        result = response.json()
        logger.success(f"请求cf_token成功")
        return result["token"]
    except requests.RequestException as e:
        logger.exception(f"请求过程中发生错误: {e}")
def get_source(source_url,method="source",url='http://127.0.0.1:3000/cf-clearance-scraper',authToken=None,proxy=None,callback=None,axios=False):
    data = {
            "url": source_url,
            "mode": method,
        }
    if authToken:
        data.update({
            "authToken": authToken,
        })  
    if proxy:
        data.update({
            "proxy": proxy
        }) 
    if callback:
        data.update({
            "callback": callback
        }) 
    if axios:
        data.update({
            "axios": axios
        })
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # 检查请求是否成功
        logger.success(f"请求成功,{response.text}")
        return response.text
    except requests.RequestException as e:
        logger.exception(f"请求过程中发生错误: {e}")    

wallet='0x1Cf16Fe0E2CAFeDE8753Fd4AEEb427E8F0Db77d4'
visitor_id = secrets.token_hex(16)
token=get_cf_token()
proxy={
    'username':'xxx',
    'password':'xxx',
    'host':'xx',
    'port':813
}
# JavaScript 代码
data = {
    "address": wallet,
    "visitorId": visitor_id,
    "cloudFlareResponseToken": token
}

# 使用 json.dumps() 生成正确的 JSON 字符串
json_data = json.dumps(data)

# 为成功和失败状态的 div 分别定义 id
div_id = "status"
data=f'''
const proxy = {proxy};
const json_data={data}

'''
# 使用 f - 字符串构建回调函数
callback = '''
()=>{
    %s
    // 请求配置
    const requestConfig = {
      url: 'https://testnet.monad.xyz/api/claim',
      method: 'post',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Origin': 'https://testnet.monad.xyz',
        'Pragma': 'no-cache',
        'Referer': 'https://testnet.monad.xyz/'
      },
      data: JSON.stringify(json_data), // 请求体数据
      proxy: proxy, // 代理配置
    };

    // 发送请求
    axios(requestConfig).then(response => {
        // 处理响应
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('请求失败');
        }
    })
    .then(data => {
        // 新增一个 div 元素来记录执行状态，并设置 id
        const statusDiv = document.createElement('div');
        statusDiv.id = "claim_status";
        statusDiv.textContent = '请求成功，响应数据：' + JSON.stringify(data);
        console.log(statusDiv.textContent)
        document.body.appendChild(statusDiv);
    })
    .catch(error => {
        // 新增一个 div 元素来记录错误状态，并设置 id
        const statusDiv = document.createElement('div');
        statusDiv.id = "claim_status";
        statusDiv.textContent = '请求失败，错误信息：' + error.message;
        console.log(statusDiv.textContent)
        document.body.appendChild(statusDiv);
    });
}
'''%(data)

print(callback)
get_source('http://testnet.monad.xyz/',callback=callback,proxy=proxy,axios=True)