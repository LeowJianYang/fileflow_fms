
import {useNavigate} from 'react-router-dom';
import { Sun,Moon,Database, Menu, X, User } from 'lucide-react';
import { useUserStore } from '../stores/userstore';
//import { shallow } from 'zustand/shallow';
import { useThemeManager } from '../stores/ThemeManager';
import { useState } from 'react';


export default function Navbar() {
  const navigate = useNavigate();
  const theme = useThemeManager((s) => s.theme);
  const toggleTheme = useThemeManager((s) => s.toggleTheme);
  const handleLogout = useUserStore((s) => s.logout);
  const user = useUserStore((s) => s.user);
  const loading = useUserStore((s) => s.loading);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleNavigation = (path) => {
    navigate(path, { replace: true });
    closeMenu();
  };

  return (
    <>
      <div className='w-full h-15 flex flex-row justify-between items-center bg-white dark:bg-gray-900 p-4 border-b-2 border-gray-200 dark:border-gray-700'>

       
        <div className='flex flex-row justify-between items-center'>
          <h3 className='items-center text-gray-900 dark:text-white font-bold text-base sm:text-lg'>
            FileFlow
          </h3>
        </div>
          
        {/* Desktop Navigation */}
        <nav className='hidden lg:flex justify-center items-center text-gray-900 dark:text-white flex-row gap-3.5'>
          <button className='px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer' onClick={() => navigate('/filemanager', { replace: true })}>File Manager</button>
          <button className='px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer' onClick={() => navigate('/profile', { replace: true })}>Profile</button>
          <button className='px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer' onClick={() => navigate('/conversion', { replace: true })}>Conversion</button>
        </nav>

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
                  onClick={() => handleNavigation('/filemanager')}
                >
                  File Manager
                </button>
                <button 
                  className='px-4 py-3 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-left text-gray-900 dark:text-white font-medium' 
                  onClick={() => handleNavigation('/profile')}
                >
                  Profile
                </button>
                <button 
                  className='px-4 py-3 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-left text-gray-900 dark:text-white font-medium' 
                  onClick={() => handleNavigation('/conversion')}
                >
                  Conversion
                </button>

                {/* Auth Section */}
                <div className='mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700'>
                  {user != null && loading!=true ? (
                    <>
                      <p className='text-gray-900 dark:text-white mb-3 px-2 font-medium'>User: {user.Username ?? 'Guest'}</p>
                      <button 
                        className='w-full px-4 py-3 rounded bg-red-500 hover:bg-red-600 text-white font-medium'
                        onClick={() => {
                          handleLogout();
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

export function ConverterBar () {
  const navigate = useNavigate();
  const theme = useThemeManager((s) => s.theme);
  const toggleTheme = useThemeManager((s) => s.toggleTheme);
  const user = useUserStore((s) => s.user);
  const loading = useUserStore((s) => s.loading);


  return (
    <div className='w-full h-full flex flex-col bg-white dark:bg-gray-900 p-4 border-b-2 border-gray-200 dark:border-gray-700'>
      
      <div className='flex flex-row justify-between items-center'>
      <h3 className='items-center text-gray-900 dark:text-white font-bold'>
        <Database size={24} className="inline-block mr-2 mb-1"/> File Converter
      </h3>
      <nav className='flex justify-between items-center p-4 text-gray-900 dark:text-white flex-row gap-3.5'>
      <button className='px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer' onClick={() => navigate('/dashboard', { replace: true })}>Dashboard</button>
      <button className='px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer' onClick={() => navigate('/dashboard#-my-files', { replace: true })}>My Files</button>
      <button className='px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer' onClick={() => navigate('/converter', { replace: true })}>Conversion</button>
      {user != null && loading!=true ? (
        <>
              <p className='text-gray-900 dark:text-white flex flex-row gap-2 justify-between items-center '><User size={20}/> {user.Username} 
                <hr className="mx-4 h-6 border-l border-gray-300 dark:border-gray-400"/></p>
              <button className='px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-medium' onClick={() => handleLogout()}>Logout</button>
        </>
      ):(
        <button className='rounded justify-center items-center p-1.2 bg-[#4CAF50] cursor-pointer w-20 h-10 text-black font-bold hover:opacity-55 hover:transition-opacity' onClick={() => navigate('/login')}>Login</button>
      )}

      <button onClick={toggleTheme} className='px-3 py-2 rounded bg-yellow-400 dark:bg-blue-600 hover:bg-yellow-500 dark:hover:bg-blue-700 transition-colors'>
            {theme === 'light' ? <Moon className="text-gray-900" /> : <Sun className="text-white" />}
      </button>

    </nav>
    </div>
    </div>
 
  );
}





export function Footer() {

  return (
    <footer className='w-full h-auto flex items-center justify-between bg-white dark:bg-[#111621]'>
      <p className='text-gray-900 dark:text-gray-500 p-4'>© {new Date().getFullYear()} FMS. All rights reserved.</p>

      <div className='flex flex-row gap-4 p-4 items-center justify-end'>
        <a href="/privacy" className="text-gray-600 dark:text-gray-400
               hover:text-gray-900 dark:hover:text-white
               hover:underline
               transition-colors duration-300 ease-in-out">Privacy Policy</a>
        <a href="/terms" className="text-gray-600 dark:text-gray-400
               hover:text-gray-900 dark:hover:text-white
               hover:underline
               transition-colors duration-300 ease-in-out">Terms of Service</a>
      </div>
    </footer>
  )

}
