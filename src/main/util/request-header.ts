import { BaseUrl } from '../config/index'

class RequestHeader {
    static getIns() {
        if(!RequestHeader.instance) {
            RequestHeader.instance = new RequestHeader()
        }
        return RequestHeader.instance
    }
    constructor() {
        this.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
        // 用来请求cookie的header
        this.initHeader = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Priority": "u=0, i",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": this.userAgent
        }
        this.header = {
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
            "Cookie": '',
            "Pragma": "no-cache",
            "Priority": "i",
            "Referer": BaseUrl,
            "Sec-Fetch-Dest": "image",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": this.userAgent
        }
    }

    appendHeaderCookie(rawCookies) {
        const cookies = this.parseCookies(rawCookies)
        this.header['Cookie'] += this.serializeCookies(cookies)
    }

    getReqCookieHeader() {
        return this.initHeader
    }

    getRequestHeader() {
        return this.header
    }

    getUserAgent() {
        return this.userAgent
    }

    // 解析cookie
    parseCookies(rawCookies) {
        // 使用正则表达式匹配所有的cookie项  
        const cookieRegex = /(?:(?!\b(?:Domain|Secure|Path|Expires|SameSite|HttpOnly)\b)[^;]+(?=[^;]+)?);?/g;
        let cookies = {};
        let match;

        // 遍历所有的匹配项  
        while ((match = cookieRegex.exec(rawCookies))) {
            // 提取cookie名和值  
            const cookieParts = match[0].trim().split('=');
            const name = cookieParts.shift();
            const value = cookieParts.join('=');

            // 将cookie名和值存入对象中，如果已存在则覆盖  
            cookies[name] = value;
        }

        return cookies;
    }

    // 序列化cookie
    serializeCookies(cookiesObj) {
        let s = ''
        Object.keys(cookiesObj).forEach(k => {
            s += `${k}=${cookiesObj[k]};`
        })
        return s;
    }
}

export default RequestHeader