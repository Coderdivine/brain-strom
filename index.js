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
        //             
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
async function MakeTradesBNB(change){
    CheckOldPrice().then(async(res)=>{
        let coin = "WBNB"
        console.log("stage@one")
        const old_price = !res.old_price?0:res.old_price;
        const counts = res.counts;
        const constant = res.constant;
        getCurrentPrice().then(show=>{
            console.log("stage@two")
            let btc_price = show['bitcoin']['ngn'];
            let bnb_price = show['binancecoin']['ngn'];
            getBalance("BTCB","WBNB").then(async(result)=>{
                console.log("stage@three")
                const btc = result.res;
                const bnb = result.res_one;
                let btc_main = Number(btc_price) * Number(btc);
                let bnb_main = Number(bnb_price) * Number(bnb);
                    const pure_change = btc_main - old_price;
                    if(pure_change <= Number(change)){
                        //make trade
                        console.log("stage@four")
                        const myContract = new web3.eth.Contract(BscContracts[coin][0].abi,BscContracts[coin][0].contarct);
                        const txs =  myContract.methods.transfer(address,10);
                        console.log("stage@five")
                         const gas = await txs.estimateGas({from:address});
                         console.log("gas"+gas);
                         const gasPrice = await web3.eth.getGasPrice();
                         console.log("gasp"+gasPrice);
                         const data =  txs.encodeABI();
                         console.log( data)
                         const nonce = await web3.eth.getTransactionCount(address);
                         console.log(myContract.options.address)
                        const tx = await  web3.eth.accounts.signTransaction({
                            to:myContract.options.address,
                            data,
                            gas,
                            gasPrice,
                            nonce
                        },privateKey);
                        console.log("stage@six")
                        console.log("tx" + tx)
                        const rest =  web3.eth.sendSignedTransaction(tx.rawTransaction);
                        console.log("stage@seven")
                        return rest.transactionHash;
                    }else{
                        //try again...
                        return `${pure_change}`
                    }
            });
        })
    })
}
CheckOldPrice().then(console.log)
getBalance("BTCB","WBNB").then(console.log)
//getCoinId().then(console.log)
getCurrentPrice().then(console.log);
MakeTradesBNB(500).then(console.log)