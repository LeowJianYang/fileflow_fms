

import Sidebar from "./sidebar"
import { useTabDataStore } from "../stores/tab-data";
import Dashboard from "../pages/dashboard";
import Files from "../pages/Files";
import { useEffect } from 'react';
import slug from '../utils/slug';


export default function PageControl(){

    const tab = useTabDataStore((s) => s.tab);
    const setTab = useTabDataStore((s) => s.setTab);
    const tabContent = {
        'dashboard': <Dashboard />,
        'my-files': <Files />,
        'shared': <div>Shared with Me Content</div>,
        'settings': <div>Settings Content</div>,
        'converter': <div>Converter Content</div>,
    }

    useEffect(() => {
        //  Support direct pathname for legacy too.
        const rawHash = window.location.hash ? window.location.hash.slice(1) : null;
        const rawPath = window.location.pathname.slice(1);

        // Map slug/hash back to tab keys by checking slug(tabKey) === rawHash
        let matched = null;
        if (rawHash) {
            for (const key of Object.keys(tabContent)) {
                if (slug(key) === rawHash || key === rawHash) {
                    matched = key; break;
                }
            }
        }

        // fallback to pathname
        if (!matched && rawPath) {
            if (tabContent[rawPath]) matched = rawPath;
        }

        setTab(matched || 'dashboard');
    }, []);

    const handleTabChange = (newTab) =>{
        setTab(newTab);
        // set hash so refresh 
        try{
            window.location.hash = `-${slug(newTab)}`;
        } catch (e){
            window.location.hash = `-${newTab}`;
        }
    }

    return (
        <div className="flex flex-row h-screen overflow-hidden">
            {/* Sidebar with drawer functionality */}
            <Sidebar onTabChange={handleTabChange} />

            {/* Hamburger button on mobile */}
            <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-[#101922] pt-16 lg:pt-0">
                {tabContent[tab]}
            </div>
        </div>
    )

}