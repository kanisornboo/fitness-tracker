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

  if (!isUserFetched)
    return <Loading />;

  if (!user)
    return <Login />;

  if (!onboardingCompleted)
    return <Onboarding />;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-white focus:rounded-lg focus:font-medium">
        Skip to main content
      </a>
      <Toaster position="top-center" />
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
