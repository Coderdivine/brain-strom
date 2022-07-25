const axios = require("axios");
const Web3 = require("web3");
const web3 = new Web3("https://bsc-dataseed.binance.org/");
const Coingecko = require("coingecko-api");
require("dotenv").config();
const Models = require("./model.js");
const address = "0x82f1A8F5460B24810C52BDB4416425eCB60C048A";
const privateKey = process.env.PRIVATEKEY;
const BscContracts = require("./Bot.json");
const CoinGeckoClient = new Coingecko();
//watch both bnb and btc on bsc bep20...
async function getCoinId(){
    let a_ = await CoinGeckoClient.coins.list();
    return a_;
}
async function getCurrentPrice(){
    let data = await CoinGeckoClient.coins.fetch('bitcoin', {});
    return data;
};
// /getCoinId().then(console.log)
getCurrentPrice().then(console.log)