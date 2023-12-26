const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,

    },
    email:{

        type:String,
        require:true,
        unique:true,

    },
    password:{
        type:String,
        require:true,
    },
    varified:{
        type:Boolean,
        default:false,

    },
    varificationToken:String,
    profileImages:String,
    userDescription:{
        type:String,
        default:null,

    },
    connections:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    connectionReg:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    sendConnectionRequests:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const User = mongoose.model("User",userSchema);
module.exports = User;