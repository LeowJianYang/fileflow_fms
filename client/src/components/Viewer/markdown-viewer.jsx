import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect } from 'react';

export default function MarkdownViewer ({content}) {
    

    if (!content) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">No content to display</p>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full h-full overflow-auto bg-white dark:bg-[#212121]'>
            <div className='max-w-4xl p-6 prose prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                dark:text-white text-black
            '>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}