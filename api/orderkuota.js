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
    console.log("=== MEMULAI PEMBUATAN QRIS ===");
    console.log("Amount:", amount);
    console.log("Options:", options);
    
    // 1. Buat data QRIS sederhana (menggunakan cara asli)
    let qrisData = codeqr;
    qrisData = qrisData.slice(0, -4);
    const step1 = qrisData.replace("010211", "010212");
    const step2 = step1.split("5802ID");
    
    amount = amount.toString();
    
    // Identifier sederhana
    const uniqueId = `ID${Date.now()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    
    let uang = "54" + ("0" + amount.length).slice(-2) + amount;
    uang += "5802ID";
    
    // Data QRIS final
    let final = step2[0] + uang + `6207${uniqueId}` + step2[1];
    const result = final + calculateCRC16(final);
    
    console.log("Data QRIS berhasil dibuat, panjang:", result.length);
    
    // 2. Generate QR Code dasar
    const qrSize = 500; // Ukuran tetap untuk konsistensi
    console.log("Membuat QR Code dengan ukuran:", qrSize);
    
    const qrBuffer = await QRCode.toBuffer(result, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: qrSize,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    console.log("QR Code dasar berhasil digenerate");
    
    // 3. Load QR code ke Jimp
    let qrImage = await Jimp.read(qrBuffer);
    console.log("QR Code dimuat ke Jimp");
    
    // 4. Tambahkan logo jika ada URL
    let hasLogo = false;
    if (options.logoUrl && options.logoUrl.trim() !== '' && options.logoUrl !== 'undefined') {
      try {
        console.log("Mencoba memuat logo dari URL:", options.logoUrl);
        
        // Validasi URL
        if (!options.logoUrl.startsWith('http')) {
          throw new Error("URL logo harus dimulai dengan http/https");
        }
        
        // Load logo dengan timeout
        const logo = await Promise.race([
          Jimp.read(options.logoUrl),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout loading logo")), 10000)
          )
        ]);
        
        console.log("Logo berhasil dimuat, ukuran asli:", logo.bitmap.width, "x", logo.bitmap.height);
        
        // Resize logo (15% dari ukuran QR)
        const logoSize = Math.floor(qrSize * 0.15);
        console.log("Resize logo ke:", logoSize, "x", logoSize);
        
        logo.resize(logoSize, logoSize);
        
        // Buat background putih untuk logo
        const bgSize = logoSize + 10;
        console.log("Membuat background putih ukuran:", bgSize, "x", bgSize);
        
        const logoWithBg = new Jimp(bgSize, bgSize, 0xFFFFFFFF);
        logoWithBg.composite(logo, 5, 5);
        
        // Hitung posisi tengah
        const xPos = Math.floor((qrSize - bgSize) / 2);
        const yPos = Math.floor((qrSize - bgSize) / 2);
        
        console.log("Menempatkan logo di posisi:", { x: xPos, y: yPos });
        
        // Tambahkan logo ke QR code
        qrImage.composite(logoWithBg, xPos, yPos, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacitySource: 1,
          opacityDest: 1
        });
        
        hasLogo = true;
        console.log("✅ Logo berhasil ditambahkan ke QR code");
        
      } catch (logoError) {
        console.error("❌ Gagal memuat atau menambahkan logo:", logoError.message);
        console.log("⚠️ Menggunakan QR code tanpa logo");
      }
    } else {
      console.log("ℹ️ Tidak ada logo URL yang disediakan atau URL kosong");
    }
    
    // 5. Tambahkan border putih di sekeliling
    const borderSize = 20;
    const finalWidth = qrSize + (borderSize * 2);
    const finalHeight = qrSize + (borderSize * 2);
    
    console.log("Membuat border, ukuran akhir:", finalWidth, "x", finalHeight);
    
    const finalImage = new Jimp(finalWidth, finalHeight, 0xFFFFFFFF);
    finalImage.composite(qrImage, borderSize, borderSize);
    
    // 6. Tambahkan teks informasi di bawah QR code
    try {
      console.log("Mencoba menambahkan teks...");
      
      // Gunakan font default jika FONT_SANS_16_BLACK tidak ada
      let font;
      try {
        font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
      } catch {
        // Buat font sederhana
        font = await Jimp.loadFont(Jimp.FONT_SANS_10_BLACK);
      }
      
      const amountFormatted = parseInt(amount).toLocaleString('id-ID');
      const text1 = `QRIS • Rp ${amountFormatted}`;
      const text2 = "SCAN UNTUK BAYAR";
      
      finalImage.print(font, 20, finalHeight - 60, text1);
      finalImage.print(font, 20, finalHeight - 40, text2);
      
      console.log("✅ Teks berhasil ditambahkan");
    } catch (fontError) {
      console.log("⚠️ Font tidak tersedia, lanjut tanpa teks:", fontError.message);
    }
    
    // 7. Convert ke buffer
    console.log("Mengonversi image ke buffer...");
    const finalBuffer = await finalImage.getBufferAsync(Jimp.MIME_PNG);
    console.log("✅ Image buffer siap, ukuran:", finalBuffer.length, "bytes");
    
    // 8. Upload ke storage (sesuaikan dengan fungsi Anda)
    console.log("Mengupload file...");
    const uploadedFile = await elxyzFile(finalBuffer);
    console.log("✅ File berhasil diupload:", uploadedFile);
    
    // 9. Return hasil
    const resultObj = {
      idtransaksi: generateTransactionId(),
      jumlah: amount,
      expired: generateExpirationTime(),
      imageqris: { 
        url: uploadedFile,
        containsLogo: hasLogo
      },
      metadata: {
        qrSize: qrSize,
        hasLogo: hasLogo,
        logoUrl: options.logoUrl || null
      }
    };
    
    console.log("=== PEMBUATAN QRIS SELESAI ===");
    console.log("ID Transaksi:", resultObj.idtransaksi);
    console.log("Mengandung Logo:", hasLogo);
    
    return resultObj;
    
  } catch (error) {
    console.error("❌ ERROR KRITIS dalam createQRIS:", error);
    throw error;
  }
}

// Fungsi CRC16 yang sederhana
function calculateCRC16(data) {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

// Fungsi generate transaction ID
function generateTransactionId() {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TRX-${timestamp}-${random}`;
}

// Fungsi generate expiration time
function generateExpirationTime(hours = 24) {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now.toISOString();
}

// Contoh penggunaan SIMPLE
async function testQRIS() {
  console.log("\n\n=== TEST QRIS DENGAN LOGO ===");
  
  // Contoh data QRIS (sederhana)
  const dummyQRIS = "0102110215201033495021412345678902152010334950214123456789021520103349502141234567896304ABCD";
  
  // Test 1: Dengan logo yang pasti ada
  const qrisWithLogo = await createQRIS(50000, dummyQRIS, {
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png",
    addText: true
  });
  
  console.log("\n=== HASIL TEST 1 (Dengan Logo) ===");
  console.log(qrisWithLogo);
  
  // Test 2: Tanpa logo
  const qrisWithoutLogo = await createQRIS(75000, dummyQRIS, {
    addText: true
  });
  
  console.log("\n=== HASIL TEST 2 (Tanpa Logo) ===");
  console.log(qrisWithoutLogo);
  
  return { qrisWithLogo, qrisWithoutLogo };
}

// Fungsi utama yang akan dipanggil dari API
async function createQRISFromAPI(amount, qrisData, logoUrl = null) {
  try {
    const options = {};
    
    if (logoUrl) {
      // Pastikan URL logo valid
      if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
        options.logoUrl = logoUrl;
      } else {
        console.log("URL logo tidak valid, menggunakan tanpa logo");
      }
    }
    
    options.addText = true;
    
    return await createQRIS(amount, qrisData, options);
    
  } catch (error) {
    console.error("Error di createQRISFromAPI:", error);
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