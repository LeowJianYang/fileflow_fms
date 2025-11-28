import { Grid,LayoutList, FolderUp, Upload, FileIcon } from "lucide-react"

import { GetIconByFileType } from "../utils/file-icon";
import { useEffect, useState } from "react";
import { ModalForm, ModalButton } from "../components/modal";
import { useUserStore } from "../stores/userstore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Files() {
    const [isOpen, setIsOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const user = useUserStore((s) => s.user);
    const url = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    

    useEffect(()=>{

        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${url}/api/files/list`, {
                    params: { userId: user?.UserId },
                    withCredentials: true
                });
                // console.log("Fetched files:", response.data.files);
                setFiles(response.data.files);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, [user?.UserId]);

    const localdate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");      
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        const formattedWithTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return formattedWithTime;
    }

    const handleViewAndEditFile = (file) =>{
        if (file.filetype.startsWith('text/') || file.filetype === 'application/javascript' || file.filetype === 'application/json' || file.filetype === 'text/html' || file.filetype === 'text/css'){
            navigate(`/view/editor/${encodeURIComponent(file.FileId)}`);
        } else {
            navigate(`/view/viewer/${encodeURIComponent(file.FileId)}`);
        }
    }

    const handleFileClick = (file) => {
         setSelectedFile(file);
         handleOpen();
    }

    const handleUpload = async () =>{
       const file = document.getElementById("file_uploaded").files[0];
       const form = new FormData();
       form.append("file", file);
       form.append("user_id", `${user?.UserId}`);

       try{
            await axios.post(`${url}/api/files/upload`, form, {
                headers:{'Content-Type': 'multipart/form-data'},
                withCredentials: true
            })

       }catch (error) {
           console.error("Error uploading file:", error);
       }
    }


    {/*Nav Bar for Files */}
    return (
        <div className="p-4  dark:bg-[#101922] h-full w-full bg-white">
            
            <nav className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-4">
                <div className="w-full sm:flex-1">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full border  border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#233648] text-gray-900 dark:text-white font-medium text-sm" 
                    /> 
                </div>
               
                <div className="flex flex-row gap-2 sm:gap-3 mt-2 sm:mt-0">
                    <button className="bg-[#3f8cee] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap flex flex-row gap-3" onClick={()=>{ setUploadModalOpen(true);}}>
                        <Upload/>Upload File
                    </button>
                    <button className="bg-[#233648] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap flex flex-row gap-3">
                        <FolderUp/>Create Folder
                    </button>
                </div>
            </nav>
            <hr className="border-gray-300 dark:border-gray-700 mb-4"/>

            {/* Files Display Area */}
            <div className="mt-4 p-4">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">My Files</h2>
                <div className="flex flex-row justify-between items-center gap-2 mb-4">
                    <div className="text-gray-600 dark:text-gray-400 text-sm">MyFiles /</div>
                    <div className="flex flex-row gap-2 justify-center items-center align-middle">
                        <button className="rounded-lg bg-[#233648] h-10 w-10 items-center align-middle justify-center flex"><Grid size={25} color="white"/> </button>
                        <button className="rounded-lg  h-10 w-10 items-center align-middle justify-center flex"><LayoutList size={25} className="dark:text-white text-black"/></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                            {files.map((file) => {
                                const displayName = file.filename.length > 10 
                                        ? file.filename.slice(0, 10) + "..." 
                                        : file.filename;

                                return (
                                    <div 
                                        key={file.filename}
                                        onClick={()=>{handleFileClick(file)}} 
                                        className="p-3 sm:p-4 border bg-gray-50 dark:bg-[#101922] border-gray-300 dark:border-gray-700 
                                                    rounded-lg flex flex-col gap-2 justify-center items-center 
                                                    hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="w-12 h-12 sm:w-14 sm:h-14">
                                            {<GetIconByFileType filetype={file.filetype} size={40}/> || <File color="#9ca3af" size={40} className="sm:w-12 sm:h-12"/>}
                                        </div>

                                        <h3 className="font-semibold text-black dark:text-white text-sm sm:text-base text-center break-all">
                                            {displayName}
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm text-center">
                                            Modified: {localdate(file.lastModified)}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                                            Size: {(file.filesize / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

            </div>
        
            <ModalForm
                title={selectedFile ? selectedFile.filename : "File Details"}
                open={isOpen}
                onCancel={()=>{handleClose()}}
                onOk={()=>{handleClose()}}
                footer={
                <div className="flex flex-row gap-2 justify-center">
                  <ModalButton onClick={()=>{handleClose()}} type="danger"> Close </ModalButton>
                  <ModalButton type="primary" onClick={() => {handleViewAndEditFile(selectedFile)}}> Edit</ModalButton>
                  <ModalButton type="dashed" onClick={() => {}}>View</ModalButton>
                </div>}
            >
                <div className="mt-2 p-4 flex flex-col gap-4 justify-center items-center align-middle">

                    <p>{<GetIconByFileType filetype={selectedFile?.filetype} size={40} className="sm:w-12 sm:h-12 text-[#22c55e]"/> || <FileIcon color="#9ca3af" size={40} className="sm:w-12 sm:h-12"/>}</p>

                    <p className="font-semibold text-sm dark:text-white text-black">Details</p>
                    <p className="text-sm dark:text-gray-300 text-gray-600 ">{selectedFile?.filename.split('.').pop().toUpperCase()}</p>
                    <p className="text-sm dark:text-gray-300 text-gray-600 ">{(selectedFile?.filesize / 1024).toFixed(2)} KB</p>
                    <p className="text-sm dark:text-gray-300 text-gray-600 ">Modified: {localdate(selectedFile?.lastModified)}</p>
                </div>

            </ModalForm>

            <ModalForm
                title="Upload File"
                open={uploadModalOpen}
                onCancel={()=>{setUploadModalOpen(false)}}
                onOk={()=>{setUploadModalOpen(false)}}
                footer={
                <div className="flex flex-row gap-2 justify-center">
                  <ModalButton onClick={()=>{setUploadModalOpen(false)}} type="danger"> Close </ModalButton>
                  <ModalButton type="primary" onClick={() => {handleUpload()}}> Upload</ModalButton>
                </div>}
            >
                <div className="mt-2 p-4 flex flex-col gap-4 justify-center items-center align-middle">
                    <input 
                        type="file" 
                        id="file_uploaded"
                        className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#233648] text-gray-900 dark:text-white font-medium text-sm" 
                    />
                </div>

            </ModalForm>



        </div>

    )
}