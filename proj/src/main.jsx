import { StrictMode, useEffect } from 'react'
import { createRoot} from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { useThemeManager } from './stores/ThemeManager'
import Login from './pages/login.jsx';
import PageControl from './components/page-control.jsx';
import Converter from './pages/converter.jsx';
import FileEditor from './pages/Editor.jsx';
import FileViewer from './pages/Viewer.jsx';
import { ToastProvider } from './components/toast.jsx';


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

function AppWrapper() {
  const theme = useThemeManager((s) => s.theme);
  
  useEffect(() => {
    // Apply theme changes to DOM
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
   
    } else {
      document.documentElement.classList.remove('dark');
     
    }
    
   
  }, [theme]);
  
  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
      <Routes>
        <Route path="/" element={<AppWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/dashboard" element={<PageControl />} />
        <Route path='/converter' element={<Converter />} />
        <Route path='/view/editor/:filename/:fileUtm' element={<FileEditor />} />
        <Route path='/view/viewer/:filename/:fileUtm' element={<FileViewer />} />
      </Routes>
      </ToastProvider>
    </BrowserRouter>
    
  </StrictMode>,
)
