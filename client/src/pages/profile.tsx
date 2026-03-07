import { goalLabels, goalOptions } from '@/assets/assets';
import type { ProfileFormData, UserData } from '@/assets/types';
import Button from '@/assets/ui/Button';
import Input from '@/assets/ui/Input';
import Select from '@/assets/ui/Select';
import Card from '@/components/ui/Card';
import { api } from '@/configs/api';
import { useAppContext } from '@/context/app-context';
import { useTheme } from '@/context/theme-context';
import {
  Calendar,
  FlameIcon,
  HamburgerIcon,
  LogOutIcon,
  RulerIcon,
  ScaleIcon,
  SunIcon,
  TargetIcon,
  UserIcon
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout, fetchUser, allActivityLogs, allFoodLogs } =
    useAppContext();

  const { theme, toggleTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    age: user?.age || 0,
    dailyCalorieBurn: user?.dailyCalorieBurn || 0,
    dailyCalorieIntake: user?.dailyCalorieIntake || 0,
    goal: user?.goal || 'maintain',
    height: user?.height || 0,
    weight: user?.weight || 0
  });

  const fetchUserData = () => {
    if (user) {
      setFormData({
        age: user.age || 0,
        weight: user.weight || 0,
        height: user.height || 0,
        goal: user.goal || 'maintain',
        dailyCalorieBurn: user.dailyCalorieBurn || 0,
        dailyCalorieIntake: user.dailyCalorieIntake || 0
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updates = {
        ...formData,
        goal: formData.goal as 'lose' | 'maintain' | 'gain'
      } as Partial<UserData>;
      const response = await api.put(`/api/users/${user?.id}`, updates, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (response.status === 200) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        fetchUser(user?.token || '');
      }
    } catch {
      toast.error('An error occurred while updating your profile');
    }
  };

  useEffect(() => {
    (() => {
      fetchUserData();
    })();
  }, [user]);

  // if (!user || formData) return null;

  const getStats = useCallback(() => {
    const todayKey = new Date().toLocaleDateString('en-GB');
    const foodData = allFoodLogs.filter((f) => {
      if (!f.createdAt) return false;
      return new Date(f.createdAt).toLocaleDateString('en-GB') === todayKey;
    });
    const activityData = allActivityLogs.filter((a) => {
      if (!a.createdAt) return false;
      return new Date(a.createdAt).toLocaleDateString('en-GB') === todayKey;
    });
    return {
      totalCalories: foodData.reduce((acc, food) => acc + food.calories, 0),
      totalCaloriesBurned: activityData.reduce(
        (acc, activity) => acc + activity.calories,
        0
      ),
      totalCaloriesIntake:
        foodData.reduce((acc, food) => acc + food.calories, 0) -
        activityData.reduce((acc, activity) => acc + activity.calories, 0),
      totalActiveMinutes: activityData.reduce(
        (acc, activity) => acc + activity.duration,
        0
      ),
      totalSteps: 0,
      totalDistance: 0,
      totalFloors: 0
    };
  }, [allFoodLogs, allActivityLogs]);

  const stats = getStats();

  return (
    <div className="page-container">
      {/* header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Manage your profile information and settings.
        </p>
      </div>

      <div className="profile-content">
        {/* left column */}
        <Card>
          {/* card title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
              <UserIcon className="size-6 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Profile Information
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Member since{' '}
                {new Date(user?.createdAt || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 max-w-2xl">
              <Input
                label="Age (years)"
                value={formData.age}
                type="number"
                className="max-w-2xl"
                onChange={(value) =>
                  setFormData({ ...formData, age: Number(value) })
                }
              />
              <Input
                label="Weight (kg)"
                value={formData.weight}
                type="number"
                className="max-w-2xl"
                onChange={(value) =>
                  setFormData({ ...formData, weight: Number(value) })
                }
              />
              <Input
                label="Height (cm) - Optionals"
                value={formData.height}
                type="number"
                className="max-w-2xl"
                onChange={(value) =>
                  setFormData({ ...formData, height: Number(value) })
                }
              />
              <Select
                label="Goal"
                value={formData.goal}
                className="max-w-2xl"
                options={goalOptions}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    goal: value as 'lose' | 'maintain' | 'gain'
                  })
                }
              />
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      age: Number(user?.age),
                      weight: Number(user?.weight),
                      height: Number(user?.height),
                      goal: user?.goal as 'lose' | 'maintain' | 'gain',
                      dailyCalorieBurn: user?.dailyCalorieBurn || 0,
                      dailyCalorieIntake: user?.dailyCalorieIntake || 0
                    } as ProfileFormData);
                  }}
                  variant="secondary"
                  className="mt-4 w-full">
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  variant="primary"
                  className="mt-4 w-full">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {/* age */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200">
                  <div className="size-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                    <Calendar
                      size={24}
                      className="text-slate-500 dark:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Age
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {user?.age} years old
                    </p>
                  </div>
                </div>

                {/* weight */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200">
                  <div className="size-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                    <ScaleIcon
                      size={24}
                      className="text-slate-500 dark:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Weight
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {user?.weight} kg
                    </p>
                  </div>
                </div>

                {/* height */}
                {user?.height && user?.height !== 0 && (
                  <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200">
                    <div className="size-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                      <RulerIcon
                        size={24}
                        className="text-slate-500 dark:text-slate-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Height
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {user?.height} cm
                      </p>
                    </div>
                  </div>
                )}

                {/* goal */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200">
                  <div className="size-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                    <TargetIcon
                      size={24}
                      className="text-slate-500 dark:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Goal
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {goalLabels[user?.goal as 'lose' | 'maintain' | 'gain']}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                className="mt-4 w-full">
                Edit Profile
              </Button>
            </>
          )}
        </Card>

        {/* right column */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Daily Stats
              <span className="text-sm text-slate-500 dark:text-slate-400">
                (
                {new Date().toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                )
              </span>
            </h3>

            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200">
              {/* food entries count */}
              <div className="size-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                <HamburgerIcon className="size-6 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Food Entries
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {allFoodLogs.length} entries
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200">
              <div className="size-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                <FlameIcon className="size-6 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Calories Burned
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stats.totalCaloriesBurned} kcal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200">
              <div className="size-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                <FlameIcon className="size-6 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Calories Intake
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stats.totalCaloriesIntake} kcal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200">
              <div className="size-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                <FlameIcon className="size-6 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Active Minutes
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stats.totalActiveMinutes} minutes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200">
              <div className="size-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                <FlameIcon className="size-6 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Steps
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stats.totalSteps} steps
                </p>
              </div>
            </div>
          </div>

          {/* logout button for desktop */}
          <div className="hidden md:block">
            <Button
              onClick={logout}
              variant="danger"
              className="w-full flex items-center justify-center gap-2 mt-4 bg-red-500 dark:bg-red-900/20 text-white dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-800 focus:ring-red-400">
              <LogOutIcon className="size-5" />
              <span className="text-sm font-medium">Logout</span>
            </Button>
          </div>
        </Card>

        {/* toggle theme button for phone */}
        <div className="md:hidden z-50">
          <Button
            onClick={toggleTheme}
            variant="secondary"
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-emerald-400 dark:from-emerald-400 dark:to-emerald-500 text-white">
            <span className="text-sm font-medium">
              {theme === 'light'
                ? 'Switch to dark mode'
                : 'Switch to light mode'}
            </span>
            <SunIcon className="size-5" />
          </Button>
        </div>

        {/* logout button for phone */}
        <div className="md:hidden">
          <Button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 focus:ring-red-400">
            <LogOutIcon className="size-5" />
            <span className="text-sm font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
