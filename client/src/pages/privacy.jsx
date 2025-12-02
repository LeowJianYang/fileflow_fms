import Navbar from "../components/navbar";
import { Footer } from "../components/navbar";
import { Shield, Lock, Eye, Database, UserCheck } from "lucide-react";

export default function Privacy() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Navbar />
            
            <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 space-y-8">
                        
                        
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Introduction
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Welcome to FileFlow! This Privacy Policy explains how we collect, use, disclose, and safeguard 
                                your information when you use our file management service. Please read this policy carefully. 
                                If you do not agree with the terms of this privacy policy, please do not access the application.
                            </p>
                        </section>

                        {/*  We Collect */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Information We Collect
                                </h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Personal Information
                                    </h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                                        <li>Account information (username, email address, password)</li>
                                        <li>Profile information you provide</li>
                                        <li>Files and content you upload to our service</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Usage Information
                                    </h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                                        <li>Log data (IP address, browser type, access times)</li>
                                        <li>Device information</li>
                                        <li>Usage patterns and preferences</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* How We Use */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    How We Use Your Information
                                </h2>
                            </div>
                            
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                                <li>To provide and maintain our file management service</li>
                                <li>To authenticate users and manage accounts</li>
                                <li>To store and organize your files securely</li>
                                <li>To improve and optimize our service</li>
                                <li>To communicate with you about service updates</li>
                                <li>To monitor and analyze usage patterns</li>
                                <li>To detect and prevent technical issues and security threats</li>
                            </ul>
                        </section>

                        {/*  Storage */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Data Storage and Security
                                </h2>
                            </div>
                            
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                <p className="leading-relaxed">
                                    Your files are stored securely on our servers. We implement industry-standard security 
                                    measures to protect your data, including encryption and secure authentication protocols.
                                </p>
                                
                                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded">
                                    <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                        Storage Limitation
                                    </p>
                                    <p className="text-blue-800 dark:text-blue-200">
                                        Due to database and server storage limitations, each user is allocated <strong>100 MB</strong> of 
                                        storage space on a first-come, first-served basis. Please manage your storage accordingly.
                                    </p>
                                </div>
                                
                                <p className="leading-relaxed">
                                    However, no method of transmission over the internet or electronic storage is 100% secure. 
                                    While we strive to protect your data, we cannot guarantee absolute security.
                                </p>
                            </div>
                        </section>

                        {/*  Sharing */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Data Sharing and Disclosure
                                </h2>
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                We do not sell, trade, or rent your personal information to third parties. We may share your 
                                information only in the following circumstances:
                            </p>
                            
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                                <li>With your explicit consent</li>
                                <li>To comply with legal obligations or court orders</li>
                                <li>To protect our rights, privacy, safety, or property</li>
                                <li>In connection with a business transfer or merger</li>
                            </ul>
                        </section>

                        {/*  Rights */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Your Rights
                            </h2>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                You have the right to:
                            </p>
                            
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                                <li>Access your personal information</li>
                                <li>Correct inaccurate or incomplete data</li>
                                <li>Delete your account and associated data</li>
                                <li>Export your data</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section>

                        {/* Cookies */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Cookies and Tracking
                            </h2>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                We use cookies and similar tracking technologies to maintain your session and improve user 
                                experience. You can control cookie settings through your browser preferences, but disabling 
                                cookies may affect the functionality of our service.
                            </p>
                        </section>

                        {/* Changes to Policy */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Changes to This Privacy Policy
                            </h2>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                                posting the new Privacy Policy on this page and updating the "Last updated" date. You are 
                                advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Contact Us
                            </h2>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>Project:</strong> FileFlow App
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>Author:</strong> leowjy (NICE)
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

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}