import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {type : String, unique : true, required: true,trim : true},
    email : {type : String,unique : true , required : true,lowercase : true, trim : true,match : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/},
    password : {type : String,required : true, match : /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/}
});

export const User = mongoose.model("User",userSchema);

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type : Number , required : true},
  category: {type :  String, default : 'Unknown'},
  date: {type : Date , required : true},
  description: {type : String},
},{timestamps : true});

TransactionSchema.index({userId : 1});

export const Transaction = mongoose.model('Transaction',TransactionSchema);