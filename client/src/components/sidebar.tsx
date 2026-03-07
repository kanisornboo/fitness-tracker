import { useTheme } from '@/context/theme-context';
import { cn } from '@/lib/utils';
import {
  ActivityIcon,
  HomeIcon,
  PersonStandingIcon,
  PizzaIcon,
  SunIcon,
  UserIcon
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  {
    label: 'Home',
    icon: HomeIcon,
    path: '/'
  },
  {
    label: 'Food Log',
    icon: PizzaIcon,
    path: '/food-log'
  },
  {
    label: 'Activity',
    icon: ActivityIcon,
    path: '/activity-log'
  },
  {
    label: 'Profile',
    icon: UserIcon,
    path: '/profile'
  }
];

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  // const { user, fetchUser } = useAppContext();
  //   const pathname = useLocation().pathname;
  // useEffect(() => {
  //     if (user?.token) {
  //         fetchUser(user.token);
  //     }
  // }, [fetchUser, user?.token]);

  return (
    <nav className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
          <PersonStandingIcon
            className={cn(
              'size-6',
              theme === 'light' ? 'text-emerald-500' : 'text-emerald-400'
            )}
          />
        </div>
        <h1
          className={cn(
            'text-xl font-bold text-slate-700 dark:text-slate-200',
            theme === 'light' ? 'text-slate-700' : 'text-slate-200'
          )}>
          Fitness Tracker
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 p-4 rounded-xl transition-colors duration-200 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 active:scale-[0.98] cursor-pointer text-slate-700 dark:text-slate-200',
                isActive &&
                  'bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-500 dark:text-emerald-400'
              )
            }>
            <item.icon className="size-5 text-slate-700 dark:text-slate-200" />
            <span className="text-sm font-sm text-slate-700 dark:text-slate-200">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-6">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 w-full p-4 rounded-xl transition-colors duration-200 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 active:scale-[0.98] cursor-pointer text-slate-700 dark:text-slate-200">
          <SunIcon
            className={cn(
              'size-5 text-slate-700 dark:text-slate-200',
              theme === 'light' ? 'text-slate-700' : 'text-slate-200'
            )}
          />
          <span
            className={cn(
              'text-sm font-sm text-slate-700 dark:text-slate-200',
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
