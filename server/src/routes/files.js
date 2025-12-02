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

fileRoute.post('/upload', upload.single('file'), async (req,res)=>{

    const { user_id, is_directory, dirId } = req.body;
    const file = req.file; 
    let directoryName = "";

    if (!file){
        return res.status(400).json({message:"No file uploaded"});
    }

    if (!user_id){
        return res.status(400).json({message:"User ID is required"});
    }

    if (is_directory === "true" || is_directory === true){
        try {
            const dirResult = await new Promise((resolve, reject) => {
                connection.query('Select dirName from fdirectory where dirId = ? and UserId = ?',[dirId, user_id], (dirErr, result)=>{
                    if (dirErr) reject(dirErr);
                    else resolve(result);
                });
            });

            if (dirResult.length === 0){
                return res.status(404).json({message:"Directory not found"});
            }

            directoryName = dirResult[0].dirName;
            console.log(`Uploading to directory: ${directoryName} (ID: ${dirId})`);
        } catch (err) {
            console.error("Database Error:", err);
            return res.status(500).json({message:"Database Error", error: err.sqlState});
        }
    }


    const uploadPath = is_directory ? path.join(__dirname, '../../uploads/', user_id, directoryName) : path.join(__dirname, '../../uploads/', user_id);

    if (!fs.existsSync(uploadPath)){
        fs.mkdirSync(uploadPath, {recursive:true});
    }

    const uniqueSuffix = Date.now() + '-' + file.originalname;
    const absoluteFilePath = path.join(uploadPath, uniqueSuffix);
    
    //relative path for database storage 
    const relativeFilePath = is_directory ? path.join('uploads', user_id, directoryName, uniqueSuffix).replace(/\\/g, '/') : path.join('uploads', user_id, uniqueSuffix).replace(/\\/g, '/');

    // Write file from memory buffer to disk
    fs.writeFileSync(absoluteFilePath, file.buffer);

    const filename = file.originalname;
    const fileType = file.mimetype;
    const fileSize = file.size;

    if (!is_directory){
        connection.query(`Insert into fileData (filename, filetype, filepath, UserId, filesize) values (?,?,?,?,?)`,[filename, fileType, relativeFilePath, user_id, fileSize], async (error,result)=>{
            if (error){
                console.error("Database Insertion Error:", error);
                return res.status(500).json({message:"Database Error"});
            }
            return res.status(200).json({message:"File uploaded successfully", fileId: result.insertId});
        })
    } else {
        connection.query(`Insert into fileData (filename, filetype, filepath, UserId, filesize, dirId) values (?,?,?,?,?,?)`,[filename, fileType, relativeFilePath, user_id, fileSize, dirId], async (error,result)=>{
            if (error){
                console.error("Database Insertion Error:", error);
                return res.status(500).json({message:"Database Error", error:error.sqlState});
            }
            return res.status(200).json({message:"File uploaded successfully", fileId: result.insertId});
        })
    }
    

});



fileRoute.get('/list', async (req,res) => {

     const {userId}= req.query;

     connection.query('Select * from fileData where UserId =?', [userId], async (error, results)=>{
            if (error){
                return res.status(500).json({message:"Database Error", error:error.sqlState});
            };
    
            const fileresults = results;

            connection.query('Select * from fdirectory where UserId =?', [userId], async (dirError, dirResults)=>{
                if (dirError){
                    return res.status(500).json({message:"Database Error", error:dirError.sqlState});
                }
                if (dirResults.length ===0){
                    return res.status(200).json({files: fileresults, directories: []});
                };
                return res.status(200).json({files: fileresults, directories: dirResults});
            });
     })
});



//EDIT FUNC (View)
fileRoute.get('/:id', async (req,res)=>{
    const fileId = req.params.id;

    connection.query('Select filepath, filename, filetype from fileData where FileId =?', [fileId], async (error,result)=>{

        if (error){
            return res.status(500).json({message:"Database Error", error:error.sqlState});
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
            return res.status(500).json({message:"Database Error", error:error.sqlState});
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
                        return res.status(500).json({message:"Database Update Error", error:updateErr.sqlState});
                    };
                    return res.status(200).json({message:"File saved successfully", size:newSize});
                })
            })

            
        })

    })
})

fileRoute.delete('/:id', async (req,res)=>{
    const itemId = req.params.id;
    const {userId, isFolder} = req.body;

    //  folder deletion
    if (isFolder) {
        connection.query(`Select dirPath, dirId from fdirectory where dirId =? and UserId =?`, [itemId, userId], async(error, result)=>{
            if (error){
                return res.status(500).json({message:"Database Error", error:error.sqlState});
            }

            if (result.length === 0){
                return res.status(404).json({message:"Folder not found"});
            }

            const dirPath = result[0].dirPath;
            const dirId = result[0].dirId;
            const fullpath = path.join(process.cwd(), dirPath);

            // Delete the physical directory
            fs.rm(fullpath, { recursive: true, force: true }, (rmdirErr) => {
                if (rmdirErr) {
                    console.error("Directory deletion error:", rmdirErr);
                    return res.status(500).json({ message: "Directory Deletion Error" });
                }

                // Delete all files in the folder from the database
                connection.query('Delete from fileData where dirId =? and UserId=?', [dirId, userId], async(deleteFilesErr, _fileResult)=>{
                    if (deleteFilesErr){
                        console.error("Database file deletion error:", deleteFilesErr);
                        return res.status(500).json({message:"Database File Deletion Error", error: deleteFilesErr.sqlState});
                    }

                    // Delete the folder record from fdirectory
                    connection.query('Delete from fdirectory where dirId =? and UserId=?', [dirId, userId], async(deleteDirErr, _dirResult)=>{
                        if (deleteDirErr){
                            console.error("Database directory deletion error:", deleteDirErr);
                            return res.status(500).json({message:"Database Directory Deletion Error", error: deleteDirErr.sqlState});
                        }
                        return res.status(200).json({message:"Folder deleted successfully"});
                    });
                });
            });
        });
    } 
    // Handle file deletion
    else {
        connection.query(`Select filepath from fileData where FileId =? and UserId =?`, [itemId, userId], async(error, result)=>{
            if (error){
                return res.status(500).json({message:"Database Error", error:error.sqlState});
            }

            if (result.length === 0){
                return res.status(404).json({message:"File not found"});
            }

            const filePath = result[0].filepath;
            const fullpath = path.join(process.cwd(), filePath);

            fs.unlink(fullpath, (unlinkErr)=>{
                if(unlinkErr){
                    console.error("File deletion error:", unlinkErr);
                    return res.status(500).json({message:"File Deletion Error"});
                }

                connection.query('Delete from fileData where FileId =? and UserId=?', [itemId, userId], async(deleteErr, _Delresult)=>{
                    if (deleteErr){
                        return res.status(500).json({message:"Database Deletion Error", error: deleteErr.sqlState});
                    }
                    return res.status(200).json({message:"File deleted successfully"});
                });
            });
        });
    }
});

fileRoute.post('/up', (req, res) => {
    const { Newtitle, fileId, isDirectory, dirId } = req.body;

    connection.query(
        `${isDirectory ? 'Select dirPath, UserId, dirName from fdirectory where dirId=?': 'Select filepath, UserId, filename from fileData where FileId = ?'}`,
        [fileId],
       async (error, result) => {
                if (error) return res.status(500).json({ message: "Database Error" , error:error.sqlState});
            if (result.length === 0) return res.status(404).json({ message: "File not found" });

            const file = result[0];
            const oldRelativePath = isDirectory ? file.dirPath : file.filepath;
            const userId = file.UserId;
            const originalName = isDirectory ? file.dirName : file.filename;


            const dirfileName = await new Promise((resolve, reject)=>{
                connection.query("Select dirName from fdirectory where UserId =? and dirId =?", [userId,dirId], async(dirErr, dirResult)=>{
                    if (dirErr) reject(dirErr);
                    if (dirResult.length ===0){
                        resolve("");
                    } else {
                        resolve(dirResult[0].dirName);
                    }
                });
            });



            // Extract timestamp and extension

            const [timestamp] = !isDirectory ? path.basename(oldRelativePath).split('-'): ["", ""];
            const extension = originalName.split('.').pop();

        
            const oldAbsolutePath = path.join(process.cwd(), oldRelativePath);

         
            const newFileName = !isDirectory ? `${timestamp}-${Newtitle}.${extension}`: Newtitle;
            const newRelativePath = path.join('uploads', String(userId), dirfileName, newFileName);



          
            const newAbsolutePath = path.join(process.cwd(), newRelativePath);

            fs.rename(oldAbsolutePath, newAbsolutePath, (err) => {
                if (err) {
                    return res.status(500).json({ message: "File Rename Error", error: err });
                }

                const newSize = fs.statSync(newAbsolutePath).size;

                if (isDirectory) {
                    //update folder
                    connection.query(
                        'update fdirectory SET dirName = ?, dirPath = ? WHERE dirId = ?',
                            [Newtitle, newRelativePath, fileId],
                            (err, results) => {
                            if (err) console.error(err);
                            else console.log('Directory updated', results);
                            }
                        );
                    } else {
                    // update file
                    connection.query(
                        'update fileData SET filename = ?, filepath = ?, filesize = ? WHERE FileId = ?',
                        [`${Newtitle}.${extension}`, newRelativePath, newSize , fileId],
                        (err, results) => {
                        if (err) console.error(err);
                        else console.log('File updated', results);
                        }
                    );
                }
            });

       }

         
        );
    }
);

fileRoute.post('/dir', async(req,res)=>{
    const { userId, dirName, dirSub } = req.body;

    if (!userId || !dirName) {
        return res.status(400).json({ message: "User ID and directory name are required" });
    };

    connection.query('Select * from fileData where UserId = ? and filename = ?',[userId, dirName], async(error, result)=>{
        if (error){
            return res.status(500).json({message:"Database Error", error: error.sqlState});
        };
        if (result.length > 0){
            return res.status(409).json({message:"A file or directory with this name already exists"});
        };

        let parentDir = null;
        connection.query('Select dirName from fdirectory where UserId =? and dirId =?', [userId,dirSub], async(dirErr, dirResult)=>{
            if (dirErr){
                return res.status(500).json({message:"Database Error"});
            };
            
            if (dirResult.length < 0){
                return res.status(404).json({message:"Parent directory not found"});
            }

            parentDir = dirResult.length > 0 ? dirResult[0].dirName : null;
        })

        const dirPath = parentDir ? path.join(__dirname, '../../uploads/', String(userId), parentDir, dirName) : path.join(__dirname, '../../uploads/', String(userId), dirName);

        if (!fs.existsSync(dirPath)){
            fs.mkdir(dirPath, {recursive:true}, async (fsErr)=>{
                if (fsErr){
                    return res.status(500).json({message:"Filesystem Error"});
                };
                
                connection.query('Insert into fdirectory ( dirName, dirPath, UserId) values (?,?,?)',[dirName, path.join('uploads', String(userId), dirName).replace(/\\/g, '/'), userId], async(dbErr, _dbResult)=>{
                if (dbErr){
                    return res.status(500).json({message:"Database Error", error: dbErr.sqlState});
                };
                return res.status(201).json({message:"Directory created successfully"});
            });
            });
            
           

        } else {
            return res.status(409).json({message:"Directory already exists"});
        };


    })

    
    

});

export default fileRoute;
