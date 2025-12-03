
import {useNavigate} from 'react-router-dom';
import { Sun,Moon,Database, Menu, X, User } from 'lucide-react';
import { useUserStore } from '../stores/userstore';
//import { shallow } from 'zustand/shallow';
import { useThemeManager } from '../stores/ThemeManager';
import { useState, useEffect } from 'react';
import { useAppToast } from '../utils/use-toast';


export default function Navbar() {
  const navigate = useNavigate();
  const theme = useThemeManager((s) => s.theme);
  const toggleTheme = useThemeManager((s) => s.toggleTheme);
  const handleLogout = useUserStore((s) => s.logout);
  const user = useUserStore((s) => s.user);
  const loading = useUserStore((s) => s.loading);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toast = useAppToast();

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleNavigation = (path) => {
    navigate(path, { replace: true });
    closeMenu();
  };

  const logout = async () =>{
      try{
        await handleLogout();
        toast.success("Logged out successfully !",{position:"top-center"})
      } catch(err){
        toast.error("Error during logout !",{position:"top-center"})
      }
       
  }

  return (
    <>
      <div className={`
        fixed z-50
        w-full h-15 flex flex-row justify-between items-center 
        p-4 
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'glass shadow-sm py3'
          : 'bg-transparent py-5'
        }
      `}>

       
        <div className='flex flex-row justify-between items-center'>
          <h3 className='items-center text-gray-900 dark:text-white font-bold text-base sm:text-lg cursor-pointer' onClick={() => navigate('/')}>
            FileFlow
          </h3>
        </div>
          
        {/* Desktop Navigation */}
        {/* <nav className='hidden lg:flex justify-center items-center text-gray-900 dark:text-white flex-row gap-3.5'>
          <button className='px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer' onClick={() => navigate('/dashboard', { replace: true })}>File Manager</button>
          <button className='px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer' onClick={() => navigate('/', { replace: true })}>Profile</button>
          <button className='px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer' onClick={() => navigate('/conversion', { replace: true })}>Conversion</button>
        </nav> */}

        {/* Desktop */}
        <div className='hidden lg:flex flex-row gap-4 items-center justify-end'>
          {user != null && loading!=true ? (
            <>
              <p className='text-gray-900 dark:text-white flex flex-row gap-2 justify-between items-center '><User size={20}/> {user.Username} 
                </p><hr className="mx-4 h-6 border-l border-gray-300 dark:border-gray-400"/>
              <button className='px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-medium' onClick={() => handleLogout()}>Logout</button>
            </>
          ):(
            <>
              <button className='rounded justify-center items-center px-4 py-2 text-sm cursor-pointer text-black dark:text-white font-bold hover:opacity-55 hover:transition-opacity' onClick={() => navigate('/login')}>Login</button>
              <button className='rounded justify-center items-center px-4 py-2 text-sm bg-[#2196F3] cursor-pointer text-white font-bold hover:opacity-55 hover:transition-opacity' onClick={() => navigate('/signup')}>Sign Up</button>
            </>
          )}

          <button onClick={toggleTheme} className='px-3 py-2 rounded bg-yellow-400 dark:bg-blue-600 hover:bg-yellow-500 dark:hover:bg-blue-700 transition-colors'>
            {theme === 'light' ? <Moon className="text-gray-900" /> : <Sun className="text-white" />}
          </button>
        </div>

        {/* Mobile Menu  */}
        <div className='flex lg:hidden gap-2 items-center'>
          <button onClick={toggleTheme} className='px-2 py-2 rounded bg-yellow-400 dark:bg-blue-600 hover:bg-yellow-500 dark:hover:bg-blue-700 transition-colors'>
            {theme === 'light' ? <Moon size={18} className="text-gray-900" /> : <Sun size={18} className="text-white" />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='px-2 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
          >
            {isMenuOpen ? <X size={24} className="text-gray-900 dark:text-white" /> : <Menu size={24} className="text-gray-900 dark:text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu  */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
            onClick={closeMenu}
          />
          
          {/* Drawer */}
          <div className='fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 lg:hidden border-l-2 border-gray-200 dark:border-gray-700'>
            <div className='flex flex-col h-full'>
              {/* Drawer Header */}
              <div className='flex justify-between items-center p-4 border-b-2 border-gray-200 dark:border-gray-700'>
                <h3 className='text-gray-900 dark:text-white font-bold'>Menu</h3>
                <button onClick={closeMenu} className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700'>
                  <X size={24} className="text-gray-900 dark:text-white" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className='flex flex-col gap-2 p-4'>
                <button 
                  className='px-4 py-3 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-left text-gray-900 dark:text-white font-medium' 
                  onClick={() => handleNavigation('/dashboard')}
                >
                  File Manager
                </button>
            

                {/* Auth Section */}
                <div className='mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700'>
                  {user != null && loading!=true ? (
                    <>
                      <p className='text-gray-900 dark:text-white mb-3 px-2 font-medium'>User: {user.Username ?? 'Guest'}</p>
                      <button 
                        className='w-full px-4 py-3 rounded bg-red-500 hover:bg-red-600 text-white font-medium'
                        onClick={async () => {
                          await logout();
                          closeMenu();
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ):(
                    <div className='flex flex-col gap-2'>
                      <button 
                        className='w-full rounded px-4 py-3 bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold transition-colors' 
                        onClick={() => handleNavigation('/login')}
                      >
                        Login
                      </button>
                      <button 
                        className='w-full rounded px-4 py-3 bg-[#2196F3] hover:opacity-75 text-white font-bold transition-opacity' 
                        onClick={() => handleNavigation('/signup')}
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
   
 
  );
}






export function Footer() {

  return (
    <footer className='w-full mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111621]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        {/*  Footer  */}
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6'>
          
          {/* Copyright */}
          <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>FileFlow</span>
              <span className='hidden sm:inline text-gray-400 dark:text-gray-600'>|</span>
            </div>
            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left'>
              © {new Date().getFullYear()} FMS. All rights reserved.
            </p>
          </div>

          {/*  Links */}
          <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-6'>
            <a 
              href="/privacy" 
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-400
                       hover:text-blue-600 dark:hover:text-blue-400
                       hover:underline underline-offset-4
                       transition-all duration-200 ease-in-out
                       active:scale-95 transform"
            >
              Privacy Policy
            </a>
            <span className='text-gray-300 dark:text-gray-700'>•</span>
            <a 
              href="/terms" 
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-400
                       hover:text-blue-600 dark:hover:text-blue-400
                       hover:underline underline-offset-4
                       transition-all duration-200 ease-in-out
                       active:scale-95 transform"
            >
              Terms of Service
            </a>
            <span className='text-gray-300 dark:text-gray-700'>•</span>
            <a 
              href="http://github.com/LeowJianYang/fileflow_fms" 
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-400
                       hover:text-blue-600 dark:hover:text-blue-400
                       hover:underline underline-offset-4
                       transition-all duration-200 ease-in-out
                       active:scale-95 transform"
            >
              Github
            </a>
          </div>
        </div>

        {/*  Additional Info */}
        <div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-800'>
          <p className='text-xs text-center text-gray-500 dark:text-gray-500'>
            Made with ❤️ by leowjy | NICE
          </p>
        </div>
      </div>
    </footer>
  )

}
