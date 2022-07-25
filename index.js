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
const mongoose = require("mongoose");
//process.env.AUTH_URI ||
mongoose.connect('mongodb://localhost:27017/users');
require("./db");
//watch both bnb and btc on bsc bep20...
async function getCoinId(){
    let a_ = await CoinGeckoClient.coins.list();
    const filters = a_.data.filter(x=>x.symbol == "bnb");
    return filters;
}
async function CheckOldPrice(){
    const find = await Models.find();
    if(!find.length){
        return "NAN"
    }else{
        return find[0];
    }
};
async function getCurrentPrice(){
    let data = await CoinGeckoClient.simple.price({
        ids: ['bitcoin', 'binancecoin'],
        vs_currencies: ['ngn', 'usd'],
    });
    return data.data;
};
async function getBalance(coin,coins){
    const myContract = new web3.eth.Contract(BscContracts[coin][0].abi,BscContracts[coin][0].contarct)//, {gasPrice:5555555,from:caller}
    const myContracts = new web3.eth.Contract(BscContracts[coins][0].abi,BscContracts[coin][0].contarct)//, {gasPrice:5555555,from:caller}
    try{               
    const res = await myContract.methods.balanceOf(address).call();
    const res_one = await myContracts.methods.balanceOf(address).call();
    return {
        res,
        res_one
    }
    }catch(error){
    return error.message
     }
};
async function MakeTrades(change){
    CheckOldPrice().then(res=>{
        const old_price = res.old_price;
        const counts = res.counts;
        const constant = res.constant;
        getCurrentPrice().then(show=>{
            let btc_price = show['bitcoin'];
            let bnb_price = show['binancecoin'];
            getBalance("USDT","WBTC").then(result=>{

            })
        })
    })
}
CheckOldPrice().then(console.log)
getBalance("USDT","WBTC").then(console.log)
//getCoinId().then(console.log)
getCurrentPrice().then(console.log)