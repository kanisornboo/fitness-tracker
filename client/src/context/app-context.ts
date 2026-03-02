import { createContext, useContext } from 'react';
import { initialState, type AppContextType } from '../assets/types';

export const AppContext = createContext<AppContextType>(initialState);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within a AppProvider');
    }
    return context;
};
