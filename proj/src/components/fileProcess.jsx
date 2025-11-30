import { useState } from "react";
import { ModalForm, ModalButton } from "./modal";
import Select from 'react-select';
import { fileOptions, mimeIconTypesMap } from "../utils/FileSelection.js";
import { GetIconByFileType } from "../utils/file-icon.jsx";
import { FileIcon, Upload, X, FilePlus2 } from "lucide-react";
import localdate from "../utils/dateModi.js";
import axios from "axios";

/**
 * 
 * Modal Component For File Management 
 * 
 * Handles file upload, create new file, and file details display
 * 
 * @param {Object} props
 * @param {Object} props.user - User object with UserId
 * @param {Function} props.onFileChange - Callback when files change (upload/create)
 * @param {Object} props.selectedFile - Currently selected file for details view
 * @param {Function} props.onFileEdit - Callback when edit button is clicked
 * @param {boolean} props.uploadModalOpen - Control upload modal visibility
 * @param {Function} props.setUploadModalOpen - Set upload modal state
 * @param {boolean} props.addModalOpen - Control create file modal visibility
 * @param {Function} props.setAddModalOpen - Set create file modal state
 * @param {boolean} props.detailsModalOpen - Control file details modal visibility
 * @param {Function} props.setDetailsModalOpen - Set details modal state
 * @param {boolean} props.deleteModalOpen - Control delete file modal visibility
 * @param {Function} props.setDeleteModalOpen - Set delete file modal state
 */
export default function FileProcess({ 
    user,
    onFileChange,
    selectedFile,
    onFileEdit,
    uploadModalOpen,
    setUploadModalOpen,
    addModalOpen,
    setAddModalOpen,
    detailsModalOpen,
    setDetailsModalOpen,
    deleteModalOpen,
    setDeleteModalOpen
}) {
    const url = import.meta.env.VITE_API_URL;

    // Upload file states
    const [fileToUpload, setFileToUpload] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Create file states
    const [newFileName, setNewFileName] = useState("");
    const [typeSelection, setTypeSelection] = useState(fileOptions[0]?.value || "txt");

  
    const truncateFileName = (fileName, maxLength = 25) => {
        if (fileName.length <= maxLength) return fileName;
        
        const extension = fileName.substring(fileName.lastIndexOf('.'));
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        const truncatedLength = maxLength - extension.length - 3;
        
        if (truncatedLength <= 0) return fileName;
        
        return nameWithoutExt.substring(0, truncatedLength) + '...' + extension;
    };

    const handleCreateNewFile = async (fileType, fileName) => {
        if (!fileName || !fileName.trim()) {
            alert("Please enter a file name!");
            return;
        }
       
        const finalFileName = `${fileName}.${fileType}`;

        const mimeType = mimeIconTypesMap[fileType] || "text/plain";

        
        const emptyBlob = new Blob([""], { type: mimeType });
        const virtualFile = new File([emptyBlob], finalFileName, { type: mimeType });

        const formData = new FormData();
        formData.append("file", virtualFile);
        formData.append("user_id", `${user?.UserId}`);

        try {
            const res = await axios.post(`${url}/api/files/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            console.log("Created new file:", res.data);
            
            // Notify parent component
            if (onFileChange) {
                onFileChange();
            }
            
            // Reset and close
            setNewFileName("");
            setTypeSelection(fileOptions[0]?.value || "txt");
            setAddModalOpen(false);
            alert("File created successfully!");
            
            return res.data;
        } catch (err) {
            console.error("Error creating file", err);
            alert("Error creating file. Please try again.");
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileToUpload(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setFileToUpload(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const removeFile = () => {
        setFileToUpload(null);
        setUploadProgress(0);
    };

    const handleUpload = async () => {
        if (!fileToUpload) {
            alert("Please select a file first!");
            return;
        }

        const form = new FormData();
        form.append("file", fileToUpload);
        form.append("user_id", `${user?.UserId}`);

        setIsUploading(true);
        setUploadProgress(0);

        try {
            await axios.post(`${url}/api/files/upload`, form, {
                headers: {'Content-Type': 'multipart/form-data'},
                withCredentials: true,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            
            // Notify parent component to refresh file list
            if (onFileChange) {
                onFileChange();
            }
            
            // Reset and close
            setFileToUpload(null);
            setUploadProgress(0);
            setIsUploading(false);
            setUploadModalOpen(false);
            alert("File uploaded successfully!");
        } catch (error) {
            console.error("Error uploading file:", error);
            setIsUploading(false);
            alert("Error uploading file. Please try again.");
        }
    };

    const handleFileDelete = async (file) =>{
        if (!file) {
            alert("No file selected for deletion!");
            return;
        };

        try {
            await axios.delete(`${url}/api/files/${file.FileId}`,{data: {userId: user?.UserId},withCredentials:true});
            if (onFileChange) {
                onFileChange();
            }
            setDeleteModalOpen(false);
            alert("File deleted successfully!");
        } catch (error) {
            console.error("Error deleting file:", error);
            setDeleteModalOpen(false);
            alert("Error deleting file. Please try again.");
        }
    }

    
    
    return (
        <>
            {/* File Details Modal */}
            <ModalForm
                title={selectedFile?.filename ?? "File Details"}
                open={detailsModalOpen}
                onCancel={() => setDetailsModalOpen(false)}
                onOk={() => setDetailsModalOpen(false)}
                titleEdit={true}
                fileId={selectedFile?.FileId ?? null}
                footer={
                <div className="flex flex-row gap-2 justify-center">
                  <ModalButton onClick={() => setDetailsModalOpen(false)} type="danger"> Close </ModalButton>
                  <ModalButton type="primary" onClick={() => { 
                      if (onFileEdit) onFileEdit(selectedFile);
                      setDetailsModalOpen(false);
                  }}> Edit</ModalButton>
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
                onCancel={()=>{
                    setUploadModalOpen(false);
                    setFileToUpload(null);
                    setUploadProgress(0);
                    setIsUploading(false);
                }}
                onOk={()=>{setUploadModalOpen(false)}}
                footer={
                <div className="flex flex-col sm:flex-row gap-2 justify-center w-full px-2 sm:px-4">
                  <ModalButton 
                    onClick={()=>{
                        setUploadModalOpen(false);
                        setFileToUpload(null);
                        setUploadProgress(0);
                        setIsUploading(false);
                    }} 
                    type="danger"
                    disabled={isUploading}
                    className="flex-1 text-sm sm:text-base"
                  > 
                    Cancel 
                  </ModalButton>
                  <ModalButton 
                    type="primary" 
                    onClick={() => {handleUpload()}}
                    disabled={!fileToUpload || isUploading}
                    className="flex-1 text-sm sm:text-base"
                  > 
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </ModalButton>
                </div>}
            >
                <div className="mt-1 sm:mt-2 p-1 sm:p-2 md:p-4 flex flex-col gap-2 sm:gap-3 md:gap-4 overflow-hidden">
                    {/* Drag and Drop  */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 text-center transition-all w-full ${
                            isDragging 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                    >
                        {!fileToUpload ? (
                            <>
                                <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 md:mb-4 text-gray-400" />
                                <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 px-2">
                                    Drag & drop your file here
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 md:mb-4">or</p>
                                <label className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors text-xs sm:text-sm md:text-base font-medium">
                                    Browse Files
                                    <input
                                        type="file"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                            </>
                        ) : (
                            <div className="space-y-2 sm:space-y-3 w-full">
                                {/* File Preview */}
                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg w-full">
                                    <GetIconByFileType fileName={fileToUpload.type} className="w-7 h-7 sm:w-9 sm:h-9 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-gray-100" 
                                           title={fileToUpload.name}>
                                            {truncateFileName(fileToUpload.name)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {(fileToUpload.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                    {!isUploading && (
                                        <button
                                            onClick={removeFile}
                                            className="shrink-0 p-1 sm:p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                {isUploading && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5 overflow-hidden">
                                            <div
                                                className="bg-blue-500 h-2 sm:h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </ModalForm>
            
            {/* Create New File Modal */}
            <ModalForm
                title="Create New File"
                open={addModalOpen}
                onCancel={() => {
                    setAddModalOpen(false);
                    setNewFileName("");
                    setTypeSelection(fileOptions[0]?.value || "txt");
                }}
                onOk={() => setAddModalOpen(false)}
                footer={
                <div className="flex flex-col sm:flex-row gap-2 justify-center w-full px-2 sm:px-4">
                  <ModalButton 
                    onClick={() => {
                        setAddModalOpen(false);
                        setNewFileName("");
                        setTypeSelection(fileOptions[0]?.value || "txt");
                    }} 
                    type="danger"
                    className="flex-1 text-sm sm:text-base"
                  > 
                    Cancel 
                  </ModalButton>
                  <ModalButton 
                    type="primary" 
                    onClick={() => handleCreateNewFile(typeSelection, newFileName)}
                    disabled={!newFileName.trim()}
                    className="flex-1 text-sm sm:text-base"
                  > 
                    Create
                  </ModalButton>
                </div>}
            >
                <div className="mt-2 p-2 sm:p-4 flex flex-col gap-3 sm:gap-4 justify-center items-center">
                    <FilePlus2 color="#159f5e" size={40} className="w-10 h-10 sm:w-12 sm:h-12"/>
                    
                    <p className="font-semibold text-sm sm:text-base dark:text-white text-black">Create New File</p>
                    
                    <input 
                        type="text" 
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)} 
                        placeholder="Enter file name" 
                        className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white text-black text-sm sm:text-base" 
                    />
                    
                    <div className="w-full">
                        <Select
                            options={fileOptions}
                            isSearchable={true}
                            placeholder="Select file type..."
                            value={fileOptions.find(opt => opt.value === typeSelection)}
                            onChange={(values) => setTypeSelection(values.value)}
                            className="text-sm sm:text-base dark:bg-[#1e2939] bg-gray-400 dark:text-white text-black font-semibold "
                            styles={{
                                menu: (base) => ({
                                    
                                    backgroundColor: 'var(--bg-color)',
                                }),
                            }}
                        />
                    </div>

                </div>

            </ModalForm>

            <ModalForm
                title="Delete File"
                open={deleteModalOpen}
                onCancel={() => setDeleteModalOpen(false)}
                onOk={() => setDeleteModalOpen(false)}
                footer={
                <div className="flex flex-row gap-2 justify-center">
                  <ModalButton onClick={() => setDeleteModalOpen(false)} type="primary"> Close </ModalButton>
                    <ModalButton type="danger" onClick={() => {handleFileDelete(selectedFile); setDeleteModalOpen(false);}}>
                        Delete
                    </ModalButton>
                </div>
                }
            >
                <div className="mt-2 p-4 flex flex-col gap-4 justify-center items-center align-middle">
                    <p className="font-semibold text-sm dark:text-white text-black">Are you sure you want to delete this file?</p>
                    <p className="text-xl dark:text-white text-black font-extrabold">{selectedFile?.filename}</p>
                </div>
            </ModalForm>
        </>
    )
}