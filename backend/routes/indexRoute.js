import express from 'express';
import { body, validationResult } from 'express-validator';
import {User} from '../models/Users.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

export const indexRouter = express.Router();

const registerValidation = [

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required.')
    .isAlphanumeric().withMessage('Username must be alphanumeric.'),


  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email address.'),  


  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain a digit.')
    .matches(/[#?!@$%^&*-]/).withMessage('Password must contain a special character.'),

];

const registerLogin = [

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required.')
    .isAlphanumeric().withMessage('Username must be alphanumeric.'),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain a digit.')
    .matches(/[#?!@$%^&*-]/).withMessage('Password must contain a special character.'),

];

indexRouter.post('/register',registerValidation,async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {username,email,password} = req.body;
    const hash = await bcrypt.hash(password,12);
    try{
        const user = await User.create({username,email,password : hash});
        res.status(200).json({
            success : true,
            message : "User created Succesfully"
        });
    }catch(error){
        if(error.code === 11000){
            //duplicate key
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({error : `duplicated ${field} found`});
        }
        res.status(500).json({error : 'Server error'});
    }
});

indexRouter.post('/login',registerLogin,async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()});
    }
    const {username,password} = req.body;
    const user = await User.findOne({username : username});
    if(!user || !await bcrypt.compare(password,user.password)){
       return res.status(401).json({
            success : false,
            message : "Invalid credentials" 
        });
    }
    const access = signAccess(user._id);
    const refresh = signRefresh(user._id);

    res.cookie("jid", refresh, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    path:     "/refresh",
    maxAge:   24*60*60*1000, // 1d in ms
  });

    res.json({ token : access });

});

indexRouter.get('/refresh',(req,res)=>{
    const token = req.cookies.jid;
    if(!token) {
        return res.status(401).json({
            success : false,
            message : "User unauthorized"
        });
    }

    let payload;
    try{
        payload =  jwt.verify(token,process.env.SECRET_KEY);
    }catch(error){
        return res.status(401).json({
            success : false,
            message : "User unauthorized"
        });
    }

    const access = signAccess(payload.sub);

    res.json({token : access});
});

indexRouter.post('/logout', (req,res) => {
    res.clearCookie("jid",{path : '/refresh'}).end();
});

function signAccess(userId){
    return jwt.sign({sub: userId},process.env.SECRET_KEY,{expiresIn : "15m"});
}

function signRefresh(userId){
    return jwt.sign({sub:userId},process.env.SECRET_KEY,{expiresIn : "1d"});
}

