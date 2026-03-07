import { cn } from '@/lib/utils';
import { ActivityIcon, HomeIcon, PizzaIcon, UserIcon } from 'lucide-react';
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

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-200 bottom-safe lg:hidden">
      <div className="flex items-center justify-between h-24- w-full">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-1 items-center justify-center gap-2 p-4 transition-colors duration-200 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 active:scale-[0.98]text-slate-700 dark:text-slate-200 cursor-pointer',
                isActive &&
                  'bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-500 dark:text-emerald-400'
              )
            }>
            <item.icon className="size-5.5" />
            <span className="text-sm font-sm text-slate-700 dark:text-slate-200">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
export default BottomNav;
