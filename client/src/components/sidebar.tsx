import logo from '@/assets/logo.svg';
import { useTheme } from '@/context/theme-context';
import { cn } from '@/lib/utils';
import {
  ActivityIcon,
  HomeIcon,
  PizzaIcon,
  SunIcon,
  UserIcon
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', icon: HomeIcon, path: '/' },
  { label: 'Food Log', icon: PizzaIcon, path: '/food-log' },
  { label: 'Activity', icon: ActivityIcon, path: '/activity-log' },
  { label: 'Profile', icon: UserIcon, path: '/profile' }
];

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      aria-label="Main navigation"
      className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
          <img src={logo} alt="Fitness Tracker" width={320} height={80} />
        </div>
        <span
          className={cn(
            'text-xl font-bold text-slate-700 dark:text-slate-200 font-family-inter',
            theme === 'light' ? 'text-slate-700' : 'text-slate-200'
          )}>
          Fitness Tracker
        </span>
      </div>

      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 p-4 rounded-xl transition-colors duration-200 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 active:scale-[0.98] cursor-pointer text-slate-700 dark:text-slate-200',
                  isActive &&
                    'bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-500 dark:text-emerald-400'
                )
              }>
              <item.icon aria-hidden="true" className="size-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-6">
        <button
          onClick={toggleTheme}
          aria-pressed={theme === 'dark'}
          aria-label={
            theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
          }
          className="flex items-center gap-2 w-full p-4 rounded-xl transition-colors duration-200 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 active:scale-[0.98] cursor-pointer text-slate-700 dark:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
          <SunIcon aria-hidden="true" className="size-5" />
          <span
            className={cn(
              'text-sm font-medium',
              theme === 'light' ? 'text-emerald-500' : 'text-emerald-400'
            )}>
            {theme === 'light' ? 'Light mode' : 'Dark mode'}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
