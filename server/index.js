
import './utils/loadenv.js';

import express from 'express';
import parser from 'cookie-parser';
import cors from 'cors';
import authRouter from './src/routes/auth.js';
import fileRoute from './src/routes/files.js';
import CookieMiddleware from './src/middleware/cookie-auth.js';
import sharedRouter from './src/routes/share.js';

const allowedOrigin = process.env.WEB_URL; 

const app = express();


app.use(express.json());
app.use(parser());

app.use(cors(
    {
        origin:allowedOrigin,
        credentials:true,
        methods:["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders:["Content-Type", "Authorization", "Cookie", "Cache-Control", "Pragma"],
        exposedHeaders:["Content-Type", "Content-Length", "Cache-Control", "Pragma", "Expires"],
    }
  ));
  // app.options('*', cors()); // Enable pre-flight for all routes
  // app.get("*", (_req,res)=>{
  //   res.sendFile(path.join(__dirname, 'build', 'index.html'));
  // });
  
app.use('/api/auth', authRouter);
app.use('/api/files', CookieMiddleware ,fileRoute);
app.use('/api/sf', CookieMiddleware ,sharedRouter);


const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
