// User
export type User = {
    age?: number;
    createdAt?: string;
    dailyCalorieBurn?: number;
    dailyCalorieIntake?: number;
    documentId?: string;
    email: string;
    goal?: 'lose' | 'maintain' | 'gain';
    height?: number;
    id: string;
    token: string;
    username: string;
    weight?: number;
} | null;

// Credentials
export type Credentials = {
    username?: string;
    email: string;
    password: string;
};

// User Form Data
export interface UserData {
    age: number;
    createdAt: string;
    dailyCalorieBurn?: number;
    dailyCalorieIntake?: number;
    goal: 'lose' | 'maintain' | 'gain';
    height: number | null;
    name: string;
    weight: number;
}

// Profile Form Data
export interface ProfileFormData {
    age: number;
    dailyCalorieBurn: number;
    dailyCalorieIntake: number;
    goal: string;
    height: number;
    weight: number;
}

// Food
export interface FormData {
    calories: number;
    mealType: string;
    name: string;
}

// Food Entry
export interface FoodEntry {
    calories: number;
    createdAt?: string;
    date: string;
    documentId?: string;
    id: number | string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
}

// Activity Entry
export interface ActivityEntry {
    calories: number;
    createdAt?: string;
    date: string;
    documentId: string;
    duration: number;
    id: number;
    name: string;
}

export type AppContextType = {
    fetchUser: (token: string) => Promise<void>;
    login: (credentials: Credentials) => Promise<void>;
    logout: () => void;
    setAllActivityLogs: React.Dispatch<React.SetStateAction<ActivityEntry[]>>;
    setAllFoodLogs: React.Dispatch<React.SetStateAction<FoodEntry[]>>;
    setOnboardingCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    signup: (credentials: Credentials) => Promise<void>;
    allActivityLogs: ActivityEntry[];
    allFoodLogs: FoodEntry[];
    isUserFetched: boolean;
    onboardingCompleted: boolean;
    user: User;
};

export const initialState: AppContextType = {
    fetchUser: async () => {},
    login: async () => {},
    logout: () => {},
    setAllActivityLogs: () => {},
    setAllFoodLogs: () => {},
    setOnboardingCompleted: () => {},
    setUser: () => {},
    signup: async () => {},

    allActivityLogs: [],
    allFoodLogs: [],
    isUserFetched: false,
    onboardingCompleted: false,
    user: null
};
