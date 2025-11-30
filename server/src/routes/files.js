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

//EDIT FUNC (View)
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

        if (
            type === "application/pdf" ||
            type.startsWith("video/") ||
            type.startsWith("audio/") ||
            type.startsWith("image/")
        ) {
     
            
            // Prevent caching issues
            res.setHeader("Content-Type", type);
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
            
            return res.sendFile(fullpath, (err) => {
                if (err) {
                    console.error("SendFile error:", err);
                    res.status(500).json({ message: "File send error" });
                }
            });
        }

    fs.readFile(fullpath, "utf8", (readErr, data)=>{
            if (readErr){
                return res.status(500).json({message:"File Read Error"});
            }

                return res.status(200).json({ type, content: data });
        });
    });
})

//SAVE FUNC
fileRoute.post('/save-editor', async (req,res)=>{
    const {fileId, newContent, userId} = req.body;

    connection.query('Select filepath from fileData where FileId =? and UserId =?', [fileId, userId], async (error,result)=>{

        if (error){
            return res.status(500).json({message:"Database Error"});
        };

        if (result.length === 0){
            return res.status(404).json({message:"File not found"});
        };

        const filePath = result[0].filepath;
        const fullpath = path.join(process.cwd(),filePath);

        fs.writeFile(fullpath, newContent,"utf-8", (writeErr)=>{
            if (writeErr){
                return res.status(500).json({message:"File Write Error"});
            };

            fs.stat(fullpath,(statErr, stats)=>{
                if (statErr){
                    return res.status(500).json({message:"File Stat Error"});
                };

                const newSize = stats.size;

                connection.query('Update fileData set filesize =? where FileId =?', [newSize,fileId], async (updateErr, _result)=>{
                    if (updateErr){
                        return res.status(500).json({message:"Database Update Error"});
                    };
                    return res.status(200).json({message:"File saved successfully", size:newSize});
                })
            })

            
        })

    })
})

fileRoute.delete('/:id', async (req,res)=>{
    const fileId = req.params.id;
    const {userId} = req.body;

    connection.query('Select filepath from fileData where FileId =? and UserId =?', [fileId,userId], async(error,result)=>{

        if (error){
            return res.status(500).json({message:"Database Error"});
        };
        if (result.length ===0){
            return res.status(404).json({message:"File not found"});
        };

        const filePath = result[0].filepath;
        const fullpath = path.join(process.cwd(),filePath);

        fs.unlink(fullpath, (unlinkErr)=>{
            if(unlinkErr){
                return res.status(500).json({message:"File Deletion Error"});
            };

            connection.query('Delete from fileData where FileId =? and UserId=?',[fileId,userId], async(deleteErr, _Delresult)=>{
               if (deleteErr){
                   return res.status(500).json({message:"Database Deletion Error"});
               };
               return res.status(200).json({message:"File deleted successfully"});
            });
        });
    });
});

fileRoute.post('/up', (req, res) => {
    const { Newtitle, fileId } = req.body;

    connection.query(
        'Select filepath, UserId, filename from fileData where FileId = ?',
        [fileId],
        (error, result) => {

            if (error) return res.status(500).json({ message: "Database Error" });
            if (result.length === 0) return res.status(404).json({ message: "File not found" });

            const file = result[0];
            const oldRelativePath = file.filepath;               
            const userId = file.UserId;
            const originalName = file.filename;                  

            // Extract timestamp and extension
            const [timestamp] = path.basename(oldRelativePath).split('-');
            const extension = originalName.split('.').pop();

        
            const oldAbsolutePath = path.join(process.cwd(), oldRelativePath);

         
            const newFileName = `${timestamp}-${Newtitle}.${extension}`;
            const newRelativePath = path.join('uploads', String(userId), newFileName);

          
            const newAbsolutePath = path.join(process.cwd(), newRelativePath);

            fs.rename(oldAbsolutePath, newAbsolutePath, (err) => {
                if (err) {
                    return res.status(500).json({ message: "File Rename Error", error: err });
                }

                const newSize = fs.statSync(newAbsolutePath).size;

                connection.query(
                    'update fileData set filename = ?, filepath = ?, filesize = ? where FileId = ?',
                    [`${Newtitle}.${extension}`, newRelativePath, newSize, fileId],
                    (updateErr) => {
                        if (updateErr) {
                            return res.status(500).json({ message: "Database Update Error" });
                        }

                        return res.status(200).json({
                            message: "File renamed successfully",
                            size: newSize
                        });
                    }
                );
            });
        }
    );
});


export default fileRoute;
