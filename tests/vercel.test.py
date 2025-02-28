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
def get_source(source_url,method="vercel",url='http://127.0.0.1:3000/cf-clearance-scraper',authToken=None,proxy=None):
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

get_source('http://testnet.monad.xyz/',"vercel")