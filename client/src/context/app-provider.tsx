import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type {
  ActivityEntry,
  AppContextType,
  Credentials,
  FoodEntry,
  User
} from '../assets/types';
import { api } from '../configs/api';
import { AppContext } from './app-context';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isUserFetched, setIsUserFetched] = useState(
    localStorage.getItem('token') ? false : true
  );
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  const login = async (credentials: Credentials) => {
    try {
      const { data } = await api.post('/api/auth/local', {
        identifier: credentials.email,
        password: credentials.password
      });

      setUser({ ...data?.user, token: data?.jwt });

      if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
        setOnboardingCompleted(true);
      }

      localStorage.setItem('token', data?.jwt);
      api.defaults.headers.common['Authorization'] = `Bearer ${data?.jwt}`;
    } catch (error) {
      toast.error((error as Error).message);
      setUser(null);
      setIsUserFetched(false);
      setOnboardingCompleted(false);
      setAllFoodLogs([]);
      setAllActivityLogs([]);
      localStorage.removeItem('token');
      api.defaults.headers.common['Authorization'] = '';
      navigate('/');
    }
  };

  const signup = async (credentials: Credentials) => {
    try {
      // register the user
      const response = await api.post('/api/auth/local/register', credentials);
      const { data } = response;

      // set the user to the state
      setUser({ ...data?.user, token: data?.jwt });
      // if the user is onboarded, set the onboarding completed to true
      if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
        setOnboardingCompleted(true);
      }

      // set the token to the local storage
      localStorage.setItem('token', data.jwt);

      // set the token to the default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const { data } = await api.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser({ ...data, token });

      if (data?.age && data?.weight && data?.goal) {
        setOnboardingCompleted(true);
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      toast.error(
        (error as any).message || error?.response?.data?.error?.message
      );
    }

    // set the user fetched to true after the user is fetched successfully
    setIsUserFetched(true);
  };

  const fetchFoodLogs = async (token: string) => {
    try {
      const { data } = await api.get('/api/food-logs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllFoodLogs(data);
    } catch (error) {
      toast.error((error as Error).message);
      setAllFoodLogs([]);
    }
  };

  const fetchActivityLogs = async (token: string) => {
    try {
      const { data } = await api.get('/api/activity-logs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllActivityLogs(data);
    } catch (error) {
      toast.error((error as Error).message);
      setAllActivityLogs([]);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setIsUserFetched(false);
    setOnboardingCompleted(false);
    setAllFoodLogs([]);
    setAllActivityLogs([]);
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = '';
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // why wrapping in anonymous function?
    // to avoid the lint error of useCallback
    void (async () => {
      try {
        await fetchUser(token);
        await Promise.all([fetchFoodLogs(token), fetchActivityLogs(token)]);
      } catch {
        // logout the user if the fetchUser or fetchFoodLogs or fetchActivityLogs fails to fetch the data
        logout();
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
