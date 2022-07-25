const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brainstrom = new Schema({
    pass:{
        type:String,
        required:true
    },
    expires:{
        type:Date,
        default:Date.now() + 3600000
    }
})

const Brainstorm = mongoose.model("brainstrom",brainstrom);
module.exports = Brainstorm;