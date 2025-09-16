import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
export default function ThemeToggle() {
     const [darkMode, setDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );
     
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

    }, [darkMode]);

    useEffect(()=> {
        const saved = localStorage.getItem('theme');
        if (saved === "dark") {
            setDarkMode(true);
        } else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }
    },[]);
    return (
        <button
            onClick={()=>setDarkMode(!darkMode)}
            className=" px-2.5 max-sm:w-1/10 max-sm:px-1.5 max-sm:py-2 max-sm:absolute max-sm:top-1 max-sm:right-3  rounded-xl bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:scale-105 transition">
                {darkMode ? (
                    <>
                        <Sun/>
                    </>
                ):(
                    <>
                        <Moon/>
                    </>
                )}
            </button>
    );
}

