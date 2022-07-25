const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brainstrom = new Schema({
    old_price:{
        type:Number,
        required:true 
    },
    counts:{
        type:Number,
        required:true 
    },
    update:{
        type:Date,
        default:Date.now()
    }
})

const Brainstorm = mongoose.model("brainstrom",brainstrom);
module.exports = Brainstorm;