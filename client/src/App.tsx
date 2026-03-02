import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import Loading from './components/loading';
import { useAppContext } from './context/app-context';
import ActivityLog from './pages/activity-log';
import Dashboard from './pages/dashboard';
import FoodLog from './pages/food-log';
import Layout from './pages/layout';
import { Login } from './pages/login';
import { Onboarding } from './pages/onboarding';
import Profile from './pages/profile';

const App = () => {
    const { user, isUserFetched, onboardingCompleted } = useAppContext();

    if (!user) {
        return isUserFetched ? <Login /> : <Loading />;
    }

    if (!onboardingCompleted) {
        return isUserFetched ? <Onboarding /> : <Loading />;
    }

    return (
        <>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/food-log" element={<FoodLog />} />
                    <Route path="/activity-log" element={<ActivityLog />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
