curl -L https://github.com/854771076/cf-clearance-scraper/archive/refs/heads/master.zip -o cf-clearance-scraper-main.zip
unzip cf-clearance-scraper-main.zip
cd cf-clearance-scraper-main

# 构建镜像
docker build -t captcha_cracker .

# 运行容器
docker run -d --restart unless-stopped -p 3000:3000 \
    -e PORT=3000 \
    -e browserLimit=20 \
    -e timeOut=60000 \
    -e authToken=authToken123456 \
    captcha_cracker
