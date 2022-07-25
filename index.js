const axios = require("axios");
const Web3 = require("web3");
const coingecko = require("coingecko-api");
require("dotenv").config();
const address = "";
const privateKey = process.env.PRIVATEKEY;
const BscContracts = require("./Bot.json");
//watch both bnb and btc on bsc bep20...
