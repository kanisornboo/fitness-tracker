import BottomNav from '@/components/bottom-nav';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';

const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="flex-1 overflow-y-scroll">
        <Outlet />
        <BottomNav />
      </main>
    </div>
  );
};

export default Layout;
