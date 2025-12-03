import { useEffect } from "react";
import Navbar from "../components/navbar";
import { Footer } from "../components/navbar";
import { FileText, CheckCircle, AlertCircle, Scale, HardDrive } from "lucide-react";

export default function Terms() {
    
    useEffect(() =>{
      document.title = "FileFlow | Terms of Service"
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Navbar />
            
            <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                            <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 space-y-8">
                        
                        {/* intro */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Agreement to Terms
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                Welcome to FileFlow! These Terms of Service ("Terms") govern your use of our file management 
                                application and services. By accessing or using FileFlow, you agree to be bound by these Terms 
                                and our Privacy Policy.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                If you do not agree to these Terms, please do not use our service.
                            </p>
                        </section>

                        {/*  License */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Scale className="w-6 h-6 text-green-600 dark:text-green-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    License
                                </h2>
                            </div>
                            
                            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 p-4 sm:p-6 rounded space-y-4">
                                <p className="font-semibold text-green-900 dark:text-green-300 text-lg">
                                    MIT License
                                </p>
                                <p className="text-green-800 dark:text-green-200 leading-relaxed">
                                    Copyright (c) {new Date().getFullYear()} leowjy (NICE)
                                </p>
                                <p className="text-green-800 dark:text-green-200 leading-relaxed text-sm">
                                    Permission is hereby granted, free of charge, to any person obtaining a copy of this 
                                    software and associated documentation files (the "Software"), to deal in the Software 
                                    without restriction, including without limitation the rights to use, copy, modify, merge, 
                                    publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
                                    to whom the Software is furnished to do so, subject to the following conditions:
                                </p>
                                <p className="text-green-800 dark:text-green-200 leading-relaxed text-sm">
                                    The above copyright notice and this permission notice shall be included in all copies or 
                                    substantial portions of the Software.
                                </p>
                                <p className="text-green-800 dark:text-green-200 leading-relaxed text-sm font-semibold">
                                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
                                    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                                    PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
                                    FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
                                    OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
                                    DEALINGS IN THE SOFTWARE.
                                </p>
                            </div>
                        </section>

                        {/*  Registration */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Account Registration
                                </h2>
                            </div>
                            
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                <p className="leading-relaxed">
                                    To use FileFlow, you must create an account. When creating an account, you agree to:
                                </p>
                                
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide accurate, current, and complete information</li>
                                    <li>Maintain and promptly update your account information</li>
                                    <li>Maintain the security of your password and account</li>
                                    <li>Accept responsibility for all activities under your account</li>
                                    <li>Notify us immediately of any unauthorized access or security breach</li>
                                </ul>
                                
                                <p className="leading-relaxed">
                                    You are responsible for safeguarding your login credentials and must not share them with 
                                    any third party.
                                </p>
                            </div>
                        </section>

                        {/* Storage  */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <HardDrive className="w-6 h-6 text-green-600 dark:text-green-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Storage Limitations
                                </h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-600 p-4 sm:p-6 rounded">
                                    <p className="font-semibold text-yellow-900 dark:text-yellow-300 text-lg mb-3">
                                        Storage Allocation
                                    </p>
                                    <p className="text-yellow-800 dark:text-yellow-200 leading-relaxed mb-3">
                                        Due to database and server storage limitations, each user is allocated a maximum of 
                                        <strong> 100 MB</strong> of storage space.
                                    </p>
                                    <p className="text-yellow-800 dark:text-yellow-200 leading-relaxed">
                                        Storage is allocated on a <strong>first-come, first-served basis</strong>. Once you 
                                        reach your storage limit, you must delete existing files before uploading new ones.
                                    </p>
                                </div>
                                
                                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                                    <p className="leading-relaxed">
                                        <strong>Important:</strong> We reserve the right to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Monitor storage usage to ensure fair allocation</li>
                                        <li>Remove inactive accounts or files after extended periods of inactivity</li>
                                        <li>Delete files that violate our terms or policies</li>
                                        <li>Adjust storage limits based on system capacity</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Acceptable Use */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Acceptable Use Policy
                                </h2>
                            </div>
                            
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                <p className="leading-relaxed">
                                    You agree NOT to use FileFlow to:
                                </p>
                                
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Upload, store, or share illegal, harmful, or offensive content</li>
                                    <li>Violate any intellectual property rights or copyrights</li>
                                    <li>Upload malware, viruses, or malicious code</li>
                                    <li>Engage in any fraudulent or deceptive practices</li>
                                    <li>Attempt to gain unauthorized access to our systems</li>
                                    <li>Interfere with or disrupt the service or servers</li>
                                    <li>Use the service for commercial purposes without authorization</li>
                                    <li>Share or distribute pirated content</li>
                                    <li>Spam, harass, or abuse other users</li>
                                </ul>
                                
                                <p className="leading-relaxed font-semibold">
                                    Violation of this policy may result in immediate account termination and deletion of all 
                                    your files without notice.
                                </p>
                            </div>
                        </section>

                        {/*  Ownership */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Content Ownership and Rights
                            </h2>
                            
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                <p className="leading-relaxed">
                                    <strong>Your Content:</strong> You retain all ownership rights to the files and content 
                                    you upload to FileFlow. You grant us a limited license to store, process, and display your 
                                    content solely for the purpose of providing the service.
                                </p>
                                
                                <p className="leading-relaxed">
                                    <strong>Our Platform:</strong> FileFlow, including its design, features, and functionality, 
                                    is owned by leowjy (NICE) and is protected by copyright and other intellectual property laws.
                                </p>
                            </div>
                        </section>

                        {/* Disclaimer */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Disclaimer of Warranties
                            </h2>
                            
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                <p className="leading-relaxed">
                                    FileFlow is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties or 
                                    representations about the accuracy, reliability, or availability of the service.
                                </p>
                                
                                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-4 rounded">
                                    <p className="text-red-800 dark:text-red-200 leading-relaxed">
                                        <strong>Important:</strong> While we strive to protect your data, we cannot guarantee 
                                        100% uptime or complete data security. We are not liable for any data loss, corruption, 
                                        or unauthorized access. You should maintain backup copies of important files.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Limitation of Liability */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Limitation of Liability
                            </h2>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                To the maximum extent permitted by law, FileFlow and its developers shall not be liable for 
                                any indirect, incidental, special, consequential, or punitive damages, including loss of data, 
                                loss of profits, or any other damages arising from your use of the service.
                            </p>
                        </section>

                        {/* Termination */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Termination
                            </h2>
                            
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                <p className="leading-relaxed">
                                    We reserve the right to terminate or suspend your account immediately, without prior notice, 
                                    for any violation of these Terms or for any other reason at our sole discretion.
                                </p>
                                
                                <p className="leading-relaxed">
                                    You may terminate your account at any time by deleting it through the application settings. 
                                    Upon termination, all your files and data will be permanently deleted.
                                </p>
                            </div>
                        </section>

                        {/* Changes to Terms */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Changes to Terms
                            </h2>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                We may modify these Terms at any time. We will notify you of any changes by updating the 
                                "Last updated" date at the top of this page. Your continued use of FileFlow after changes 
                                constitutes acceptance of the modified Terms.
                            </p>
                        </section>

                        {/*  Law */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Governing Law
                            </h2>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                These Terms shall be governed by and construed in accordance with applicable laws, without 
                                regard to conflict of law principles.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Contact Information
                            </h2>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>Project:</strong> FileFlow App
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>Developer:</strong> leowjy (NICE)
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>GitHub:</strong>{' '}
                                    <a 
                                        href="https://github.com/LeowJianYang" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        github.com/LeowJianYang
                                    </a>
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>License:</strong> MIT License
                                </p>
                            </div>
                        </section>

                        {/* Acknowledgment */}
                        <section className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6 text-center">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                By using FileFlow, you acknowledge that you have read, understood, and agree to be bound by 
                                these Terms of Service and our Privacy Policy.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
                                Thank you for using FileFlow! We are committed to providing you with a secure and reliable file 
                                management experience.
                            </p>
                        </section>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}