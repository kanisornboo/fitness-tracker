import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mockApi from '../assets/mockApi';
import type {
    ActivityEntry,
    AppContextType,
    Credentials,
    FoodEntry,
    User
} from '../assets/types';
import { AppContext } from './app-context';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isUserFetched, setIsUserFetched] = useState(false);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

    const login = async (credentials: Credentials) => {
        const { data } = await mockApi.auth.login(credentials);
        setUser({
            ...data.user,
            token: data.jwt
        });

        if (data.user.age && data.user.weight && data.user.goal) {
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
    };

    const signup = async (credentials: Credentials) => {
        const { data } = await mockApi.auth.register(credentials);
        setUser(data.user as User);

        if (data.user.age && data.user.weight && data.user.goal) {
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
    };

    const fetchUser = async (token: string) => {
        const { data } = await mockApi.user.me();
        setUser({
            ...data.user,
            token: token
        });

        if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
            setOnboardingCompleted(true);
        }
        setIsUserFetched(true);
    };

    const fetchFoodLogs = async () => {
        try {
            const { data } = await mockApi.foodLogs.list();
            setAllFoodLogs(data as FoodEntry[]);
        } catch (error) {
            console.error(error);
            setAllFoodLogs([]);
        }
    };

    const fetchActivityLogs = async () => {
        try {
            const { data } = await mockApi.activityLogs.list();
            setAllActivityLogs(data as ActivityEntry[]);
        } catch (error) {
            console.error(error);
            setAllActivityLogs([]);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            (async () => {
                await fetchUser(token);
                await fetchFoodLogs();
                await fetchActivityLogs();
            })();
        } else {
            setTimeout(() => {
                setIsUserFetched(true);
            }, 100);
        }
    }, [navigate]);

    const logout = () => {
        setUser(null);
        setIsUserFetched(false);
        setOnboardingCompleted(false);
        setAllFoodLogs([]);
        setAllActivityLogs([]);
        localStorage.removeItem('token');
        navigate('/');
    };

    const value: AppContextType = {
        user,
        isUserFetched,
        onboardingCompleted,
        allFoodLogs,
        allActivityLogs,
        setUser,
        login,
        signup,
        fetchUser,
        logout,
        setOnboardingCompleted,
        setAllFoodLogs,
        setAllActivityLogs
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
