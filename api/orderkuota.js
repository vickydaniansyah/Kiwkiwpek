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

async function createQRIS(amount, codeqr, options = {}) {
  try {
    // 1. Buat data QRIS dengan format yang unik
    let qrisData = codeqr;
    
    // Validasi format QRIS
    if (!qrisData.includes("010211")) {
      throw new Error("Format QRIS tidak valid");
    }
    
    // Hapus CRC terakhir
    qrisData = qrisData.slice(0, -4);
    
    // Generate identifier yang sangat unik
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(4).toString('hex');
    const sessionId = options.sessionId || `${timestamp}${randomHash}`;
    
    // Buat merchant identifier yang unik
    const merchantId = `ID${timestamp.toString().slice(-8)}${randomHash.toUpperCase()}`;
    
    // Modifikasi data QRIS dengan cara yang berbeda dari contoh
    const modifiedData = qrisData.replace("010211", "010212");
    
    // Split untuk menemukan posisi yang tepat
    const parts = modifiedData.split(/54\d{2}/);
    if (parts.length < 2) {
      throw new Error("Format amount tidak ditemukan");
    }
    
    // Format amount dengan padding
    amount = parseInt(amount).toString();
    const amountLength = amount.length.toString().padStart(2, '0');
    const amountField = `54${amountLength}${amount}`;
    
    // Tambahkan field custom yang unik
    const customFields = {
      // Field merchant ID unik
      merchantCode: `5902${merchantId}`,
      // Field session/transaction ID
      sessionField: `6205S${sessionId.slice(0, 5)}`,
      // Field timestamp dalam format khusus
      timeField: `5504${timestamp.toString().slice(-8)}`,
      // Field tambahan untuk verifikasi
      verifField: `6314V${crypto.randomBytes(2).toString('hex').toUpperCase()}`
    };
    
    // Bangun struktur QRIS yang unik
    let finalData = parts[0] + amountField;
    
    // Tambahkan field custom secara bergantian
    finalData += customFields.merchantCode;
    finalData += customFields.sessionField;
    finalData += "5802ID"; // Tetap pertahankan country code
    finalData += customFields.timeField;
    finalData += customFields.verifField;
    finalData += parts[1];
    
    // 2. Hitung CRC16 baru
    const crcValue = calculateCRC16(finalData);
    const resultData = finalData + crcValue;
    
    console.log("QRIS Data Format:", {
      totalLength: resultData.length,
      amountField: amountField,
      merchantId: merchantId,
      sessionId: sessionId.slice(0, 5),
      crc: crcValue
    });
    
    // 3. Generate QR Code dengan error correction tinggi
    const qrOptions = {
      errorCorrectionLevel: 'H', // 30% error correction
      type: 'png',
      width: 600,
      margin: 3,
      color: {
        dark: '#1a237e', // Biru gelap untuk QR code
        light: '#f5f5f5' // Background abu-abu muda
      }
    };
    
    // Generate QR code buffer
    const qrBuffer = await QRCode.toBuffer(resultData, qrOptions);
    
    // 4. Tambahkan logo jika ada
    let finalImage = await Jimp.read(qrBuffer);
    
    if (options.logoUrl) {
      try {
        // Load logo
        const logo = await Jimp.read(options.logoUrl);
        
        // Resize logo (20% dari ukuran QR)
        const logoSize = Math.floor(qrOptions.width * 0.2);
        logo.resize(logoSize, logoSize);
        
        // Buat background putih untuk logo
        const logoWithBg = new Jimp(logoSize + 20, logoSize + 20, 0xFFFFFFFF);
        logoWithBg.composite(logo, 10, 10);
        
        // Hitung posisi tengah
        const xPos = Math.floor((qrOptions.width - logoWithBg.bitmap.width) / 2);
        const yPos = Math.floor((qrOptions.width - logoWithBg.bitmap.height) / 2);
        
        // Composite logo ke tengah QR
        finalImage.composite(logoWithBg, xPos, yPos, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacitySource: 1,
          opacityDest: 1
        });
        
        console.log("Logo berhasil ditambahkan ke QRIS");
      } catch (logoError) {
        console.warn("Gagal menambahkan logo:", logoError.message);
        // Lanjut tanpa logo
      }
    }
    
    // 5. Tambahkan border/styling untuk QR code
    // Buat border dengan background putih
    const borderSize = 20;
    const borderedImage = new Jimp(
      qrOptions.width + (borderSize * 2), 
      qrOptions.width + (borderSize * 2), 
      0xFFFFFFFF
    );
    
    borderedImage.composite(finalImage, borderSize, borderSize);
    
    // 6. Tambahkan teks "QRIS" di bawah (opsional)
    if (options.addText) {
      try {
        // Load font (jika ada)
        const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
        
        // Tambahkan teks
        const text = "SCAN QRIS";
        const textWidth = Jimp.measureText(font, text);
        const textX = Math.floor((borderedImage.bitmap.width - textWidth) / 2);
        const textY = borderedImage.bitmap.height - 30;
        
        borderedImage.print(font, textX, textY, text);
      } catch (e) {
        console.warn("Tidak bisa menambahkan teks:", e.message);
      }
    }
    
    // 7. Convert ke buffer
    const finalBuffer = await borderedImage.getBufferAsync(Jimp.MIME_PNG);
    
    // 8. Upload file
    const uploadedFile = await elxyzFile(finalBuffer);
    
    // 9. Return hasil dengan data lengkap
    return {
      idtransaksi: generateTransactionId(),
      jumlah: amount,
      expired: generateExpirationTime(),
      imageqris: { 
        url: uploadedFile,
        qrisData: resultData,
        uniqueId: merchantId,
        timestamp: new Date().toISOString()
      },
      metadata: {
        format: "QRIS_V2_CUSTOM",
        version: "1.0",
        containsLogo: !!options.logoUrl,
        errorCorrection: "H (30%)"
      }
    };
    
  } catch (error) {
    console.error("Error dalam createQRIS:", error);
    throw new Error(`Gagal membuat QRIS: ${error.message}`);
  }
}

// Fungsi untuk menghitung CRC16
function calculateCRC16(data) {
  let crc = 0xFFFF;
  
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
    
    crc &= 0xFFFF;
  }
  
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Fungsi generate transaction ID yang unik
function generateTransactionId() {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TRX-${timestamp}-${random}`;
}

// Fungsi generate expiration time (default 24 jam)
function generateExpirationTime(hours = 24) {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now.toISOString();
}

// Contoh penggunaan
async function contohPenggunaan() {
  // QRIS dengan logo dan styling
  const qrisCustom = await createQRIS(50000, '0102110302ID123456789012345678901234567890', {
    logoUrl: 'https://img1.pixhost.to/images/11062/673038093_media.jpg',
    sessionId: 'SESS123',
    addText: true
  });
  
  // QRIS tanpa logo (hanya data unik)
  const qrisSimple = await createQRIS(75000, '0102110302ID123456789012345678901234567890', {
    sessionId: 'SESS456'
  });
  
  console.log("QRIS Custom dibuat:", qrisCustom.idtransaksi);
  console.log("QRIS Simple dibuat:", qrisSimple.idtransaksi);
  
  return { qrisCustom, qrisSimple };
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