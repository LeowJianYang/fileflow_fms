
import express from 'express';
import { connection } from '../config/db.js';
const sharedRouter = express.Router();


/**
 * FOR FUTURE USE (REF)
 */
// Get files shared WITH me (I'm the recipient)
// sharedRouter.get('/shared-with-me', async (req,res)=>{
//     const {userId} = req.query;

//     connection.query(
//         `Select sf.FileId, f.filename, f.filetype, f.filesize, f.uploadAt, 
//          sf.permission, u.Username as sharedBy, u.UserId as ownerId
//          from sharedfile sf 
//          inner join fileData f on sf.FileId = f.FileId 
//          inner join userdata u on f.UserId = u.UserId
//          where sf.UserId=?`, 
//         [userId], 
//         async (err, result)=>{
//             if(err){
//                 return res.status(500).json({ message: 'Database error', error:  err.sqlState });
//             }

//             if (result.length < 1){
//                 return res.status(200).json({ message: 'No shared files found', files: [] });
//             }

//             return res.status(200).json({ message: 'Shared files fetched successfully', files: result });
//         }
//     );
// });


// Get files shared BY me (I'm the owner)
sharedRouter.get('/shared-by-me', async (req,res)=>{
    const {userId} = req.query;

    connection.query(
        `Select sf.FileId, f.filename, f.filetype, f.filesize, f.uploadAt,
         sf.permission, u.Username as sharedWith, sf.UserId as recipientId
         from fileData f
         inner join sharedfile sf on f.FileId = sf.FileId
         inner join userdata u on sf.UserId = u.UserId
         where f.UserId=?`,
        [userId],
        async (err, result)=>{
            if(err){
                return res.status(500).json({ message: 'Database error', error: err.sqlState });
            }

            if (result.length < 1){
                return res.status(200).json({ message: 'No files shared by you', files: [] });
            }

            return res.status(200).json({ message: 'Shared files fetched successfully', files: result });
        }
    );
});


sharedRouter.post('/share', async (req,res)=>{
    const {fileId, userId, permission = 'r'} = req.body;

    try {
        // Check if share already exists
        connection.query('Select * from sharedfile where UserId=? and FileId=?', [userId, fileId], async (checkErr, checkResult) => {
            if(checkErr){
                return res.status(500).json({ message: 'Database error', error: checkErr.sqlState });
            }

            // If  exists, just return success (or update permission if needed)
            if (checkResult.length > 0) {
                // permission update
                connection.query(
                    'Update sharedfile set permission=? where UserId=? and FileId=?', 
                    [permission, userId, fileId], 
                    async (updateErr, updateResult) => {
                        if(updateErr){
                            return res.status(500).json({ message: 'Database error', error: updateErr.sqlState });
                        }
                        
                        return res.status(200).json({ 
                            message: 'File share updated successfully',
                            permission: permission
                        });
                    }
                );
            } else {
                // Create new share with the specified permission
                connection.query(
                    'Insert into sharedfile (UserId, FileId, permission) values (?,?,?)', 
                    [userId, fileId, permission], 
                    async (insertErr, insertResult) => {
                        if(insertErr){
                            return res.status(500).json({ message: 'Database error', error: insertErr.sqlState });
                        }

                        if (insertResult.affectedRows < 1){
                            return res.status(500).json({ message: 'Sharing failed' });
                        }

                        res.status(200).json({ 
                            message: 'File shared successfully',
                            permission: permission
                        });
                    }
                );
            }
        });
    } catch (error) {
        console.error("Share error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

sharedRouter.delete('/share', async (req,res)=>{
    const {fileId, UserId} = req.body;
    
            connection.query('Delete from sharedfile where UserId=? and FileId=?', [UserId, fileId], async (err,result)=>{
                if(err){
                    return res.status(500).json({ message: 'Database error', error:  err.sqlState });
                };
                if (result.affectedRows < 1){
                    return res.status(404).json({ message: 'Sharing not found' });
                };
                res.status(200).json({ message: 'File unshared successfully' });
            })
});

sharedRouter.get('/validate', async (req,res)=>{
    const {fileId} = req.query;
    
            connection.query('Select * from sharedfile where FileId=?', [fileId], async (err,result)=>{
                if(err){
                    return res.status(500).json({ message: 'Database error', error:  err.sqlState });
                };

                if (result.length < 1){
                    return res.status(404).json({ message: 'No valid share found', valid: false });
                };

                res.status(200).json({ message: 'Valid share found', valid: true, permission: result[0].permission });
            });    
});

// validate share by fileId and permission
sharedRouter.get('/validate-share/:fileId/:permission', async (req, res) => {
    const { fileId, permission } = req.params;
    
    try {
        connection.query(
            'Select sf.*, f.filename, f.filepath, f.filetype, f.filesize from sharedfile sf inner join fileData f on sf.FileId = f.FileId where sf.FileId=? and sf.permission=?',
            [fileId, permission],
            async (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error', error: err.sqlState });
                }

                if (result.length < 1) {
                    return res.status(404).json({ message: 'File is not shared or invalid permission', valid: false });
                }

                const shareData = result[0];
                
                res.status(200).json({
                    message: 'Valid share found',
                    valid: true,
                    permission: shareData.permission,
                    file: {
                        FileId: shareData.FileId,
                        filename: shareData.filename,
                        filepath: shareData.filepath,
                        filetype: shareData.filetype,
                        filesize: shareData.filesize
                    }
                });
            }
        );
    } catch (error) {
        console.error("Validate share error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default sharedRouter;