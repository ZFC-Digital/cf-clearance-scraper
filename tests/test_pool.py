import requests
from loguru import logger
import requests
import time
def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        execution_time = end_time - start_time
        logger.info(f"函数 {func.__name__} 执行时间: {execution_time:.2f} 秒")
        return result
    return wrapper
@timer_decorator
def get_cf_token(site='https://testnet.monad.xyz/',siteKey='0x4AAAAAAA-3X4Nd7hf3mNGx',method="turnstile-min",url='http://127.0.0.1:3000/cf-clearance-scraper',authToken=None,action=None,maxSize=10):
    data = {
            "url": site,
            "siteKey": siteKey,
            "mode": method
        }
    if authToken:
        data.update({
            "authToken": authToken,
        })
    if maxSize:
        data.update({
            "maxSize": maxSize
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
def create_cf_page_pool(site='https://testnet.monad.xyz/',siteKey='0x4AAAAAAA-3X4Nd7hf3mNGx',method="turnstile-min",url='http://127.0.0.1:3000/cf-clearance-scraper/addPagePool',authToken=None,action=None,maxSize=10):
    data = {
            "url": site,
            "siteKey": siteKey,
            "mode": method
        }
    if authToken:
        data.update({
            "authToken": authToken,
        })
    if maxSize:
        data.update({
            "maxSize": maxSize
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
        logger.success(f"create_cf_page_pool成功")
        return result
    except requests.RequestException as e:
        logger.exception(f"请求过程中发生错误: {e}")
def remove_cf_page_pool(site='https://testnet.monad.xyz/',siteKey='0x4AAAAAAA-3X4Nd7hf3mNGx',method="turnstile-min",url='http://127.0.0.1:3000/cf-clearance-scraper/removePagePool',authToken=None,action=None):
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
        logger.success(f"remove_cf_page_pool成功")
        return result
    except requests.RequestException as e:
        logger.exception(f"请求过程中发生错误: {e}")
# pool=create_cf_page_pool(maxSize=5)
# print(pool)
# start_time = time.time()
# for i in range(100):
    
#     token=get_cf_token()
#     print(i,token)
# end_time = time.time()
# execution_time = end_time - start_time
# print(f"函数执行时间: {execution_time:.2f} 秒")
# 多线程
from concurrent.futures import ThreadPoolExecutor,as_completed
def get_cf_token_wrapper(index):
    token=get_cf_token(maxSize=5)
    logger.info(f"get_cf_token_wrapper {index} {token}")
    return 
start_time = time.time()
with ThreadPoolExecutor(max_workers=5) as executor:
    results = [executor.submit(get_cf_token_wrapper,i) for i in range(10)]
    for future in as_completed(results):
        future.result()
end_time = time.time()
execution_time = end_time - start_time
print(f"函数执行时间: {execution_time:.2f} 秒")
# print(remove_cf_page_pool())
