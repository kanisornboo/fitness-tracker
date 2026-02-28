import { useEffect, useState } from 'react';
import { ThemeContext } from './theme-context';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // Get the theme from localStorage or the system preference
    const [theme, setTheme] = useState<'light' | 'dark'>(
        () =>
            (localStorage.getItem('theme') as 'light' | 'dark') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light')
    );

    useEffect(() => {
        // Update the root element class list to match the theme
        const root = window.document.documentElement;

        // Remove the previous theme classes
        root.classList.remove('light', 'dark');

        // Add the new theme class
        root.classList.add(theme);

        // Save the theme to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Toggle the theme and save it to localStorage
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme
            }}>
            {children}
        </ThemeContext.Provider>
    );
};
