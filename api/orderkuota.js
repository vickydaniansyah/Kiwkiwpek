const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { URLSearchParams } = require('url');
const crypto = require("crypto");
const QRCode = require('qrcode');
const { ImageUploadService } = require('node-upload-images');

// CLASS OrderKuota
class OrderKuota {
  static API_URL = 'https://app.orderkuota.com/api/v2';
  static API_URL_ORDER = 'https://app.orderkuota.com/api/v2/order';
  static HOST = 'app.orderkuota.com';
  static USER_AGENT = 'okhttp/4.12.0';
  
  // Random semua parameter statis
  static getRandomAppVersion() {
    const versions = ['25.08.11', '25.07.15', '25.06.20', '25.05.18', '24.12.10'];
    return versions[Math.floor(Math.random() * versions.length)];
  }
  
  static getRandomAppCode() {
    const codes = ['250811', '250715', '250620', '250518', '241210'];
    return codes[Math.floor(Math.random() * codes.length)];
  }
  
  static generateRegId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let regId = '';
    for (let i = 0; i < 95; i++) {
      regId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return regId + ':APA91bF' + Math.random().toString(36).substring(2, 15);
  }
  
  static generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  static getRandomPhoneModel() {
    const models = [
      'SM-G960N', 'SM-G965N', 'SM-N960F', 'SM-G973F', 'SM-G975F',
      'SM-A515F', 'SM-A525F', 'SM-A125F', 'Redmi Note 10', 'Redmi Note 11',
      'POCO F3', 'POCO X3', 'iPhone12,1', 'iPhone13,2'
    ];
    return models[Math.floor(Math.random() * models.length)];
  }
  
  static getRandomAndroidVersion() {
    const versions = ['9', '10', '11', '12', '13'];
    return versions[Math.floor(Math.random() * versions.length)];
  }

  constructor(username = null, authToken = null) {
    this.username = username;
    this.authToken = authToken;
    this.sessionId = Math.random().toString(36).substring(7);
  }

  async loginRequest(username, password) {
    const payload = new URLSearchParams({
      username,
      password,
      request_time: Date.now(),
      app_reg_id: OrderKuota.generateRegId(),
      phone_android_version: OrderKuota.getRandomAndroidVersion(),
      app_version_code: OrderKuota.getRandomAppCode(),
      phone_uuid: OrderKuota.generateUuid(),
      phone_model: OrderKuota.getRandomPhoneModel(),
      app_version_name: OrderKuota.getRandomAppVersion(),
      session_id: this.sessionId
    });
    
    return await this.request('POST', `${OrderKuota.API_URL}/login`, payload, {
      'User-Agent': `${OrderKuota.USER_AGENT} (${OrderKuota.getRandomPhoneModel()}; Android ${OrderKuota.getRandomAndroidVersion()})`,
      'X-Request-Id': Math.random().toString(36).substring(2, 15)
    });
  }

  async getAuthToken(username, otp) {
    const payload = new URLSearchParams({
      username,
      password: otp,
      request_time: Date.now(),
      app_reg_id: OrderKuota.generateRegId(),
      phone_android_version: OrderKuota.getRandomAndroidVersion(),
      app_version_code: OrderKuota.getRandomAppCode(),
      phone_uuid: OrderKuota.generateUuid(),
      phone_model: OrderKuota.getRandomPhoneModel(),
      app_version_name: OrderKuota.getRandomAppVersion(),
      session_id: this.sessionId
    });
    
    return await this.request('POST', `${OrderKuota.API_URL}/login`, payload, {
      'User-Agent': `${OrderKuota.USER_AGENT} (${OrderKuota.getRandomPhoneModel()}; Android ${OrderKuota.getRandomAndroidVersion()})`,
      'X-Request-Id': Math.random().toString(36).substring(2, 15)
    });
  }

  // Mutasi QRIS
  async getTransactionQris(type = '', userId = null) {
    if (!userId && this.authToken) {
      userId = this.authToken.split(':')[0];
    }
    
    const payload = new URLSearchParams({
      request_time: Date.now(),
      app_reg_id: OrderKuota.APP_REG_ID,
      phone_android_version: OrderKuota.PHONE_ANDROID_VERSION,
      app_version_code: OrderKuota.APP_VERSION_CODE,
      phone_uuid: OrderKuota.PHONE_UUID,
      auth_username: this.username,
      auth_token: this.authToken,
      'requests[qris_history][jumlah]': '',
      'requests[qris_history][jenis]': type,
      'requests[qris_history][page]': '1',
      'requests[qris_history][dari_tanggal]': '',
      'requests[qris_history][ke_tanggal]': '',
      'requests[qris_history][keterangan]': '',
      'requests[0]': 'account',
      app_version_name: OrderKuota.APP_VERSION_NAME,
      ui_mode: 'light',
      phone_model: OrderKuota.PHONE_MODEL
    });
    
    const endpoint = userId ? 
      `${OrderKuota.API_URL}/qris/mutasi/${userId}` : 
      `${OrderKuota.API_URL}/get`;
      
    return await this.request('POST', endpoint, payload);
  }

  // Generate QRIS
  async generateQr(amount = '') {
    const payload = new URLSearchParams({
      request_time: Date.now(),
      app_reg_id: OrderKuota.APP_REG_ID,
      phone_android_version: OrderKuota.PHONE_ANDROID_VERSION,
      app_version_code: OrderKuota.APP_VERSION_CODE,
      phone_uuid: OrderKuota.PHONE_UUID,
      auth_username: this.username,
      auth_token: this.authToken,
      'requests[qris_merchant_terms][jumlah]': amount,
      'requests[0]': 'qris_merchant_terms',
      app_version_name: OrderKuota.APP_VERSION_NAME,
      ui_mode: 'light',
      phone_model: OrderKuota.PHONE_MODEL
    });

    const response = await this.request('POST', `${OrderKuota.API_URL}/get`, payload);

    try {
      if (response.success && response.qris_merchant_terms && response.qris_merchant_terms.results) {
        return response.qris_merchant_terms.results;
      }
      return response;
    } catch (err) {
      return { error: err.message, raw: response };
    }
  }

  // Withdrawal QRIS
  async withdrawalQris(amount = '') {
    const payload = new URLSearchParams({
      request_time: Date.now(),
      app_reg_id: OrderKuota.APP_REG_ID,
      phone_android_version: OrderKuota.PHONE_ANDROID_VERSION,
      app_version_code: OrderKuota.APP_VERSION_CODE,
      phone_uuid: OrderKuota.PHONE_UUID,
      auth_username: this.username,
      auth_token: this.authToken,
      'requests[qris_withdraw][amount]': amount,
      'requests[0]': 'account',
      app_version_name: OrderKuota.APP_VERSION_NAME,
      ui_mode: 'light',
      phone_model: OrderKuota.PHONE_MODEL
    });

    return await this.request('POST', `${OrderKuota.API_URL}/get`, payload);
  }

  buildHeaders() {
    return {
      'Host': OrderKuota.HOST,
      'User-Agent': OrderKuota.USER_AGENT,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  async request(method, url, body = null) {
    try {
      const res = await fetch(url, {
        method,
        headers: this.buildHeaders(),
        body: body ? body.toString() : null,
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      } else {
        return await res.text();
      }
    } catch (err) {
      return { error: err.message };
    }
  }
}

function convertCRC16(str) {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return ("000" + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
}

function generateTransactionId() {
  return `IKYRESTAPI-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

function generateExpirationTime() {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 30);
  return expirationTime;
}

async function elxyzFile(buffer) {
  const service = new ImageUploadService('pixhost.to');
  const { directLink } = await service.uploadFromBinary(buffer, 'skyzo.png');
  return directLink;
}

async function createQRIS(amount, codeqr) {
  let qrisData = codeqr;
  qrisData = qrisData.slice(0, -4);
  const step1 = qrisData.replace("010211", "010212");
  const step2 = step1.split("5802ID");
  amount = amount.toString();
  let uang = "54" + ("0" + amount.length).slice(-2) + amount;
  uang += "5802ID";
  const final = step2[0] + uang + step2[1];
  const result = final + convertCRC16(final);
  const buffer = await QRCode.toBuffer(result);
  const uploadedFile = await elxyzFile(buffer);
  return {
    idtransaksi: generateTransactionId(),
    jumlah: amount,
    expired: generateExpirationTime(),
    imageqris: { url: uploadedFile }
  };
}

// ROUTE EXPORT
module.exports = [
  {
    name: "Get OTP (tahap 1)",
    desc: "Get OTP Orderkuota",
    category: "Orderkuota",
    path: "/orderkuota/getotp?apikey=&username=&password=",
    async run(req, res) {
      const { apikey, username, password } = req.query;
      if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
      if (!username) return res.json({ status: false, error: 'Missing username' });
      if (!password) return res.json({ status: false, error: 'Missing password' });
      try {
        const ok = new OrderKuota();
        const login = await ok.loginRequest(username, password);
        res.json({ status: true, result: login.results });
      } catch (err) {
        res.status(500).json({ status: false, error: err.message });
      }
    }
  },
  {
    name: "Get Token (tahap 2)",
    desc: "Get Token Orderkuota",
    category: "Orderkuota",
    path: "/orderkuota/gettoken?apikey=&username=&otp=",
    async run(req, res) {
      const { apikey, username, otp } = req.query;
      if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
      if (!username) return res.json({ status: false, error: 'Missing username' });
      if (!otp) return res.json({ status: false, error: 'Missing otp' });
      try {
        const ok = new OrderKuota();
        const login = await ok.getAuthToken(username, otp);
        res.json({ status: true, result: login.results });
      } catch (err) {
        res.status(500).json({ status: false, error: err.message });
      }
    }
  },
  {
    name: "Cek Mutasi QRIS",
    desc: "Cek Mutasi Qris Orderkuota",
    category: "Orderkuota",
    path: "/orderkuota/mutasiqr?apikey=",
    async run(req, res) {
      const { apikey } = req.query;
      if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
      if (!'kyycodestore') return res.json({ status: false, error: 'Missing username' });
      if (!'2106797:RpEhM4C80LNFJ7SGrPYfZDcsQbIO3ljk') return res.json({ status: false, error: 'Missing token' });
      try {
        const ok = new OrderKuota('kyycodestore', '2106797:RpEhM4C80LNFJ7SGrPYfZDcsQbIO3ljk');
        let login = await ok.getTransactionQris();
        login = login.qris_history.results
        res.json({ status: true, result: login });
      } catch (err) {
        res.status(500).json({ status: false, error: err.message });
      }
    }
  },
  {
    name: "Cek Profile",
    desc: "Cek Profile Orderkuota",
    category: "Orderkuota",
    path: "/orderkuota/profile?apikey=&username=&token=",
    async run(req, res) {
      const { apikey, username, token } = req.query;
      if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
      if (!username) return res.json({ status: false, error: 'Missing username' });
      if (!token) return res.json({ status: false, error: 'Missing token' });
      try {
        const ok = new OrderKuota(username, token);
        let login = await ok.getTransactionQris();
        res.json({ status: true, result: login });
      } catch (err) {
        res.status(500).json({ status: false, error: err.message });
      }
    }
  },
  {
    name: "Create QRIS",
    desc: "Generate QR Code Payment",
    category: "Orderkuota",
    path: "/orderkuota/createpayment?apikey=&amount=",
    async run(req, res) {
      const { apikey, amount } = req.query;
      if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
      if (!'kyycodestore') return res.json({ status: false, error: 'Missing username' });
      if (!'2106797:RpEhM4C80LNFJ7SGrPYfZDcsQbIO3ljk') return res.json({ status: false, error: 'Missing token' });
      if (!amount) return res.json({ status: false, error: 'Missing amount' });

      try {
        const ok = new OrderKuota('kyycodestore', '2106797:RpEhM4C80LNFJ7SGrPYfZDcsQbIO3ljk');
        const qrcodeResp = await ok.generateQr(amount);

        if (!qrcodeResp.qris_data) {
          return res.status(400).json({ status: false, error: "QRIS generation failed", raw: qrcodeResp });
        }

        const buffer = await createQRIS(amount, qrcodeResp.qris_data);        

        res.status(200).json({
          status: true,
          result: buffer
        });
      } catch (error) {
        res.status(500).json({ status: false, error: error.message });
      }
    }
  },
  {
    name: "Withdraw QRIS",
    desc: "Tarik saldo QRIS Orderkuota",
    category: "Orderkuota",
    path: "/orderkuota/wdqr?apikey=&amount=",
    async run(req, res) {
      const { apikey, amount } = req.query;
      if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
      if (!'kyycodestore') return res.json({ status: false, error: 'Missing username' });
      if (!'2106797:RpEhM4C80LNFJ7SGrPYfZDcsQbIO3ljk') return res.json({ status: false, error: 'Missing token' });
      if (!amount) return res.json({ status: false, error: 'Missing amount' });

      try {
        const ok = new OrderKuota(username, token);
        const wd = await ok.withdrawalQris(amount);
        res.json({ status: true, result: wd });
      } catch (error) {
        res.status(500).json({ status: false, error: error.message });
      }
    }
  }
];