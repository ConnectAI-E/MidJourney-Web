import {useEffect, useState} from 'react';
import {useLocalStorage} from '@/hooks/useLocalStorage';

export const useThemeToggle = () => {
    const [isToggled, setToggle] = useState(false);
    const { setItem, getItem } = useLocalStorage();
    useEffect(() => {
        getItem('theme').then(
            (theme) => {
                // console.log("theme",theme);
                document.documentElement.classList.toggle('dark', theme === 'dark');
                document.documentElement.classList.add(theme);
                setToggle(theme === 'dark');
            },
        ).catch(
            () => {
                const colorSchema = window.matchMedia('(prefers-color-scheme: dark)');
                const handleColorSchemaChange = () => {
                    document.documentElement.classList.toggle('dark', colorSchema.matches);
                    setToggle(colorSchema.matches);
                };
                handleColorSchemaChange(); // update toggle initially
                colorSchema.addEventListener('change', handleColorSchemaChange);
                return () => {
                    colorSchema.removeEventListener('change', handleColorSchemaChange);
                };
            },
        );


    }, []);

    const handleToggleClick = () => {
        const element = document.documentElement;
        const isDark = !element.classList.contains('dark');
        element.classList.toggle('dark', isDark);
        setItem('theme', isDark ? 'dark' : 'light');
        setToggle(isDark);
    };

    return {
        isToggled,
        handleToggleClick,
    };
};
