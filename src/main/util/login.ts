import axios from 'axios'
import RequestHeaderCls from './request-header'
import path from 'path'
import { recognize } from 'node-native-ocr'
import fs from 'fs'
import { BaseUrl, LoginPath, verifyCodePath } from '../config/index'

class Login {
  headerIns: Record<string, any>
  verifyCode: string
  loginData: Record<string, any>

  constructor() {
    this.headerIns = RequestHeaderCls.getIns()
    this.verifyCode = ''
    this.loginData = {}
  }

  async getCookie() {
    const headerRes = await axios({
      methods: 'get',
      url: BaseUrl,
      headers: this.headerIns.getReqCookieHeader()
    })
    // 设置请求头cookie
    this.headerIns.appendHeaderCookie(headerRes.headers['set-cookie'])
  }

  async getVerifyCode() {
    return new Promise<void>(async (resolve) => {
      const captchaUrl = `${BaseUrl}${verifyCodePath}?v=${new Date().getTime()}`
      const captchaPath = path.resolve(__dirname, '../captcha.png')
      const headers = this.headerIns.getRequestHeader()

      const res = await axios.request({
        url: captchaUrl,
        method: 'get',
        responseType: 'stream',
        headers
      })

      // 保存图片到本地
      const writer = fs.createWriteStream(captchaPath)
      res.data.pipe(writer)
      let error = null
      writer.on('error', (err) => {
        error = err
        writer.close()
      })
      writer.on('close', async () => {
        if (!error) {
          const bArr = fs.readFileSync(captchaPath)
          this.verifyCode = await recognize(bArr)
          if (!/^\d{4}$/.test(this.verifyCode)) {
            this.verifyCode = ''
            resolve()
          } else {
            this.headerIns.appendHeaderCookie(res.headers['set-cookie'])
            resolve()
          }
        }
      })
    })
  }

  async login() {
    await this.getCookie()

    while (this.verifyCode === '') {
      await this.getVerifyCode()
    }

    const headers = this.headerIns.getRequestHeader()

    const params = {
      username: 'YTYT1122',
      host: '192.168.3.53',
      action: 'loginMobile',
      secret: 'DZ',
      type: '0',
      random: this.verifyCode,
      lang: 'zh_CN',
      password: 'A2F590D1509F20F010C5A4597DB2E670',
      agent: 'RMB1',
      clientType: '1',
      phoneType: 'Apple iPhone'
    }

    // console.log("登录头", headers)
    // console.log("登录参数", params)

    const url = `${BaseUrl}${LoginPath}`

    try {
      const res = await axios({
        methods: 'get',
        url,
        headers,
        params
      })
      const data = res.data.value
      const loginMessage = JSON.parse(data)
      if (loginMessage) {
        this.loginData = loginMessage
      }
    } catch (e) {
      console.error('Error:', e)
    }
  }

  getLoginData() {
    return this.loginData
  }
}

export default Login
