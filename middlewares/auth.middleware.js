const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports =(req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing' });
    try {
        const playload = jwt.verify(token,process.env.JWT_SECRET);
        req.user = playload;
        next();
    } catch (error) {
        console.log("authentication failed");
    }
}