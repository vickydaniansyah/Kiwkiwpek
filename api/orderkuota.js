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

async function createQRIS(amount, codeqr, options = {}) {
  // 1. Modifikasi data QRIS untuk membuatnya unik
  let qrisData = codeqr;
  qrisData = qrisData.slice(0, -4);
  const step1 = qrisData.replace("010211", "010212");
  const step2 = step1.split("5802ID");
  
  amount = amount.toString();
  
  // Tambahkan timestamp untuk membuat QRIS unik setiap pembuatan
  const timestamp = Math.floor(Date.now() / 1000);
  const uniqueIdentifier = options.uniqueId || `TS${timestamp}R${Math.random().toString(36).substr(2, 9)}`;
  
  // Jika ingin menyisipkan identifier unik (opsional)
  const customField = options.customField ? `62${('0' + (uniqueIdentifier.length + 2)).slice(-2)}${uniqueIdentifier}` : '';
  
  let uang = "54" + ("0" + amount.length).slice(-2) + amount;
  uang += "5802ID";
  
  // Gabungkan dengan custom field jika ada
  let final = step2[0] + uang;
  if (customField) {
    final += customField;
  }
  final += step2[1];
  
  const result = final + convertCRC16(final);
  
  // 2. Generate QR code dengan opsi untuk logo
  const qrCodeOptions = {
    errorCorrectionLevel: 'H', // Level koreksi error tinggi untuk logo
    margin: 4,
    width: 400,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  };
  
  // Buat QR code
  let buffer;
  
  if (options.logoUrl) {
    // Jika ada logo, generate QR code terlebih dahulu
    const qrSvg = await QRCode.toString(result, {
      ...qrCodeOptions,
      type: 'svg'
    });
    
    // Konversi SVG ke buffer dengan logo (menggunakan library tambahan)
    buffer = await addLogoToQRCode(qrSvg, options.logoUrl, {
      logoSize: options.logoSize || 80,
      logoMargin: options.logoMargin || 10
    });
  } else {
    // Jika tidak ada logo, gunakan cara biasa
    buffer = await QRCode.toBuffer(result, qrCodeOptions);
  }
  
  // 3. Upload file
  const uploadedFile = await elxyzFile(buffer);
  
  return {
    idtransaksi: generateTransactionId(),
    jumlah: amount,
    expired: generateExpirationTime(),
    imageqris: { 
      url: uploadedFile,
      qrisData: result, // Menyimpan data QRIS untuk referensi
      uniqueIdentifier: uniqueIdentifier // Identifier unik
    }
  };
}

// Fungsi helper untuk menambahkan logo ke QR code
async function addLogoToQRCode(qrSvg, logoUrl, options = {}) {
  // Gunakan library seperti sharp, canvas, atau jimp untuk manipulasi gambar
  // Contoh menggunakan jimp (install jimp terlebih dahulu)
  try {
    const Jimp = (await import('jimp')).default;
    
    // Load QR code dari SVG (konversi ke buffer)
    // Catatan: Untuk menangani SVG, mungkin perlu library tambahan
    // Alternatif: Gunakan QRCode.toBuffer lalu tambahkan logo
    
    return await addLogoToQRCodeBuffer(logoUrl, options);
  } catch (error) {
    console.warn('Logo tidak bisa ditambahkan, menggunakan QR code biasa:', error);
    // Fallback ke QR code tanpa logo
    return await QRCode.toBuffer(qrSvg);
  }
}

// Alternatif menggunakan buffer langsung
async function addLogoToQRCodeBuffer(logoUrl, qrBuffer, options = {}) {
  const {
    logoSize = 80,
    logoMargin = 10,
    logoCornerRadius = 10
  } = options;
  
  // Contoh implementasi menggunakan sharp (install sharp terlebih dahulu)
  try {
    const jimp = (await import('jimp')).default;
    
    // Load logo dari URL
    const logoResponse = await fetch(logoUrl);
    const logoBuffer = Buffer.from(await logoResponse.arrayBuffer());
    
    // Resize logo
    const resizedLogo = await jimp(logoBuffer)
      .resize(logoSize, logoSize, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toBuffer();
    
    // Komposisikan logo di tengah QR code
    const qrWithLogo = await jimp(qrBuffer)
      .composite([{
        input: resizedLogo,
        top: Math.floor((400 - logoSize) / 2), // QR code size 400
        left: Math.floor((400 - logoSize) / 2),
        blend: 'over'
      }])
      .toBuffer();
    
    return qrWithLogo;
  } catch (error) {
    console.warn('Gagal menambahkan logo:', error);
    return qrBuffer;
  }
}

// Contoh penggunaan fungsi yang ditingkatkan
async function contohPenggunaan() {
  try {
    // 1. QRIS dengan logo
    const qrisDenganLogo = await createQRIS(50000, '0102110302...', {
      logoUrl: 'https://img1.pixhost.to/images/11062/673038093_media.jpg',
      logoSize: 60,
      logoMargin: 5,
      customField: 'INV123456' // Field kustom untuk tracking
    });
    
    // 2. QRIS tanpa logo (backward compatible)
    const qrisBiasa = await createQRIS(50000, '0102110302...');
    
    // 3. QRIS dengan identifier unik
    const qrisUnik = await createQRIS(50000, '0102110302...', {
      uniqueId: `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    
    return {
      denganLogo: qrisDenganLogo,
      biasa: qrisBiasa,
      unik: qrisUnik
    };
  } catch (error) {
    console.error('Error membuat QRIS:', error);
    throw error;
  }
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