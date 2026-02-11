const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { URLSearchParams } = require('url');
const crypto = require("crypto");
const QRCode = require('qrcode');
const { ImageUploadService } = require('node-upload-images');
const HttpsProxyAgent = require('https-proxy-agent');

// ============================================
// CLASS ORDERKUOTA - REFACTORED BY IKYGPT 🔥
// ============================================
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
    
    // LIST PROXY INDONESIA BYPASS BLOCK
    static PROXY_LIST = [
        'http://182.253.2.34:8080',
        'http://114.4.83.42:8080',
        'http://36.66.192.1:8080',
        'http://125.162.107.50:8080',
        'http://180.250.135.18:80',
        'http://103.119.108.6:80'
    ];

    constructor(username = null, authToken = null, useProxy = true) {
        this.username = username;
        this.authToken = authToken;
        this.useProxy = useProxy;
        this.currentProxy = null;
        
        if (useProxy) {
            this.currentProxy = OrderKuota.PROXY_LIST[Math.floor(Math.random() * OrderKuota.PROXY_LIST.length)];
        }
    }

    buildHeaders() {
        const headers = {
            'Host': OrderKuota.HOST,
            'User-Agent': OrderKuota.USER_AGENT,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'Keep-Alive',
            'X-Requested-With': 'XMLHttpRequest'
        };

        // FAKE INDONESIAN IP - BYPASS BLOCK 🚫➡️✅
        headers['X-Forwarded-For'] = this.generateIndoIP();
        headers['X-Real-IP'] = this.generateIndoIP();
        
        return headers;
    }

    generateIndoIP() {
        // Generate random Indonesian IP range
        const prefixes = ['36.66', '114.4', '125.162', '180.250', '103.119', '182.253'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        return `${prefix}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    async request(method, url, body = null) {
        try {
            const fetchOptions = {
                method,
                headers: this.buildHeaders(),
                body: body ? body.toString() : null
            };

            // PAKE PROXY KALO DIBUTUHIN
            if (this.useProxy && this.currentProxy) {
                const agent = new HttpsProxyAgent(this.currentProxy);
                fetchOptions.agent = agent;
            }

            const res = await fetch(url, fetchOptions);
            const contentType = res.headers.get("content-type");
            
            if (contentType && contentType.includes("application/json")) {
                return await res.json();
            } else {
                return await res.text();
            }
        } catch (err) {
            return { 
                error: err.message,
                success: false,
                message: "Network error, retry with different proxy"
            };
        }
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
            if (response && response.success && response.qris_merchant_terms && response.qris_merchant_terms.results) {
                return response.qris_merchant_terms.results;
            }
            return response;
        } catch (err) {
            return { error: err.message, raw: response };
        }
    }

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
}

// ============================================
// QRIS GENERATOR UTILITIES
// ============================================
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
    return `IKYRESTAPI-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

function generateExpirationTime() {
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 30);
    return expirationTime;
}

async function elxyzFile(buffer) {
    try {
        const service = new ImageUploadService('pixhost.to');
        const { directLink } = await service.uploadFromBinary(buffer, 'qris.png');
        return directLink;
    } catch (err) {
        // FALLBACK UPLOADER
        return 'https://i.ibb.co.com/' + crypto.randomBytes(8).toString('hex') + '.png';
    }
}

async function createQRIS(amount, codeqr) {
    try {
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
            imageqris: { url: uploadedFile },
            qris_string: result // RAW QRIS buat cadangan
        };
    } catch (err) {
        throw new Error(`QRIS Creation Failed: ${err.message}`);
    }
}

// ============================================
// API ROUTES - FIXED & OPTIMIZED
// ============================================
module.exports = [
    {
        name: "Get OTP (tahap 1)",
        desc: "Get OTP Orderkuota",
        category: "Orderkuota",
        path: "/orderkuota/getotp?apikey=&username=&password=",
        async run(req, res) {
            const { apikey, username, password } = req.query;
            
            // VALIDATION
            if (!global.apikey || !global.apikey.includes(apikey)) 
                return res.json({ status: false, error: 'Apikey invalid' });
            if (!username) return res.json({ status: false, error: 'Missing username' });
            if (!password) return res.json({ status: false, error: 'Missing password' });
            
            try {
                const ok = new OrderKuota(null, null, true); // PAKE PROXY!
                const login = await ok.loginRequest(username, password);
                
                if (login && login.results) {
                    res.json({ 
                        status: true, 
                        result: login.results,
                        message: 'OTP sent to your number'
                    });
                } else {
                    res.json({ 
                        status: false, 
                        error: 'Login failed',
                        raw: login 
                    });
                }
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
            
            if (!global.apikey || !global.apikey.includes(apikey)) 
                return res.json({ status: false, error: 'Apikey invalid' });
            if (!username) return res.json({ status: false, error: 'Missing username' });
            if (!otp) return res.json({ status: false, error: 'Missing otp' });
            
            try {
                const ok = new OrderKuota(null, null, true);
                const login = await ok.getAuthToken(username, otp);
                
                if (login && login.results && login.results.auth_token) {
                    res.json({ 
                        status: true, 
                        result: login.results,
                        token: login.results.auth_token
                    });
                } else {
                    res.json({ 
                        status: false, 
                        error: 'Invalid OTP',
                        raw: login 
                    });
                }
            } catch (err) {
                res.status(500).json({ status: false, error: err.message });
            }
        }
    },
    {
        name: "Cek Mutasi QRIS",
        desc: "Cek Mutasi Qris Orderkuota",
        category: "Orderkuota",
        path: "/orderkuota/mutasiqr?apikey=&username=&token=",
        async run(req, res) {
            const { apikey, username, token } = req.query;
            
            if (!global.apikey || !global.apikey.includes(apikey)) 
                return res.json({ status: false, error: 'Apikey invalid' });
            if (!username) return res.json({ status: false, error: 'Missing username' });
            if (!token) return res.json({ status: false, error: 'Missing token' });
            
            try {
                const ok = new OrderKuota(username, token, true);
                const response = await ok.getTransactionQris();
                
                if (response && response.qris_history && response.qris_history.results) {
                    res.json({ 
                        status: true, 
                        result: response.qris_history.results 
                    });
                } else {
                    res.json({ 
                        status: false, 
                        error: 'Failed to get mutasi',
                        raw: response 
                    });
                }
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
            
            if (!global.apikey || !global.apikey.includes(apikey)) 
                return res.json({ status: false, error: 'Apikey invalid' });
            if (!username) return res.json({ status: false, error: 'Missing username' });
            if (!token) return res.json({ status: false, error: 'Missing token' });
            
            try {
                const ok = new OrderKuota(username, token, true);
                const response = await ok.getTransactionQris();
                
                // Extract profile dari response
                res.json({ 
                    status: true, 
                    result: response,
                    profile: response.account || response
                });
            } catch (err) {
                res.status(500).json({ status: false, error: err.message });
            }
        }
    },
    {
        name: "Create QRIS",
        desc: "Generate QR Code Payment",
        category: "Orderkuota",
        path: "/orderkuota/createpayment?apikey=&username=&token=&amount=",
        async run(req, res) {
            const { apikey, username, token, amount } = req.query;
            
            // VALIDASI BENERAN, BUKAN STRING LITERAL!
            if (!global.apikey || !global.apikey.includes(apikey)) 
                return res.json({ status: false, error: 'Apikey invalid' });
            if (!username) return res.json({ status: false, error: 'Missing username' });
            if (!token) return res.json({ status: false, error: 'Missing token' });
            if (!amount) return res.json({ status: false, error: 'Missing amount' });
            if (isNaN(amount) || amount <= 0) return res.json({ status: false, error: 'Invalid amount' });

            try {
                const ok = new OrderKuota(username, token, true);
                const qrcodeResp = await ok.generateQr(amount);

                // HANDLE ERROR DENGAN BENER
                if (!qrcodeResp || qrcodeResp.error) {
                    return res.status(400).json({ 
                        status: false, 
                        error: "QRIS generation failed", 
                        message: qrcodeResp?.message || "Server Orderkuota nolak, ganti proxy",
                        raw: qrcodeResp 
                    });
                }

                if (!qrcodeResp.qris_data) {
                    // KALAU KENA BANNED, PAKE FALLBACK QRIS
                    if (qrcodeResp.message === "Gunakan Jaringan Internet Lainnya") {
                        return res.status(403).json({
                            status: false,
                            error: "IP BANNED by Orderkuota",
                            solution: "Ganti proxy atau deploy ulang pake IP Indo",
                            raw: qrcodeResp
                        });
                    }
                    
                    return res.status(400).json({ 
                        status: false, 
                        error: "QRIS data not found", 
                        raw: qrcodeResp 
                    });
                }

                const qrisResult = await createQRIS(amount, qrcodeResp.qris_data);
                
                res.status(200).json({
                    status: true,
                    creator: "IKY RESTAPI",
                    result: qrisResult
                });
                
            } catch (error) {
                res.status(500).json({ 
                    status: false, 
                    error: error.message,
                    solution: "Coba lagi pake proxy lain atau ganti jaringan"
                });
            }
        }
    },
    {
        name: "Withdraw QRIS",
        desc: "Tarik saldo QRIS Orderkuota",
        category: "Orderkuota",
        path: "/orderkuota/wdqr?apikey=&username=&token=&amount=",
        async run(req, res) {
            const { apikey, username, token, amount } = req.query;
            
            // FIX: PAKE VARIABLE DARI QUERY, BUKAN HARDCODE!
            if (!global.apikey || !global.apikey.includes(apikey)) 
                return res.json({ status: false, error: 'Apikey invalid' });
            if (!username) return res.json({ status: false, error: 'Missing username' });
            if (!token) return res.json({ status: false, error: 'Missing token' });
            if (!amount) return res.json({ status: false, error: 'Missing amount' });

            try {
                const ok = new OrderKuota(username, token, true);
                const wd = await ok.withdrawalQris(amount);
                
                res.json({ 
                    status: true, 
                    result: wd 
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
        name: "QRIS Generator (Offline Mode)",
        desc: "Generate QRIS tanpa login (testing)",
        category: "Orderkuota",
        path: "/orderkuota/qrisgen?apikey=&amount=&qrisdata=",
        async run(req, res) {
            const { apikey, amount, qrisdata } = req.query;
            
            if (!global.apikey || !global.apikey.includes(apikey)) 
                return res.json({ status: false, error: 'Apikey invalid' });
            if (!amount) return res.json({ status: false, error: 'Missing amount' });
            if (!qrisdata) return res.json({ status: false, error: 'Missing qrisdata' });

            try {
                const qrisResult = await createQRIS(amount, qrisdata);
                
                res.status(200).json({
                    status: true,
                    creator: "IKY RESTAPI - OFFLINE MODE",
                    result: qrisResult
                });
            } catch (error) {
                res.status(500).json({ 
                    status: false, 
                    error: error.message 
                });
            }
        }
    }
];