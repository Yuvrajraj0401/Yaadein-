const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fileModel = require('../models/files.models');



router.get('/register', (req,res)=>{
    res.render('register')
})
router.post('/register',
    body('email').trim().isEmail().isLength({min:13}),
    body('password').trim().isLength({min:5}),
    body('username').trim().isLength({min:3}),
    async (req,res)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
           return res.status(400).json({
            errors: errors.array(),
            message: 'Invalid data'
           })
        }

        const {email , username , password}=req.body;

        const hashedpassword = await bcrypt.hash(password, 10);


        const newUser = await userModel.create({
            username,
            email,
            password: hashedpassword
        })


        res.redirect('/user/login');


    }
        
        
)

router.get('/login', (req,res)=>{
    res.render('login');
})

router.post('/login',
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:5}),
    async (req,res)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array(),
                message: 'Invalid data'
            })
        }

        const {username , password} = req.body;

        const user = await userModel.findOne({
            username: username
        })

        if(!user){
            return res.status(400).json({
                alert: 'username or password in incorrect'
            })
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({
                alert: `username or password incorrect`
            })
        }
        //agr password match kr jata hai toh hm ek token create krenge !!

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username:user.username,
        },process.env.JWT_SECRET,)//ab iske baad hme is data/token ko frontend m nhejna hota hai

        res.cookie('token', token)


        // Login success ke baad files fetch karenge
            const userFiles = await fileModel.find({ user: user._id });

        res.render('home', {
            files: userFiles
        });


    })
    // Logout route
    router.get('/logout', (req, res) => {
    // Clear the token cookie
    res.clearCookie('token', {
        httpOnly: true,  // Match how you set the cookie
        secure: false,   // Change to true if using HTTPS
        sameSite: 'strict' // Optional, match if used
    });

    // You can redirect or send JSON
    res.redirect('/user/login');
    // Or if you prefer JSON:
    // res.status(200).json({ message: 'Logged out successfully' });
    });


module.exports = router;