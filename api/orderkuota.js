const _0x324129=_0x51de;(function(_0x1b2b36,_0x5c85dc){const _0x58d2cb=_0x51de,_0xe3e990=_0x1b2b36();while(!![]){try{const _0x108bb7=parseInt(_0x58d2cb(0x189))/0x1+-parseInt(_0x58d2cb(0x197))/0x2*(-parseInt(_0x58d2cb(0x191))/0x3)+-parseInt(_0x58d2cb(0x158))/0x4+parseInt(_0x58d2cb(0x192))/0x5+-parseInt(_0x58d2cb(0x19c))/0x6*(-parseInt(_0x58d2cb(0x157))/0x7)+parseInt(_0x58d2cb(0x175))/0x8*(parseInt(_0x58d2cb(0x198))/0x9)+-parseInt(_0x58d2cb(0x177))/0xa*(parseInt(_0x58d2cb(0x154))/0xb);if(_0x108bb7===_0x5c85dc)break;else _0xe3e990['push'](_0xe3e990['shift']());}catch(_0x2530cb){_0xe3e990['push'](_0xe3e990['shift']());}}}(_0x47e2,0xede8c));const fetch=(..._0x590307)=>import('node-fetch')[_0x324129(0x160)](({default:_0x38b86d})=>_0x38b86d(..._0x590307)),{URLSearchParams}=require(_0x324129(0x16c)),crypto=require(_0x324129(0x185)),QRCode=require(_0x324129(0x180)),{ImageUploadService}=require(_0x324129(0x195));function _0x51de(_0x26a822,_0x2efb78){const _0x47e2c8=_0x47e2();return _0x51de=function(_0x51deab,_0x102d56){_0x51deab=_0x51deab-0x142;let _0x6a35f3=_0x47e2c8[_0x51deab];return _0x6a35f3;},_0x51de(_0x26a822,_0x2efb78);}class OrderKuota{static ['API_URL']=_0x324129(0x193);static [_0x324129(0x143)]=_0x324129(0x153);static [_0x324129(0x1a0)]='app.orderkuota.com';static [_0x324129(0x182)]=_0x324129(0x18d);static [_0x324129(0x17f)]=_0x324129(0x18a);static [_0x324129(0x15f)]=_0x324129(0x150);static ['APP_REG_ID']=_0x324129(0x15d);static [_0x324129(0x16b)]=_0x324129(0x19d);static [_0x324129(0x145)]='di309HvATsaiCppl5eDpoc';static [_0x324129(0x188)]='9';constructor(_0xfa9800=null,_0x38f07e=null){const _0x391102=_0x324129;this[_0x391102(0x146)]=_0xfa9800,this[_0x391102(0x142)]=_0x38f07e;}async[_0x324129(0x15b)](_0x4ac92d,_0x37f41a){const _0x16460d=_0x324129,_0x37cfc5=new URLSearchParams({'username':_0x4ac92d,'password':_0x37f41a,'request_time':Date[_0x16460d(0x14a)](),'app_reg_id':OrderKuota['APP_REG_ID'],'phone_android_version':OrderKuota[_0x16460d(0x188)],'app_version_code':OrderKuota[_0x16460d(0x15f)],'phone_uuid':OrderKuota[_0x16460d(0x145)]});return await this[_0x16460d(0x19e)](_0x16460d(0x165),OrderKuota[_0x16460d(0x181)]+_0x16460d(0x183),_0x37cfc5);}async[_0x324129(0x156)](_0x3bf774,_0x38aa1c){const _0x1de233=_0x324129,_0x6029a0=new URLSearchParams({'username':_0x3bf774,'password':_0x38aa1c,'request_time':Date[_0x1de233(0x14a)](),'app_reg_id':OrderKuota[_0x1de233(0x167)],'phone_android_version':OrderKuota[_0x1de233(0x188)],'app_version_code':OrderKuota['APP_VERSION_CODE'],'phone_uuid':OrderKuota[_0x1de233(0x145)]});return await this['request'](_0x1de233(0x165),OrderKuota[_0x1de233(0x181)]+'/login',_0x6029a0);}async[_0x324129(0x166)](_0x2a375f='',_0x3d9a40=null){const _0x30cb1d=_0x324129;!_0x3d9a40&&this[_0x30cb1d(0x142)]&&(_0x3d9a40=this['authToken'][_0x30cb1d(0x16e)](':')[0x0]);const _0x1864e3=new URLSearchParams({'request_time':Date[_0x30cb1d(0x14a)](),'app_reg_id':OrderKuota[_0x30cb1d(0x167)],'phone_android_version':OrderKuota[_0x30cb1d(0x188)],'app_version_code':OrderKuota[_0x30cb1d(0x15f)],'phone_uuid':OrderKuota[_0x30cb1d(0x145)],'auth_username':this[_0x30cb1d(0x146)],'auth_token':this[_0x30cb1d(0x142)],'requests[qris_history][jumlah]':'','requests[qris_history][jenis]':_0x2a375f,'requests[qris_history][page]':'1','requests[qris_history][dari_tanggal]':'','requests[qris_history][ke_tanggal]':'','requests[qris_history][keterangan]':'','requests[0]':'account','app_version_name':OrderKuota['APP_VERSION_NAME'],'ui_mode':_0x30cb1d(0x19b),'phone_model':OrderKuota[_0x30cb1d(0x16b)]}),_0x128b33=_0x3d9a40?OrderKuota['API_URL']+_0x30cb1d(0x18b)+_0x3d9a40:OrderKuota[_0x30cb1d(0x181)]+_0x30cb1d(0x15c);return await this['request'](_0x30cb1d(0x165),_0x128b33,_0x1864e3);}async[_0x324129(0x144)](_0x4398ab=''){const _0x34006d=_0x324129,_0x12e091=new URLSearchParams({'request_time':Date[_0x34006d(0x14a)](),'app_reg_id':OrderKuota[_0x34006d(0x167)],'phone_android_version':OrderKuota[_0x34006d(0x188)],'app_version_code':OrderKuota['APP_VERSION_CODE'],'phone_uuid':OrderKuota[_0x34006d(0x145)],'auth_username':this[_0x34006d(0x146)],'auth_token':this['authToken'],'requests[qris_merchant_terms][jumlah]':_0x4398ab,'requests[0]':_0x34006d(0x171),'app_version_name':OrderKuota[_0x34006d(0x17f)],'ui_mode':_0x34006d(0x19b),'phone_model':OrderKuota[_0x34006d(0x16b)]}),_0x463379=await this[_0x34006d(0x19e)](_0x34006d(0x165),OrderKuota[_0x34006d(0x181)]+'/get',_0x12e091);try{if(_0x463379['success']&&_0x463379[_0x34006d(0x171)]&&_0x463379[_0x34006d(0x171)][_0x34006d(0x162)])return _0x463379[_0x34006d(0x171)]['results'];return _0x463379;}catch(_0x5ad357){return{'error':_0x5ad357[_0x34006d(0x19f)],'raw':_0x463379};}}async[_0x324129(0x18e)](_0x3e2a35=''){const _0x2f6dde=_0x324129,_0x248b84=new URLSearchParams({'request_time':Date[_0x2f6dde(0x14a)](),'app_reg_id':OrderKuota[_0x2f6dde(0x167)],'phone_android_version':OrderKuota[_0x2f6dde(0x188)],'app_version_code':OrderKuota[_0x2f6dde(0x15f)],'phone_uuid':OrderKuota[_0x2f6dde(0x145)],'auth_username':this[_0x2f6dde(0x146)],'auth_token':this[_0x2f6dde(0x142)],'requests[qris_withdraw][amount]':_0x3e2a35,'requests[0]':_0x2f6dde(0x19a),'app_version_name':OrderKuota[_0x2f6dde(0x17f)],'ui_mode':_0x2f6dde(0x19b),'phone_model':OrderKuota[_0x2f6dde(0x16b)]});return await this[_0x2f6dde(0x19e)](_0x2f6dde(0x165),OrderKuota['API_URL']+_0x2f6dde(0x15c),_0x248b84);}[_0x324129(0x149)](){const _0x526e00=_0x324129;return{'Host':OrderKuota[_0x526e00(0x1a0)],'User-Agent':OrderKuota[_0x526e00(0x182)],'Content-Type':_0x526e00(0x18c)};}async[_0x324129(0x19e)](_0x19b7cc,_0x5804a0,_0x152caf=null){const _0x3f9a88=_0x324129;try{const _0x4d82dd=await fetch(_0x5804a0,{'method':_0x19b7cc,'headers':this[_0x3f9a88(0x149)](),'body':_0x152caf?_0x152caf[_0x3f9a88(0x14e)]():null}),_0xe083a3=_0x4d82dd['headers']['get'](_0x3f9a88(0x16a));return _0xe083a3&&_0xe083a3[_0x3f9a88(0x16d)](_0x3f9a88(0x155))?await _0x4d82dd[_0x3f9a88(0x164)]():await _0x4d82dd['text']();}catch(_0x489b1d){return{'error':_0x489b1d[_0x3f9a88(0x19f)]};}}}function convertCRC16(_0x560e8e){const _0x2ca1ad=_0x324129;let _0x15372b=0xffff;for(let _0x50df49=0x0;_0x50df49<_0x560e8e[_0x2ca1ad(0x152)];_0x50df49++){_0x15372b^=_0x560e8e[_0x2ca1ad(0x159)](_0x50df49)<<0x8;for(let _0x1c0cb6=0x0;_0x1c0cb6<0x8;_0x1c0cb6++){_0x15372b=_0x15372b&0x8000?_0x15372b<<0x1^0x1021:_0x15372b<<0x1;}}return(_0x2ca1ad(0x151)+(_0x15372b&0xffff)[_0x2ca1ad(0x14e)](0x10)['toUpperCase']())[_0x2ca1ad(0x178)](-0x4);}function generateTransactionId(){const _0x1cfe96=_0x324129;return'IKYRESTAPI-'+crypto[_0x1cfe96(0x196)](0x2)[_0x1cfe96(0x14e)]('hex')[_0x1cfe96(0x199)]();}function generateExpirationTime(){const _0x5e024e=_0x324129,_0x1c21b7=new Date();return _0x1c21b7[_0x5e024e(0x17c)](_0x1c21b7[_0x5e024e(0x194)]()+0x1e),_0x1c21b7;}async function elxyzFile(_0x3458ca){const _0x240d6a=_0x324129,_0x2905bd=new ImageUploadService(_0x240d6a(0x161)),{directLink:_0x1e7420}=await _0x2905bd[_0x240d6a(0x174)](_0x3458ca,_0x240d6a(0x17e));return _0x1e7420;}function _0x47e2(){const _0x1e7ea1=['4512190ySVhFy','slice','Cek\x20Mutasi\x20QRIS','status','Missing\x20password','setMinutes','/orderkuota/wdqr?apikey=&username=&token=&amount=','ikyrestapi.png','APP_VERSION_NAME','qrcode','API_URL','USER_AGENT','/login','Missing\x20token','crypto','toBuffer','Missing\x20username','PHONE_ANDROID_VERSION','1532825vtdTXt','25.08.11','/qris/mutasi/','application/x-www-form-urlencoded','okhttp/4.12.0','withdrawalQris','Orderkuota','5802ID','3sFgpeR','7741340EOiFql','https://app.orderkuota.com/api/v2','getMinutes','node-upload-images','randomBytes','3008846frPiZn','9zKUzdx','toUpperCase','account','light','18sQIXRv','SM-G960N','request','message','HOST','Get\x20OTP\x20Orderkuota','exports','authToken','API_URL_ORDER','generateQr','PHONE_UUID','username','/orderkuota/profile?apikey=&username=&token=','query','buildHeaders','now','Withdraw\x20QRIS','Get\x20Token\x20Orderkuota','010211','toString','Generate\x20QR\x20Code\x20Payment','250811','000','length','https://app.orderkuota.com/api/v2/order','77nWVtED','application/json','getAuthToken','1131242AJaqcW','3953968SQMJrv','charCodeAt','Create\x20QRIS','loginRequest','/get','di309HvATsaiCppl5eDpoc:APA91bFUcTOH8h2XHdPRz2qQ5Bezn-3_TaycFcJ5pNLGWpmaxheQP9Ri0E56wLHz0_b1vcss55jbRQXZgc9loSfBdNa5nZJZVMlk7GS1JDMGyFUVvpcwXbMDg8tjKGZAurCGR4kDMDRJ','Cek\x20Profile\x20Orderkuota','APP_VERSION_CODE','then','pixhost.to','results','apikey','json','POST','getTransactionQris','APP_REG_ID','/orderkuota/getotp?apikey=&username=&password=','QRIS\x20generation\x20failed','content-type','PHONE_MODEL','url','includes','split','qris_data','Cek\x20Profile','qris_merchant_terms','Apikey\x20invalid','Missing\x20amount','uploadFromBinary','409336KHNenK','Get\x20Token\x20(tahap\x202)'];_0x47e2=function(){return _0x1e7ea1;};return _0x47e2();}async function createQRIS(_0x17edf4,_0x2abb25){const _0x1b4689=_0x324129;let _0x55cd11=_0x2abb25;_0x55cd11=_0x55cd11[_0x1b4689(0x178)](0x0,-0x4);const _0x4470ad=_0x55cd11['replace'](_0x1b4689(0x14d),'010212'),_0x250270=_0x4470ad['split'](_0x1b4689(0x190));_0x17edf4=_0x17edf4[_0x1b4689(0x14e)]();let _0x55c57c='54'+('0'+_0x17edf4[_0x1b4689(0x152)])[_0x1b4689(0x178)](-0x2)+_0x17edf4;_0x55c57c+=_0x1b4689(0x190);const _0x24108e=_0x250270[0x0]+_0x55c57c+_0x250270[0x1],_0x3417e0=_0x24108e+convertCRC16(_0x24108e),_0x1e9ed1=await QRCode[_0x1b4689(0x186)](_0x3417e0),_0x318146=await elxyzFile(_0x1e9ed1);return{'idtransaksi':generateTransactionId(),'jumlah':_0x17edf4,'expired':generateExpirationTime(),'imageqris':{'url':_0x318146}};}module[_0x324129(0x1a2)]=[{'name':'Get\x20OTP\x20(tahap\x201)','desc':_0x324129(0x1a1),'category':_0x324129(0x18f),'path':_0x324129(0x168),async 'run'(_0x290df2,_0x4e5c1f){const _0x10e246=_0x324129,{apikey:_0x2ed698,username:_0x3fb1e8,password:_0x3ac2d0}=_0x290df2[_0x10e246(0x148)];if(!global['apikey'][_0x10e246(0x16d)](_0x2ed698))return _0x4e5c1f[_0x10e246(0x164)]({'status':![],'error':'Apikey\x20invalid'});if(!_0x3fb1e8)return _0x4e5c1f[_0x10e246(0x164)]({'status':![],'error':'Missing\x20username'});if(!_0x3ac2d0)return _0x4e5c1f[_0x10e246(0x164)]({'status':![],'error':_0x10e246(0x17b)});try{const _0xbc4b6f=new OrderKuota(),_0x434428=await _0xbc4b6f['loginRequest'](_0x3fb1e8,_0x3ac2d0);_0x4e5c1f['json']({'status':!![],'result':_0x434428['results']});}catch(_0x39fdab){_0x4e5c1f[_0x10e246(0x17a)](0x1f4)[_0x10e246(0x164)]({'status':![],'error':_0x39fdab[_0x10e246(0x19f)]});}}},{'name':_0x324129(0x176),'desc':_0x324129(0x14c),'category':_0x324129(0x18f),'path':'/orderkuota/gettoken?apikey=&username=&otp=',async 'run'(_0x55663f,_0x4c95a5){const _0x2a4f4a=_0x324129,{apikey:_0x30235f,username:_0x4be49b,otp:_0xbe453a}=_0x55663f[_0x2a4f4a(0x148)];if(!global[_0x2a4f4a(0x163)]['includes'](_0x30235f))return _0x4c95a5[_0x2a4f4a(0x164)]({'status':![],'error':_0x2a4f4a(0x172)});if(!_0x4be49b)return _0x4c95a5[_0x2a4f4a(0x164)]({'status':![],'error':_0x2a4f4a(0x187)});if(!_0xbe453a)return _0x4c95a5[_0x2a4f4a(0x164)]({'status':![],'error':'Missing\x20otp'});try{const _0x4c85e1=new OrderKuota(),_0x31b753=await _0x4c85e1['getAuthToken'](_0x4be49b,_0xbe453a);_0x4c95a5[_0x2a4f4a(0x164)]({'status':!![],'result':_0x31b753['results']});}catch(_0x36b928){_0x4c95a5[_0x2a4f4a(0x17a)](0x1f4)[_0x2a4f4a(0x164)]({'status':![],'error':_0x36b928[_0x2a4f4a(0x19f)]});}}},{'name':_0x324129(0x179),'desc':'Cek\x20Mutasi\x20Qris\x20Orderkuota','category':'Orderkuota','path':'/orderkuota/mutasiqr?apikey=&username=&token=',async 'run'(_0x15da38,_0x37e1b6){const _0x3f4c46=_0x324129,{apikey:_0x996f01,username:_0x2fcd8f,token:_0xa1ac40}=_0x15da38[_0x3f4c46(0x148)];if(!global[_0x3f4c46(0x163)][_0x3f4c46(0x16d)](_0x996f01))return _0x37e1b6[_0x3f4c46(0x164)]({'status':![],'error':'Apikey\x20invalid'});if(!_0x2fcd8f)return _0x37e1b6[_0x3f4c46(0x164)]({'status':![],'error':_0x3f4c46(0x187)});if(!_0xa1ac40)return _0x37e1b6[_0x3f4c46(0x164)]({'status':![],'error':_0x3f4c46(0x184)});try{const _0x5487bc=new OrderKuota(_0x2fcd8f,_0xa1ac40);let _0x1e1620=await _0x5487bc[_0x3f4c46(0x166)]();_0x1e1620=_0x1e1620['qris_history'][_0x3f4c46(0x162)],_0x37e1b6['json']({'status':!![],'result':_0x1e1620});}catch(_0x1e660d){_0x37e1b6[_0x3f4c46(0x17a)](0x1f4)[_0x3f4c46(0x164)]({'status':![],'error':_0x1e660d[_0x3f4c46(0x19f)]});}}},{'name':_0x324129(0x170),'desc':_0x324129(0x15e),'category':_0x324129(0x18f),'path':_0x324129(0x147),async 'run'(_0x208275,_0xd13501){const _0xa377b4=_0x324129,{apikey:_0x4ce71d,username:_0xd6fcda,token:_0x44d35a}=_0x208275['query'];if(!global[_0xa377b4(0x163)][_0xa377b4(0x16d)](_0x4ce71d))return _0xd13501[_0xa377b4(0x164)]({'status':![],'error':_0xa377b4(0x172)});if(!_0xd6fcda)return _0xd13501[_0xa377b4(0x164)]({'status':![],'error':_0xa377b4(0x187)});if(!_0x44d35a)return _0xd13501[_0xa377b4(0x164)]({'status':![],'error':'Missing\x20token'});try{const _0x4bcf49=new OrderKuota(_0xd6fcda,_0x44d35a);let _0x5f5299=await _0x4bcf49['getTransactionQris']();_0xd13501[_0xa377b4(0x164)]({'status':!![],'result':_0x5f5299});}catch(_0x22fead){_0xd13501['status'](0x1f4)[_0xa377b4(0x164)]({'status':![],'error':_0x22fead['message']});}}},{'name':_0x324129(0x15a),'desc':_0x324129(0x14f),'category':_0x324129(0x18f),'path':'/orderkuota/createpayment?apikey=&username=&token=&amount=',async 'run'(_0x530df0,_0x241a5d){const _0x2e7c08=_0x324129,{apikey:_0x27433c,username:_0x2d1c97,token:_0x3e4eb7,amount:_0x532252}=_0x530df0[_0x2e7c08(0x148)];if(!global[_0x2e7c08(0x163)][_0x2e7c08(0x16d)](_0x27433c))return _0x241a5d[_0x2e7c08(0x164)]({'status':![],'error':'Apikey\x20invalid'});if(!_0x2d1c97)return _0x241a5d['json']({'status':![],'error':'Missing\x20username'});if(!_0x3e4eb7)return _0x241a5d[_0x2e7c08(0x164)]({'status':![],'error':_0x2e7c08(0x184)});if(!_0x532252)return _0x241a5d[_0x2e7c08(0x164)]({'status':![],'error':'Missing\x20amount'});try{const _0xff6391=new OrderKuota(_0x2d1c97,_0x3e4eb7),_0x322aec=await _0xff6391['generateQr'](_0x532252);if(!_0x322aec['qris_data'])return _0x241a5d['status'](0x190)[_0x2e7c08(0x164)]({'status':![],'error':_0x2e7c08(0x169),'raw':_0x322aec});const _0x2cd4c0=await createQRIS(_0x532252,_0x322aec[_0x2e7c08(0x16f)]);_0x241a5d['status'](0xc8)[_0x2e7c08(0x164)]({'status':!![],'result':_0x2cd4c0});}catch(_0x575f9c){_0x241a5d[_0x2e7c08(0x17a)](0x1f4)[_0x2e7c08(0x164)]({'status':![],'error':_0x575f9c['message']});}}},{'name':_0x324129(0x14b),'desc':'Tarik\x20saldo\x20QRIS\x20Orderkuota','category':_0x324129(0x18f),'path':_0x324129(0x17d),async 'run'(_0xabb2be,_0x5d4976){const _0x4454ad=_0x324129,{apikey:_0x1b83c0,username:_0x9e60d4,token:_0x5b5a41,amount:_0x4527ac}=_0xabb2be[_0x4454ad(0x148)];if(!global[_0x4454ad(0x163)][_0x4454ad(0x16d)](_0x1b83c0))return _0x5d4976[_0x4454ad(0x164)]({'status':![],'error':'Apikey\x20invalid'});if(!_0x9e60d4)return _0x5d4976['json']({'status':![],'error':_0x4454ad(0x187)});if(!_0x5b5a41)return _0x5d4976['json']({'status':![],'error':_0x4454ad(0x184)});if(!_0x4527ac)return _0x5d4976['json']({'status':![],'error':_0x4454ad(0x173)});try{const _0x4da6f2=new OrderKuota(_0x9e60d4,_0x5b5a41),_0x53b052=await _0x4da6f2[_0x4454ad(0x18e)](_0x4527ac);_0x5d4976['json']({'status':!![],'result':_0x53b052});}catch(_0x42b246){_0x5d4976[_0x4454ad(0x17a)](0x1f4)[_0x4454ad(0x164)]({'status':![],'error':_0x42b246[_0x4454ad(0x19f)]});}}}];    const endpoint = userId ? 
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
    path: "/orderkuota/mutasiqr?apikey=&username=&token=",
    async run(req, res) {
      const { apikey, username, token } = req.query;
      if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
      if (!username) return res.json({ status: false, error: 'Missing username' });
      if (!token) return res.json({ status: false, error: 'Missing token' });
      try {
        const ok = new OrderKuota(username, token);
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
    path: "/orderkuota/createpayment?apikey=&username=&token=&amount=",
    async run(req, res) {
      const { apikey, username, token, amount } = req.query;
      if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
      if (!username) return res.json({ status: false, error: 'Missing username' });
      if (!token) return res.json({ status: false, error: 'Missing token' });
      if (!amount) return res.json({ status: false, error: 'Missing amount' });

      try {
        const ok = new OrderKuota(username, token);
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
    path: "/orderkuota/wdqr?apikey=&username=&token=&amount=",
    async run(req, res) {
      const { apikey, username, token, amount } = req.query;
      if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });
      if (!username) return res.json({ status: false, error: 'Missing username' });
      if (!token) return res.json({ status: false, error: 'Missing token' });
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
