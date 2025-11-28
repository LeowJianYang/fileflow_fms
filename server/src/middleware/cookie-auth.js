
import jwt from 'jsonwebtoken';

export default function cookieMiddleware(req, res, next) {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = req.cookies.file_token;

    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
    };

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } 
    catch(err){
        return res.status(401).json({ message: 'Invalid token', error: err });
    }
}
