import BottomNav from '@/components/bottom-nav';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';

const Layout = () => {
  return (
    <div className="min-h-screen lg:max-h-screen lg:flex transition-colors duration-200 bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Sidebar />
      <main
        id="main-content"
        className="flex-1 overflow-y-scroll"
        tabIndex={-1}>
        <Outlet />
        <BottomNav />
      </main>
    </div>
  );
};

export default Layout;
