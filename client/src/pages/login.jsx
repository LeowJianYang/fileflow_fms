import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Eye, EyeOff, User } from 'lucide-react';
import { useThemeManager } from '../stores/ThemeManager';
import { useUserStore } from '../stores/userstore';
import axios from 'axios';
import {useAppToast} from '../utils/use-toast'


export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useThemeManager((s) => s.theme);
  const login = useUserStore((s)=>s.login);
  const loading = useUserStore((s)=>s.loading);
  const url = import.meta.env.VITE_API_URL;
  
  
  const isSignUp = location.pathname === '/signup';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const user = useUserStore((s) => s.user);
  const hydrated = useUserStore((s) => s.hydrated);
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const toast = useAppToast();
  
    useEffect(() => {
         
        const checkUser = async () =>{
            if (hydrated && user) {
                navigate("/dashboard", {replace: true});
            }
        }

        checkUser();    

    }, [user, hydrated, navigate]);

  // Email validation function
  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    return '';
  };

  // Password validation function
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    return '';
  };

  // Confirm password validation function
  const validateConfirmPassword = (confirmPwd, pwd) => {
    if (!confirmPwd) {
      return 'Please confirm your password';
    }
    
    if (confirmPwd !== pwd) {
      return 'Passwords do not match';
    }
    
    return '';
  };

  //  email validation
  useEffect(() => {
    if (emailTouched) {
      const error = validateEmail(email);
      setEmailError(error);
    }
  }, [email, emailTouched]);

  // password validation
  useEffect(() => {
    if (passwordTouched && isSignUp) {
      const error = validatePassword(password);
      setPasswordError(error);
    }
    
    // Re-validate confirm password when password changes
    if (confirmPasswordTouched && confirmPassword) {
      const confirmError = validateConfirmPassword(confirmPassword, password);
      setConfirmPasswordError(confirmError);
    }
  }, [password, passwordTouched, confirmPassword, confirmPasswordTouched, isSignUp]);

  // confirm password validation
  useEffect(() => {
    if (confirmPasswordTouched) {
      const error = validateConfirmPassword(confirmPassword, password);
      setConfirmPasswordError(error);
    }
  }, [confirmPassword, confirmPasswordTouched, password]);

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!emailTouched) {
      setEmailTouched(true);
    }
  };

  // Handle email blur
  const handleEmailBlur = () => {
    setEmailTouched(true);
    const error = validateEmail(email);
    setEmailError(error);
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!passwordTouched) {
      setPasswordTouched(true);
    }
  };

  // Handle password blur
  const handlePasswordBlur = () => {
    if (isSignUp) {
      setPasswordTouched(true);
      const error = validatePassword(password);
      setPasswordError(error);
    }
  };

  // Handle confirm password input change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (!confirmPasswordTouched) {
      setConfirmPasswordTouched(true);
    }
  };

  // Handle confirm password blur
  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true);
    const error = validateConfirmPassword(confirmPassword, password);
    setConfirmPasswordError(error);
  };

  // Switch tabs by changing URL
  const switchTab = (tab) => {
    if (tab === 'signup') {
      navigate('/signup', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
    // Reset validation when switching tabs
    setEmailTouched(false);
    setPasswordTouched(false);
    setConfirmPasswordTouched(false);
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };


  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email before submission
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailTouched(true);
      setEmailError(emailValidationError);
      return;
    }
    
    if (isSignUp) {
      // Validate password
      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
        setPasswordTouched(true);
        setPasswordError(passwordValidationError);
        return;
      }
      
      // Validate confirm password
      const confirmPasswordValidationError = validateConfirmPassword(confirmPassword, password);
      if (confirmPasswordValidationError) {
        setConfirmPasswordTouched(true);
        setConfirmPasswordError(confirmPasswordValidationError);
        return;
      }

      await axios.post(`${url}/api/auth/register`, {Newusername:username, Newemail: email, Newpassword:password}, {withCredentials:true}).then((res)=>{
        
        toast.success("Account created successfully ! You can login now.",{position:"top-center"})
        console.log('Sign Up Success:', res.data);
      }).catch((error)=>{
         console.error('Error during sign up:', error);
      });
      console.log('Sign Up:', { username, email, password });
    } else {
      try{
        await login(email,password);
        
        
        toast.success("Logged in successfully !",{position:"top-center"})
        navigate('/dashboard', { replace: true });
      } catch (error) {
        toast.error("Login failed. Please check your credentials.",{position:"top-center"})
        console.error('Error during login:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">

        {/*Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="font-semibold text-white mt-4">Processing...</div>
          </div>
        )}

        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 dark:bg-blue-600 rounded-2xl mb-3 sm:mb-4 shadow-lg">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">FileFlow</h1>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700/50">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 sm:mb-8 bg-gray-100 dark:bg-slate-900/50 rounded-xl p-1">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                !isSignUp
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchTab('signup')}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                isSignUp
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isSignUp ? 'Create Account!' : 'Welcome Back!'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              {isSignUp 
                ? 'Fill in the details to create your account.' 
                : 'Enter your credentials to access your account.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Username Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 text-sm sm:text-base"
                    required
                  />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-900/50 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all pr-12 text-sm sm:text-base ${
                    emailError && emailTouched
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500'
                  }`}
                  required
                />
                <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                  emailError && emailTouched
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`} />
              </div>
              
              {/* Error Message with smooth animation */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                emailError && emailTouched ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'
              }`}>
                <div className="flex items-start gap-1.5 text-red-600 dark:text-red-400 text-xs sm:text-sm">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{emailError}</span>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    className="text-xs sm:text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-900/50 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all pr-12 text-sm sm:text-base ${
                    passwordError && passwordTouched && isSignUp
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                    passwordError && passwordTouched && isSignUp
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              
              {/* Password Error Message */}
              {isSignUp && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  passwordError && passwordTouched ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}>
                  <div className="flex items-start gap-1.5 text-red-600 dark:text-red-400 text-xs sm:text-sm">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{passwordError}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={handleConfirmPasswordBlur}
                    placeholder="Confirm your password"
                    className={`w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-900/50 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all pr-12 text-sm sm:text-base ${
                      confirmPasswordError && confirmPasswordTouched
                        ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                        : confirmPassword && !confirmPasswordError && confirmPasswordTouched
                        ? 'border-green-500 dark:border-green-500 focus:ring-green-500'
                        : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                      confirmPasswordError && confirmPasswordTouched
                        ? 'text-red-500 dark:text-red-400'
                        : confirmPassword && !confirmPasswordError && confirmPasswordTouched
                        ? 'text-green-500 dark:text-green-400'
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                
                {/* Error/Success Message  */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    confirmPasswordError && confirmPasswordTouched ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}>
                  <div className="flex items-start gap-1.5 text-red-600 dark:text-red-400 text-xs sm:text-sm">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{confirmPasswordError}</span>
                  </div>
                </div>
                
                {/* Success  */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    !confirmPasswordError && confirmPassword && confirmPasswordTouched ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}>
                  <div className="flex items-start gap-1.5 text-green-600 dark:text-green-400 text-xs sm:text-sm">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Passwords match!</span>
                  </div>
                </div>

              </div>
            )}

            {/*  Button */}
            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 dark:shadow-blue-500/20 dark:hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 text-sm sm:text-base"
            >
              {isSignUp ? 'Create Account' : 'Login'}
            </button>
          </form>

          {/* Footer-terms */}
          <p className="mt-5 sm:mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}