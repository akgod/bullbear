const _ = require("lodash");
const config = require("config");
const rp = require('request-promise');
const CryptoJS = require('crypto-js');  
const moment = require("moment");
const ufuturehostname = "https://fapi.binance.com";
const spothosdtname = "https://api.binance.com";

class binance {
  async uFuture(){
    let url = ufuturehostname + "/fapi/v1/ticker/24hr";  //返回U本位合约24h价格变动情况
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
   let maxBull = "BTCUSDT";
   let maxBullPriceChangePercent = 0.0;
   let maxBear = "BTCUSDT";
   let maxBearPriceChangePercent = 0.0;
   let oneMBull=["BTCUSDT",0,0];  //symbol,成交额度，涨跌幅
   let oneMBear=["BTCUSDT",0,0];
  //  let startTime = new Date().getTime();
  //  console.log(startTime);

   for(let i=0;i<rpbody.length;i++){     
      if(rpbody[i].symbol.indexOf("USDT") != -1 && rpbody[i].symbol.indexOf("_") == -1){
 //////////////////////////////////////////5m行情异动############################
           let symbol = rpbody[i].symbol;
           let interval = "5m";
           let limit = 1;
           let klineurl = ufuturehostname + "/fapi/v1/klines?symbol=" + symbol + "&interval=" + interval+ "&limit="+limit;  //返回U本位合约24h价格变动情况
           let klineoptions = {
             url: klineurl,
             method: "get",
             json: true,
             headers: { "Accept": "application/json"},
           };
           let klinebody = await rp(klineoptions);
           //console.log(klinebody);

           let openPrice = klinebody[0][1];
           let nowPrice = klinebody[0][4];
           let volume = klinebody[0][7];
           let oneMPriceChangePercent = 100*(nowPrice  - openPrice)/openPrice;
           if(nowPrice > openPrice && oneMPriceChangePercent > oneMBull[2]){
             oneMBull[0]= rpbody[i].symbol;
             oneMBull[1]= volume;
             oneMBull[2]=  oneMPriceChangePercent     
           }
           if(nowPrice < openPrice && oneMPriceChangePercent < oneMBear[2]){
            oneMBear[0]= rpbody[i].symbol;
            oneMBear[1]= volume;
            oneMBear[2]=  oneMPriceChangePercent     
          }


        

 ////////////////////////////////////////////////////////////////////////////////
          usdtpairNum++;
          if(parseFloat(rpbody[i].priceChangePercent) > maxBullPriceChangePercent){
            maxBull = rpbody[i].symbol;
            maxBullPriceChangePercent = rpbody[i].priceChangePercent;
          }
          if(parseFloat(rpbody[i].priceChangePercent) < maxBearPriceChangePercent){
            maxBear = rpbody[i].symbol;
            maxBearPriceChangePercent = rpbody[i].priceChangePercent;
          }

          if(parseFloat(rpbody[i].priceChangePercent) >0){
            bullNum++;
            if(parseFloat(rpbody[i].priceChangePercent) > 5){
              up5PercendNum++;
            }
          }else{
            bearNum++;
            if(parseFloat(rpbody[i].priceChangePercent) < -5){
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
   console.log("******************多空情绪**********************");
   console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]`);
   console.log("U本位合约数量=",usdtpairNum);
   console.log("上涨数量=",bullNum,"上涨比例=",bullPercent);
   console.log("下跌数量=",bearNum,"下跌比例=",bearPercent);
   console.log("涨幅5%以上数量=",up5PercendNum,"比例=",up5Percend);
   console.log("跌幅5%以上数量=",down5PercendNum,"比例=",down5Percend);
   console.log("当前涨幅最大：",maxBull,"上涨幅度=",maxBullPriceChangePercent);
   console.log("当前跌幅最大",maxBear,"下跌幅度=",maxBearPriceChangePercent);
   console.log("*****************1分钟异动***********************");
   console.log(oneMBull[0]+ "快速拉升"+ oneMBull[2].toFixed(2)+ "%","成交额:",oneMBull[1]);
   console.log(oneMBear[0]+ "快速下跌"+ oneMBear[2].toFixed(2)+ "%","成交额:",oneMBear[1]);
  //  let endTime = new Date().getTime();
  //  console.log(endTime);
  //  console.log(endTime - startTime);
  }  

  async spot(){
    let url = spothosdtname + "/api/v3/ticker/24hr";  //返回现货24h价格变动情况 ?symbol=BTCUSDT
    let options = {
      url: url,
      method: "get",
      json: true,
      headers: { "Accept": "application/json"},
    };
   let rpbody = await rp(options);  
   console.log("rpnbody" , rpbody );
   console.log("rpnbody-num=" , rpbody.length);
   let usdtpairNum = 0;
   let bullNum = 0;
   let bearNum = 0;
   let up5PercendNum =0;
   let down5PercendNum =0;
   
   for(let i=0;i<rpbody.length;i++){     
     if(rpbody[i].symbol.indexOf("USDT") != -1){
      console.log('"'+rpbody[i].symbol+'"'+',',rpbody[i].priceChangePercent );

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
   console.log("USDT现货交易对数量=",usdtpairNum);
   console.log("上涨数量=",bullNum,"上涨比例=",bullPercent);
   console.log("下跌数量=",bearNum,"下跌比例=",bearPercent);
   console.log("涨幅5%以上数量=",up5PercendNum,"比例=",up5Percend);
   console.log("跌幅5%以上数量=",down5PercendNum,"比例=",down5Percend);
   console.log("**********************************************");

  }  

}

let ba = new binance();
module.exports = ba;

ba.uFuture().then(console.log)
//ba.spot();

