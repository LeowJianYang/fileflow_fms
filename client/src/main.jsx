import { StrictMode, useEffect } from 'react'
import { createRoot} from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import './config/axios.js' 
import App from './App.jsx'
import { useThemeManager } from './stores/ThemeManager.js'
import Login from './pages/login.jsx';
import PageControl from './components/page-control.jsx';
import FileEditor from './pages/Editor.jsx';
import FileViewer from './pages/Viewer.jsx';
import { ToastProvider } from './components/toast.jsx';
import { useUserStore } from './stores/userstore.js';
import NotFound from './pages/not-found.jsx';
import Privacy from './pages/privacy.jsx';
import Terms from './pages/terms.jsx';

// Initialize theme on app load from localStorage
const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  try {
    const themeData = JSON.parse(storedTheme);
    if (themeData.state?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    console.error('Error parsing theme from localStorage:', e);
  }
}


function AppWrapper({ children }) {
  const theme = useThemeManager((s) => s.theme);
  const hydrated = useUserStore((s) => s.hydrated);

  useEffect(() => {
    useUserStore.getState().fetchUser()
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);


  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return children;
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
      <AppWrapper>
      <Routes>
       
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/dashboard" element={<PageControl />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/view/editor/:filename/:fileUtm' element={<FileEditor />} />
        <Route path='/view/viewer/:filename/:fileUtm' element={<FileViewer />} /> 
        <Route path='/view/viewer/share/:p/:filename/:fileUtm' element={<FileViewer />} />
        <Route path='/view/editor/share/:p/:filename/:fileUtm' element={<FileEditor />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      </AppWrapper>
      </ToastProvider>
    </BrowserRouter>
    
  </StrictMode>,
)
