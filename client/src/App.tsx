import { Route, Routes } from 'react-router-dom';
import ActivityLog from './pages/activity-log';
import Dashboard from './pages/dashboard';
import FoodLog from './pages/food-log';
import Layout from './pages/layout';
import Profile from './pages/profile';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/food-log" element={<FoodLog />} />
                <Route path="/activity-log" element={<ActivityLog />} />
            </Route>
        </Routes>
    );
};

export default App;
