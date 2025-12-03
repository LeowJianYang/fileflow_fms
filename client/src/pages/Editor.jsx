import { useParams,useNavigate } from "react-router-dom";
import ViewSide, { ViewNavBar } from "../components/ViewSide";
import EditorTypes from "../components/EditorSetup";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useUserStore } from "../stores/userstore";
import { Menu, X } from "lucide-react";
import { useAppToast } from "../utils/use-toast.jsx";


export default function FileEditor() {
  const url = import.meta.env.VITE_API_URL;
  const { p, filename, fileUtm } = useParams();
  

  const fileId = filename; // This is the FileId
  const actualFileName = fileUtm ? decodeURIComponent(fileUtm) : '';
  const permission = p || null; // 'r', 'w', 'x' or null
  
  const user = useUserStore((s) => s.user);
  const hydrated = useUserStore((s) => s.hydrated);

  const [fileContent, setFileContent] = useState("");
  const [mime, setMime] = useState("");
  const [files, setFiles] = useState([]);
  const [currentFileData, setCurrentFileData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSharedFile, setIsSharedFile] = useState(false);
  const editorRef = useRef(null);

  //Check user (skip auth check for shared files)
  const navigate = useNavigate();
  const  toast  = useAppToast();
  useEffect(() => {
        // Skip login check if this is a shared file (public access)
        if (permission !== null) {
            console.log("📖 Public share access - skipping auth check");
            return;
        }
        
        const checkUser = async () =>{
            if (hydrated && !user) {
                navigate("/login", {replace: true});
            }
        }

        checkUser();    

    }, [user, hydrated, navigate, permission]);


    // Validate shared file access and fetch content
    useEffect(()=>{
         if (permission !== null && fileId){
             console.log("🔒 Validating shared file access:", { fileId, permission });
             const validateAndFetch = async () => {
                 try {
                     const res = await axios.get(`${url}/api/sf/validate-share/${fileId}/${permission}`);
                     console.log("✅ Validation response:", res.data);
                     
                     if (res.data.valid){
                          toast.success("Access granted to shared file.");
                          setIsSharedFile(true);
                          
                          // Set file metadata from validation response
                          if (res.data.file) {
                              console.log("📄 Setting file metadata:", res.data.file);
                              setCurrentFileData({
                                  FileId: res.data.file.FileId,
                                  filename: res.data.file.filename,
                                  filetype: res.data.file.filetype,
                                  filesize: res.data.file.filesize,
                                  filepath: res.data.file.filepath
                              });
                              
                              // Fetch file content after validation
                              console.log("📥 Fetching file content for fileId:", fileId);
                              const contentRes = await axios.get(`${url}/api/files/${fileId}`, { withCredentials: true });
                              console.log("✅ Content fetched, mime:", contentRes.data.type);
                              setFileContent(contentRes.data.content);
                              setMime(contentRes.data.type);
                          }
                      }
                 } catch (err) {
                     console.error("❌ Validation or fetch error:", err);
                     toast.error("Invalid share link or permission denied.");
                     navigate("/not-found", {replace: true});
                 }
             };
             
             validateAndFetch();
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


  // Fetch file content (only for non-shared files)
  useEffect(() => {
    // Skip if this is a shared file (content is fetched after validation)
    if (isSharedFile || permission !== null) return;
    
    const fetchFileContent = async () => {
      try {
        const res = await axios.get(`${url}/api/files/${fileId}`, { withCredentials: true });
        setFileContent(res.data.content);
        setMime(res.data.type);
      } catch (err) {
        console.error("Error fetching file content:", err);
      }
    };
    
    if (fileId) {
      fetchFileContent();
    }
  }, [fileId, isSharedFile, permission]);


  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  
  function handleEditorChange(value) {
    setFileContent(value);
  }


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
        aria-label="Open files menu"
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
              Editing: {actualFileName}
            </h1>
          </div>
          <div className="flex-1 overflow-auto">
            <EditorTypes
              mime={mime}
              content={fileContent}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              disable={permission === 'r'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
