const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { URLSearchParams } = require('url');
const crypto = require("crypto");
const QRCode = require('qrcode');
const Jimp = require('jimp');
const { ImageUploadService } = require('node-upload-images');

const logoUrl = 'https://img1.pixhost.to/images/11062/673038093_media.jpg'

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
  // 1. Membuat kode QRIS unik dengan timestamp dan random string
  let qrisData = codeqr;
  qrisData = qrisData.slice(0, -4);
  
  // Tambahkan timestamp dan random string untuk membuat QRIS unik
  const timestamp = Date.now().toString();
  const randomStr = Math.random().toString(36).substring(2, 10);
  const uniqueId = timestamp + randomStr;
  
  // 2. Modifikasi data QRIS dengan amount
  const step1 = qrisData.replace("010211", "010212");
  const step2 = step1.split("5802ID");
  
  amount = amount.toString();
  let uang = "54" + ("0" + amount.length).slice(-2) + amount;
  uang += "5802ID";
  
  // 3. Tambahkan ID unik ke data QRIS (pada posisi merchant information)
  let final = step2[0] + uang + step2[1];
  
  // Jika ingin menambahkan ID unik ke merchant information
  // Cari posisi ID 26 (Merchant Information - Point of Initiation Method)
  const merchantInfoIndex = final.indexOf("2602");
  if (merchantInfoIndex !== -1) {
    const beforeMerchant = final.substring(0, merchantInfoIndex);
    const afterMerchant = final.substring(merchantInfoIndex);
    final = beforeMerchant + "2602" + uniqueId + afterMerchant.replace("2602", "");
  }
  
  // 4. Generate CRC
  const result = final + convertCRC16(final);
  
  // 5. Buat QR Code dengan logo di tengah (jika disediakan)
  const qrCodeOptions = {
    errorCorrectionLevel: 'H',
    type: 'png',
    quality: 0.92,
    margin: 1,
    width: 300, // ukuran default
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  };
  
  // 6. Tambahkan logo jika ada URL logo yang disediakan
  if (options.logoUrl) {
    qrCodeOptions.logo = {
      url: options.logoUrl,
      logoSize: 0.2, // ukuran logo 20% dari QR code
      borderSize: 2, // border di sekitar logo
      crossOrigin: 'anonymous' // untuk handling CORS
    };
  }
  
  // 7. Generate buffer QR code
  const buffer = await QRCode.toBuffer(result, qrCodeOptions);
  
  // 8. Upload file
  const uploadedFile = await elxyzFile(buffer);
  
  // 9. Return hasil
  return {
    idtransaksi: generateTransactionId(),
    jumlah: amount,
    expired: generateExpirationTime(),
    imageqris: { url: uploadedFile },
    qrisData: result, // data QRIS lengkap untuk referensi
    uniqueId: uniqueId // ID unik yang ditambahkan
  };
}

// Fungsi helper untuk membuat QR code dengan logo (jika menggunakan library qrcode)
// Pastikan library QRCode mendukung logo
const QRCode = require('qrcode');

// Alternatif: Jika library QRCode tidak support logo, gunakan library tambahan
async function generateQRWithLogo(qrData, logoUrl) {
  try {
    // Generate QR code base64 terlebih dahulu
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300
    });
    
    // Lakukan manipulasi canvas untuk menambahkan logo
    return await addLogoToQR(qrCodeDataUrl, logoUrl);
  } catch (error) {
    console.error('Error generating QR with logo:', error);
    throw error;
  }
}

// Fungsi untuk menambahkan logo ke QR code menggunakan canvas
async function addLogoToQR(qrDataUrl, logoUrl) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const qrImage = new Image();
    qrImage.crossOrigin = 'anonymous';
    
    qrImage.onload = () => {
      // Set canvas size
      canvas.width = qrImage.width;
      canvas.height = qrImage.height;
      
      // Draw QR code
      ctx.drawImage(qrImage, 0, 0);
      
      // Load and draw logo
      const logoImage = new Image();
      logoImage.crossOrigin = 'anonymous';
      
      logoImage.onload = () => {
        // Calculate logo position and size
        const logoSize = qrImage.width * 0.2; // 20% of QR size
        const logoX = (qrImage.width - logoSize) / 2;
        const logoY = (qrImage.height - logoSize) / 2;
        
        // Draw logo with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
        
        // Draw logo
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        
        // Convert to buffer
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(Buffer.from(reader.result));
          };
          reader.readAsArrayBuffer(blob);
        }, 'image/png');
      };
      
      logoImage.onerror = reject;
      logoImage.src = logoUrl;
    };
    
    qrImage.onerror = reject;
    qrImage.src = qrDataUrl;
  });
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
  const { apikey, amount, logoUrl } = req.query;
  
  // Validasi API Key
  if (!global.apikey.includes(apikey)) {
    return res.json({ status: false, error: 'Apikey invalid' });
  }
  
  // Validasi amount
  if (!amount) {
    return res.json({ status: false, error: 'Missing amount' });
  }

  try {
    // Inisialisasi OrderKuota dengan credentials
    const ok = new OrderKuota('kyycodestore', '2106797:RpEhM4C80LNFJ7SGrPYfZDcsQbIO3ljk');
    
    // Generate QRIS dari API OrderKuota
    const qrcodeResp = await ok.generateQr(amount);

    if (!qrcodeResp.qris_data) {
      return res.status(400).json({ 
        status: false, 
        error: "QRIS generation failed", 
        raw: qrcodeResp 
      });
    }

    // Generate QR Code dengan logo (jika ada)
    const qrisOptions = {};
    if (logoUrl && isValidUrl(logoUrl)) {
      qrisOptions.logoUrl = logoUrl;
    }

    // Panggil fungsi createQRIS yang sudah dimodifikasi
    const qrisResult = await createQRIS(
      parseInt(amount), 
      qrcodeResp.qris_data, 
      qrisOptions
    );

    // Jika ingin langsung return image sebagai response
    if (req.query.directImage === 'true') {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="qris-${qrisResult.idtransaksi}.png"`);
      
      // Konversi URL ke buffer jika perlu
      if (qrisResult.imageqris && qrisResult.imageqris.url) {
        // Jika uploadedFile sudah buffer
        if (Buffer.isBuffer(qrisResult.imageqris.url)) {
          return res.end(qrisResult.imageqris.url);
        }
        // Jika URL, fetch terlebih dahulu
        const imageResponse = await fetch(qrisResult.imageqris.url);
        const imageBuffer = await imageResponse.buffer();
        return res.end(imageBuffer);
      }
    }

    // Return JSON response
    res.status(200).json({
      status: true,
      result: {
        transaction_id: qrisResult.idtransaksi,
        amount: qrisResult.jumlah,
        expiration_time: qrisResult.expired,
        qr_code_url: qrisResult.imageqris.url,
        qris_data: qrisResult.qrisData, // data QRIS lengkap
        unique_id: qrisResult.uniqueId, // ID unik QRIS
        additional_info: {
          has_logo: !!logoUrl,
          generated_at: new Date().toISOString()
        }
      }
    });
    
  } catch (error) {
    console.error('QRIS Generation Error:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Fungsi helper untuk validasi URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
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