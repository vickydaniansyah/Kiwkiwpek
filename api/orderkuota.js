const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { URLSearchParams } = require('url');
const crypto = require("crypto");
const QRCode = require('qrcode');
const Jimp = require('jimp');
const { ImageUploadService } = require('node-upload-images');

// CLASS OrderKuota
class OrderKuota {
  static API_URL = 'https://app.orderkuota.com/api/v2';
  static API_URL_ORDER = 'https://app.orderkuota.com/api/v2/order';
  static HOST = 'app.orderkuota.com';
  static USER_AGENT = 'okhttp/4.12.0';
  static APP_VERSION_NAME = '25.08.11';
  static APP_VERSION_CODE = '250811';
  static APP_REG_ID = 'di309HvATsaiCppl5eDpoc:APA91bFUcTOH8h2XHdPRz2qQ5Bezn-3_TaycFcJ5pNLGWpmaxheQP9Ri0E56wLHz0_b1vcss55jbRQXZgc9loSfBdNa5nZJZVMlk7GS1JDMGyFUVvpcwXbMDg8tjKGZAurCGR4kDMDRJ';
  static PHONE_MODEL = 'SM-G960N';
  static PHONE_UUID = 'di309HvATsaiCppl5eDpoc';
  static PHONE_ANDROID_VERSION = '9';

  constructor(username = null, authToken = null) {
    this.username = username;
    this.authToken = authToken;
  }

  async loginRequest(username, password) {
    const payload = new URLSearchParams({
      username,
      password,
      request_time: Date.now(),
      app_reg_id: OrderKuota.APP_REG_ID,
      phone_android_version: OrderKuota.PHONE_ANDROID_VERSION,
      app_version_code: OrderKuota.APP_VERSION_CODE,
      phone_uuid: OrderKuota.PHONE_UUID
    });
    return await this.request('POST', `${OrderKuota.API_URL}/login`, payload);
  }

  async getAuthToken(username, otp) {
    const payload = new URLSearchParams({
      username,
      password: otp,
      request_time: Date.now(),
      app_reg_id: OrderKuota.APP_REG_ID,
      phone_android_version: OrderKuota.PHONE_ANDROID_VERSION,
      app_version_code: OrderKuota.APP_VERSION_CODE,
      phone_uuid: OrderKuota.PHONE_UUID
    });
    return await this.request('POST', `${OrderKuota.API_URL}/login`, payload);
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
  const { directLink } = await service.uploadFromBinary(buffer, 'ikyrestapi.png');
  return directLink;
}

async function createQRIS(
  amount,
  codeqr,
  logoUrl,
  options = {}
) {
  // ───── DEFAULT OPTIONS ─────
  const {
    qrColor = "#000000",
    bgColor = "#FFFFFF",
    logoBorderColor = "#000000",
    logoBorderSize = 6
  } = options;

  // ───── STEP 1: Generate QRIS ─────
  let qrisData = codeqr.slice(0, -4).replace("010211", "010212");
  const split = qrisData.split("5802ID");

  amount = amount.toString();
  let uang = "54" + amount.length.toString().padStart(2, "0") + amount;
  uang += "5802ID";

  let final = split[0] + uang + split[1];

  // Unique transaction
  const trxId = generateTransactionId();
  const uniqueValue = "TRX" + trxId;
  final += "62" + uniqueValue.length.toString().padStart(2, "0") + uniqueValue;

  // CRC
  final += convertCRC16(final);

  // ───── STEP 2: Generate QR Buffer (Color Custom) ─────
  const qrBuffer = await QRCode.toBuffer(final, {
    errorCorrectionLevel: "H",
    width: 500,
    margin: 2,
    color: {
      dark: qrColor,
      light: bgColor
    }
  });

  const qrImage = await Jimp.read(qrBuffer);

  // ───── STEP 3: Prepare Logo ─────
  const logo = await Jimp.read(logoUrl);
  const logoSize = qrImage.bitmap.width * 0.18;
  logo.resize(logoSize, logoSize);

  // Circle mask
  const mask = new Jimp(logoSize, logoSize, 0x00000000);
  mask.scan(0, 0, logoSize, logoSize, function (x, y, idx) {
    const r = logoSize / 2;
    const dx = x - r;
    const dy = y - r;
    if (dx * dx + dy * dy <= r * r) {
      this.bitmap.data[idx + 3] = 255;
    }
  });
  logo.mask(mask, 0, 0);

  // ───── STEP 4: White Background Circle ─────
  const bgSize = logoSize + logoBorderSize * 4;
  const whiteBg = new Jimp(bgSize, bgSize, 0xffffffff);

  const bgMask = new Jimp(bgSize, bgSize, 0x00000000);
  bgMask.scan(0, 0, bgSize, bgSize, function (x, y, idx) {
    const r = bgSize / 2;
    const dx = x - r;
    const dy = y - r;
    if (dx * dx + dy * dy <= r * r) {
      this.bitmap.data[idx + 3] = 255;
    }
  });
  whiteBg.mask(bgMask, 0, 0);

  // ───── STEP 5: Border Logo ─────
  const borderSize = logoSize + logoBorderSize * 2;
  const border = new Jimp(borderSize, borderSize, logoBorderColor);

  const borderMask = new Jimp(borderSize, borderSize, 0x00000000);
  borderMask.scan(0, 0, borderSize, borderSize, function (x, y, idx) {
    const r = borderSize / 2;
    const dx = x - r;
    const dy = y - r;
    if (dx * dx + dy * dy <= r * r) {
      this.bitmap.data[idx + 3] = 255;
    }
  });
  border.mask(borderMask, 0, 0);

  // ───── STEP 6: Combine Logo Layers ─────
  const center = bgSize / 2;

  whiteBg.composite(
    border,
    center - borderSize / 2,
    center - borderSize / 2
  );

  whiteBg.composite(
    logo,
    center - logoSize / 2,
    center - logoSize / 2
  );

  // ───── STEP 7: Composite to QR ─────
  const x = (qrImage.bitmap.width - bgSize) / 2;
  const y = (qrImage.bitmap.height - bgSize) / 2;

  qrImage.composite(whiteBg, x, y);

  const finalQR = await qrImage.getBufferAsync(Jimp.MIME_PNG);

  // ───── STEP 8: Upload ─────
  const uploadedFile = await elxyzFile(finalQR);

  return {
    idtransaksi: trxId,
    jumlah: amount,
    expired: generateExpirationTime(),
    imageqris: {
      url: uploadedFile
    }
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

  // VALIDASI
  if (!apikey) return res.json({ status: false, error: "Missing apikey" });
  if (!global.apikey.includes(apikey))
    return res.json({ status: false, error: "Apikey invalid" });

  if (!amount) return res.json({ status: false, error: "Missing amount" });

  // KONFIG ORDERKUOTA
  const username = "kyycodestore";
  const token = "2106797:RpEhM4C80LNFJ7SGrPYfZDcsQbIO3ljk";

  // LOGO QRIS
  const logoUrl = "https://img1.pixhost.to/images/11062/673038093_media.jpg";

  try {
    const ok = new OrderKuota(username, token);
    const qrcodeResp = await ok.generateQr(amount);

    if (!qrcodeResp || !qrcodeResp.qris_data) {
      return res.status(400).json({
        status: false,
        error: "QRIS generation failed",
        raw: qrcodeResp
      });
    }

    // GENERATE QRIS CUSTOM
    const qrisResult = await createQRIS(
      amount,
      qrcodeResp.qris_data,
      logoUrl,
      {
        qrColor: "#111111",
        bgColor: "#ffffff",
        logoBorderColor: "#00c853",
        logoBorderSize: 6
      }
    );

    res.status(200).json({
      status: true,
      result: qrisResult
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
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