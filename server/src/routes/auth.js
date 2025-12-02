
import express from 'express';
import { connection } from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieMiddleware from '../middleware/cookie-auth.js';
//import crypto from 'crypto';


const router = express.Router();

//AES KEY and IV should be 32 bytes and 16 bytes respectively for aes-256-cbc
// const Algorithm = 'aes-256-cbc';
// const AES_KEY = Buffer.from(process.env.AES_KEY, 'hex'); 
// const IV = Buffer.from(process.env.IV, 'hex');


router.get('/user', cookieMiddleware ,async (req,res)=>{
    if(!req.user){
        return res.status(401).json({ message: 'Unauthorized' });
    };
    console.log(req.user);
    res.status(200).json({ message: 'User authenticated', user: req.user });
})



router.post('/login', async (req, res) => {
    const { password, email, remember } = req.body;

    connection.query(`Select * from userdata where  Email= ?`,[email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error:  err.sqlState });
        };
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        };
        try{
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.Passkey);

            if (passwordMatch) {
                const token = jwt.sign({Email: user.Email, UserId: user.UserId, Username: user.Username}, process.env.JWT_SECRET, { expiresIn: remember ? '7d':'1h' });
                

                
                res.cookie('file_token', token, {
                    httpOnly: true,
                    secure: false, // Only secure in production (HTTPS)
                    maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 7 days or 1 hour
                    sameSite: 'lax'
                });
                

                
                return res.status(200).json({ message: 'Login successful', user: { UserId: user.UserId, Email: user.Email, Username: user.Username } });
            } else {
                return res.status(401).json({ message: 'Invalid email or password' });
            };

        } catch(err){
            return res.status(500).json({ message: 'Server error', error: err });
        }


    });
});

router.post('/register', async (req, res) => {
    const { Newemail, Newusername, Newpassword } = req.body;

    connection.query(`Select * from userdata where Email=?`,[Newemail], async (err,result)=>{
        if(err){
            return res.status(500).json({ message: 'Database error', error:  err.sqlState });
        };

        if(result.length > 0){
            return  res.status(409).json({ message: 'Email already registered' });
        };

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Newpassword, salt);

            connection.query(`Insert into userdata (Email, Username, Passkey) values (?,?,?)`,[Newemail, Newusername, hashedPassword], async (err, result)=>{
                if(err){
                    return res.status(500).json({ message: 'Database error', error:  err.sqlState });
                };

                if (result.affectedRows < 1){
                    return res.status(500).json({ message: 'Registration failed' });
                }else{
                    return res.status(201).json({ message: 'Registration successful' });
                };

            });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err });
        };

    })



});


// logout route
router.post('/logout', async (_req, res)=>{

    try{
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.clearCookie('file_token', {
        httpOnly:true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    })
    
    console.log(' User logged out, cookie cleared');
    
    return res.status(200).json({ message: 'Logout successful'});

    }catch(err){
        return res.status(500).json({ message: 'Server error', error: err });
    }
});







export default router;