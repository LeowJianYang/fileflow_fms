
import './utils/loadenv.js';

import express from 'express';
import parser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import authRouter from './src/routes/auth.js';

const allowedOrigin = process.env.WEB_URL; 

const app = express();


app.use(express.json());
app.use(parser());
app.use(cors(
    {
        origin:allowedOrigin,
        credentials:true,
        methods:["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders:["Content-Type", "Authorization", "Cookie"],
    }
));

app.use('/api/auth', authRouter);



const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
