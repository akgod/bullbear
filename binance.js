const _ = require("lodash");
const config = require("config");
const rp = require('request-promise');
const CryptoJS = require('crypto-js');  
const moment = require("moment");
const hostname = "https://fapi.binance.com";

class binance {
  async uFuture(){
    let url = hostname + "/fapi/v1/ticker/24hr";  //返回U本位合约24h价格变动情况
    let options = {
      url: url,
      method: "get",
      json: true,
      headers: { "Accept": "application/json"},
    };
   let rpbody = await rp(options);  
   //console.log("rpnbody" , rpbody );
   //console.log("rpnbody-num=" , rpbody.length);
   let usdtpairNum = 0;
   let bullNum = 0;
   let bearNum = 0;
   let up5PercendNum =0;
   let down5PercendNum =0;
   for(let i=0;i<rpbody.length;i++){     
     if(rpbody[i].symbol.indexOf("USDT") != -1){
       usdtpairNum++;
       if(rpbody[i].priceChangePercent >0){
         bullNum++;
         if(rpbody[i].priceChangePercent > 5){
           up5PercendNum++;
         }
       }else{
         bearNum++;
         if(rpbody[i].priceChangePercent < -5){
          down5PercendNum++;
         }
       }       
     }
   }
   let bullPercent = (bullNum / usdtpairNum).toFixed(2);
   let bearPercent = (bearNum / usdtpairNum).toFixed(2);
   let up5Percend = (up5PercendNum / bullNum).toFixed(2);
   let down5Percend = (down5PercendNum / bearNum).toFixed(2);

   console.log(`\n\n`);
   console.log("**********************************************");
   console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]`);
   console.log("U本位合约数量=",usdtpairNum);
   console.log("上涨数量=",bullNum,"上涨比例=",bullPercent);
   console.log("下跌数量=",bearNum,"下跌比例=",bearPercent);
   console.log("涨幅5%以上数量=",up5PercendNum,"比例=",up5Percend);
   console.log("跌幅5%以上数量=",down5PercendNum,"下跌比例=",down5Percend);
   console.log("**********************************************");

  }  

}

let ba = new binance();
module.exports = ba;

//ba.uFuture().then(console.log)

