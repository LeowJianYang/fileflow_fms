import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { connection } from '../config/db.js';
import { fileURLToPath } from "url";

const fileRoute = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Use memory storage access req.body
const upload = multer({storage: multer.memoryStorage()});

fileRoute.post('/upload', upload.single('file'), (req,res)=>{

    const { user_id } = req.body;
    const file = req.file; 

    if (!file){
        return res.status(400).json({message:"No file uploaded"});
    }

    if (!user_id){
        return res.status(400).json({message:"User ID is required"});
    }

    
    const uploadPath = path.join(__dirname, '../../uploads/', user_id);
    
    if (!fs.existsSync(uploadPath)){
        fs.mkdirSync(uploadPath, {recursive:true});
    }

    const uniqueSuffix = Date.now() + '-' + file.originalname;
    const absoluteFilePath = path.join(uploadPath, uniqueSuffix);
    
    //relative path for database storage 
    const relativeFilePath = path.join('uploads', user_id, uniqueSuffix).replace(/\\/g, '/');

    // Write file from memory buffer to disk
    fs.writeFileSync(absoluteFilePath, file.buffer);

    const filename = file.originalname;
    const fileType = file.mimetype;
    const fileSize = file.size;


    connection.query(`Insert into fileData (filename, filetype, filepath, UserId, filesize) values (?,?,?,?,?)`,[filename, fileType, relativeFilePath, user_id, fileSize], async (error,result)=>{
        if (error){
            console.error("Database Insertion Error:", error);
            return res.status(500).json({message:"Database Error"});
        }
        return res.status(200).json({message:"File uploaded successfully", fileId: result.insertId});
    })
    

});



fileRoute.get('/list', async (req,res) => {

     const {userId}= req.query;

     connection.query('Select * from fileData where UserId =?', [userId], async (error, results)=>{
            if (error){
                return res.status(500).json({message:"Database Error"});
            };

            return res.status(200).json({files: results});
     })
});

//EDIT FUNC
fileRoute.get('/:id', async (req,res)=>{
    const fileId = req.params.id;

    connection.query('Select filepath, filename, filetype from fileData where FileId =?', [fileId], async (error,result)=>{

        if (error){
            return res.status(500).json({message:"Database Error"});
        };

        if (result.length === 0){
            return res.status(404).json({message:"File not found"});
        };

        const filePath = result[0].filepath;
        const type = result[0].filetype;

        const fullpath = path.join(process.cwd(),filePath);

        fs.readFile(fullpath, "utf8", (readErr, data)=>{
            if (readErr){
                return res.status(500).json({message:"File Read Error"});
            }

            return res.status(200).json({type, content:data});
        })


    })
})

export default fileRoute;
