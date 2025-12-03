import { useParams, useNavigate } from "react-router-dom";
import ViewSide, { ViewNavBar } from "../components/ViewSide.jsx";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useUserStore } from "../stores/userstore.js";
import { Menu, X } from "lucide-react";
import PDFViewer from "../components/Viewer/pdf-viewer.jsx";
import VideoViewer from "../components/Viewer/video-viewer.jsx";
import ImageViewer from "../components/Viewer/image-viewer.jsx";
import MarkdownViewer from "../components/Viewer/markdown-viewer.jsx";
import { useAppToast } from "../utils/use-toast.jsx";

export default function FileEditor() {
  const url = import.meta.env.VITE_API_URL;
  const { p, filename, fileUtm } = useParams();
  

  const fileId = filename; // This is the FileId
  const actualFileName = fileUtm ? decodeURIComponent(fileUtm) : '';
  const permission = p || null; // 'r', 'w', 'x' or null
  
  const user = useUserStore((s) => s.user);
  const hydrated = useUserStore((s) => s.hydrated);

  const blobUrlRef = useRef(null); // Track blob URL with ref
  const [fileContent, setFileContent] = useState(null);
  const [mime, setMime] = useState("");
  const [files, setFiles] = useState([]);
  const [currentFileData, setCurrentFileData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSharedFile, setIsSharedFile] = useState(false);
  const [render, setRender] = useState(null);
  const navigate = useNavigate();
  const  toast  = useAppToast();
  
    useEffect(() => {
        // Skip login check if this is a shared file 
        if (permission !== null) {
            return;
        }
        
        const checkUser = async () =>{
            if (hydrated && !user) {
                navigate("/login", {replace: true});
            }
        }

        checkUser();    

    }, [user, hydrated, navigate, permission]);

    
    // Validate shared file access
    useEffect(()=>{
         if (permission !== null && fileId){
            
             const validateShare = async () => {
                 try {
                     const res = await axios.get(`${url}/api/sf/validate-share/${fileId}/${permission}`);
                   
                     
                     if (res.data.valid){
                          toast.success("Access granted to shared file.");
                          
                          // Set file metadata from validation response
                          if (res.data.file) {
                           
                              setCurrentFileData({
                                  FileId: res.data.file.FileId,
                                  filename: res.data.file.filename,
                                  filetype: res.data.file.filetype,
                                  filesize: res.data.file.filesize,
                                  filepath: res.data.file.filepath
                              });
                          }
                          
                          // Mark as shared file - this will trigger the file fetch useEffect
                   
                          setIsSharedFile(true);
                      }
                 } catch (err) {
                     toast.error("Invalid share link or permission denied.");
                     navigate("/not-found", {replace: true});
                 }
             };
             
             validateShare();
         }
    }, [permission, fileId]);


  // Fetch file list (only for own files, not shared files)
  useEffect(() => {
    // Skip if this is a shared file
    if (isSharedFile) return;
    
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${url}/api/files/list`, {
          params: { userId: user?.UserId },
          withCredentials: true
        });
        setFiles(response.data.files);
        
       
        const current = response.data.files.find(f => f.FileId === parseInt(fileId));
        setCurrentFileData(current);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    if (user?.UserId) {
      fetchFiles();
    }
  }, [user?.UserId, fileId, isSharedFile]);


  useEffect(() => {
    // Cleanup previous blob URL 
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    
    // Reset states when file changes
    setFileContent(null);
    setMime("");
    setRender(null);
    
    if (!fileId) {
      console.log("No file ID provided");
      return;
    }
    
    if (!url) {
      console.log("No API URL configured");
      return;
    }
    
    // If this is a shared file, wait for validation to complete
    if (permission !== null && !isSharedFile) {
     
      return;
    }
    
   
    
    const fetchFileContent = async () => {
      
      
      try {
        //  prevent stale headers
        const apiUrl = `${url}/api/files/${fileId}?t=${Date.now()}`;
       
        
        // make a request to check content type
        const headRes = await axios.head(apiUrl, { 
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        const contentType = headRes.headers['content-type'];
      
        setMime(contentType);
        
        // For text-based files (markdown, plain text, code), fetch as JSON/text
        //  sends markdown as application/json with {type, content}
        if (contentType?.startsWith('text/') || 
            contentType?.startsWith('application/json') ||
            contentType === 'application/javascript') {
          
          const res = await axios.get(apiUrl, { 
            withCredentials: true,
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          console.log("Response data type:", typeof res.data);
          console.log("Response data:", res.data);
          
          //  sends{type, content} for text files
          if (res.data && typeof res.data === 'object' && res.data.content) {
            

            // Update MIME type from the JSON response (actual file type)
            if (res.data.type) {
              setMime(res.data.type);
            }
            
            setFileContent(res.data.content); // Store raw text content (not a blob URL)
          } else if (typeof res.data === 'string') {
            setFileContent(res.data);
          } else {
            console.warn("Unexpected text response format:", res.data);
          }
        } 
        // For binary files (PDF, video, audio, images), fetch as arraybuffer
        else {

          const res = await axios.get(apiUrl, { 
            withCredentials: true, 
            responseType: 'arraybuffer',
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          
          const blob = new Blob([res.data], { type: contentType });
          const blobUrl = URL.createObjectURL(blob);

          // Save blob URL to ref for later cleanup
          blobUrlRef.current = blobUrl;
          setFileContent(blobUrl);
        }
        
   
      } catch (err) {
        console.error("Error fetching file:", err);
        console.error("Error details:", err.response?.status, err.response?.data);
      }
    };
    
    fetchFileContent();
    
    // Cleanup on unmount only
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [fileId, url, permission, isSharedFile]);





  useEffect(() => {
        const handleSwitchViewer = async () => {
 
            
            if (!mime || !fileContent) {
                setRender(
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400">Loading file...</p>
                        </div>
                    </div>
                );
                return;
            }
            
          if (mime === 'application/pdf') {
           
            setRender(<PDFViewer fileUrl={fileContent} />);
            }
            else if (mime.startsWith('video/')|| mime.startsWith('audio/')) {

            setRender(<VideoViewer fileUrl={fileContent} fileName={actualFileName} mimeType={mime} isAudio={mime.startsWith('audio/')} />);
            }
            else if (mime.startsWith('image/')) {
            setRender(<ImageViewer fileUrl={fileContent} fileName={actualFileName} />);
            } else if (mime === 'text/markdown' || actualFileName.endsWith('.md') || actualFileName.endsWith('.markdown')) {
              
              // fileContent is now the raw text string, not a blob URL
              setRender(<MarkdownViewer content={fileContent} />);
            }
            else {
               
                setRender(<div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Preview not available for this file type ({mime})
                </div>);
            }
        };
        
        handleSwitchViewer();
  }, [mime, fileContent, actualFileName]);



  
  


  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 dark:bg-[#0b131a]">
      <ViewNavBar 
        currentFile={actualFileName} 
        FileId={fileId} 
        newContent={fileContent} 
        fileMetadata={currentFileData}
      />

      {/* Mobile*/}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-30 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
 
      >
        <Menu size={24} />
      </button>

      {/* Aside and Editor */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Aside */}
        <div className="hidden lg:block">
          <ViewSide 
            currentFile={fileId} 
            files={files}
          />
        </div>

        {/* Mobile*/}
        <>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 lg:hidden ${
              isDrawerOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer*/}
          <div className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white text-black">Files</h3>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="h-[calc(100%-64px)] overflow-hidden">
              <ViewSide 
                currentFile={fileId} 
                files={files}
                showHeader={false}
              />
            </div>
          </div>
        </>

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white truncate">
              Viewing: {actualFileName}
            </h1>
          </div>
          <div className="flex-1 overflow-auto">
            {render}
          </div>
        </div>
      </div>
    </div>
  );
}
