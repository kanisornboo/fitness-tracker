import { getMotivationalMessage, goalLabels } from '@/assets/assets';
import type { ActivityEntry, FoodEntry } from '@/assets/types';
import CaloriesChart from '@/components/calories-chart';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { useAppContext } from '@/context/app-context';
import {
  ActivityIcon,
  BarChartIcon,
  DumbbellIcon,
  FlameIcon,
  HamburgerIcon,
  ListCheckIcon,
  MinusIcon,
  RulerIcon,
  ScaleIcon,
  TrendingDownIcon
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const getGreetingPhrase = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { allActivityLogs, allFoodLogs, user } = useAppContext();
  const [todayFoodLogs, setTodayFoodLogs] = useState<FoodEntry[]>([]);
  const [todayActivityLogs, setTodayActivityLogs] = useState<ActivityEntry[]>(
    []
  );
  const DAILY_CALORIES_LIMIT: number = user?.dailyCalorieIntake || 0;

  const loadUserData = useCallback(() => {
    const todayKey = new Date().toLocaleDateString('en-GB');

    const foodData = allFoodLogs.filter((f) => {
      if (!f.createdAt) return false;
      return new Date(f.createdAt).toLocaleDateString('en-GB') === todayKey;
    });

    const activityData = allActivityLogs.filter((a) => {
      if (!a.createdAt) return false;
      return new Date(a.createdAt).toLocaleDateString('en-GB') === todayKey;
    });

    setTodayFoodLogs(foodData);
    setTodayActivityLogs(activityData);
  }, [allFoodLogs, allActivityLogs]);

  useEffect(() => {
    (() => {
      loadUserData();
    })();
  }, [loadUserData]);

  const totalCalories: number = todayFoodLogs.reduce(
    (acc, log) => acc + log.calories,
    0
  );

  const remainingCalories: number = DAILY_CALORIES_LIMIT - totalCalories;
  const totalActiveMinutes: number = todayActivityLogs.reduce(
    (acc, log) => acc + log.duration,
    0
  );
  const totalBurnedCalories: number = todayActivityLogs.reduce(
    (acc, log) => acc + log.calories,
    0
  );

  // Get motivational message
  const motivationMessage = getMotivationalMessage(
    totalCalories,
    totalActiveMinutes,
    DAILY_CALORIES_LIMIT
  );

  return (
    <div className="page-container">
      <div className="page-bg-blob" aria-hidden="true" />

      {/* header */}
      <div className="flex flex-col items-center justify-center mt-10 gap-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
          {getGreetingPhrase()},
        </p>

        <h1 className="text-5xl font-black uppercase tracking-tighter leading-none bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(16,185,129,0.35)]">
          {user?.username || 'Athlete'}
        </h1>

        {/* Motivation pill */}
        <div className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-blue-500/25 bg-blue-500/8 dark:bg-blue-400/8 px-4 py-2 backdrop-blur-sm">
          <span aria-hidden="true" className="text-lg leading-none">
            {motivationMessage?.emoji}
          </span>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            {motivationMessage?.text}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-grid">
        {/* calories card */}
        <Card className="shadow-lg col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center">
                <HamburgerIcon className="size-6 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Calories Consumed</p>
                <p className="text-2xl font-bold">{totalCalories} kcal</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <p className="text-sm font-medium">Limit</p>
              <p className="text-2xl font-bold">{DAILY_CALORIES_LIMIT} kcal</p>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            value={totalCalories}
            max={DAILY_CALORIES_LIMIT}
            className="mt-4"
          />

          <div className="mt-4 flex items-center justify-between">
            <div
              className={` px-3 py-1.5 rounded-lg ${remainingCalories < 0 ? 'bg-red-500/10 dark:bg-red-900/10' : 'bg-blue-500/10 dark:bg-blue-400/10'}`}>
              <p className="text-sm">
                {remainingCalories >= 0
                  ? `You have ${remainingCalories} kcal left`
                  : `You have exceeded your limit by ${Math.abs(remainingCalories)} kcal`}
              </p>
            </div>
            <span
              className="text-sm"
              style={{ color: remainingCalories < 0 ? '#dc2626' : '#16a34a' }}>
              {Math.round((totalCalories / DAILY_CALORIES_LIMIT) * 100)}%
            </span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 my-4" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center">
                <FlameIcon className="size-6 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Calories Burned</p>
                <p className="text-2xl font-bold">{totalBurnedCalories} kcal</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <p className="text-sm font-medium">Goal</p>
              <p className="text-sm font-bold capitalize text-blue-500 dark:text-blue-400">
                {goalLabels[user?.goal as 'lose' | 'maintain' | 'gain']}
              </p>
            </div>
          </div>

          <ProgressBar
            value={totalBurnedCalories}
            max={user?.dailyCalorieBurn || 300}
            className="mt-4"
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm">
                {totalBurnedCalories >= 0
                  ? `You have burned ${totalBurnedCalories} kcal`
                  : `You have exceeded your limit by ${Math.abs(totalBurnedCalories)} kcal`}
              </p>
            </div>
            <span
              className="text-sm"
              style={{ color: totalBurnedCalories < 0 ? 'red' : 'green' }}>
              {Math.round(
                (totalBurnedCalories / (user?.dailyCalorieBurn || 300)) * 100
              )}
              %
            </span>
          </div>
        </Card>

        {/* stats row */}
        <div className="dashboard-card-grid">
          {/* active minutes card */}
          <Card className="shadow-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center">
                <ActivityIcon className="size-6 text-blue-700 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium">Active</p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {totalActiveMinutes} minutes today!
            </p>
          </Card>

          {/* activities count card */}
          <Card className="shadow-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 flex items-center justify-center">
                <ListCheckIcon className="size-6 text-purple-700 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium">Workouts</p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {todayActivityLogs.length} activities logged
            </p>
          </Card>
        </div>

        {/* your goal card */}
        {user &&
          (() => {
            const netCalories = totalCalories - totalBurnedCalories;
            const goalConfig = {
              lose: {
                label: 'Lose Weight',
                Icon: TrendingDownIcon,
                color: 'blue',
                onTrack: netCalories <= DAILY_CALORIES_LIMIT,
                statusText:
                  netCalories <= DAILY_CALORIES_LIMIT
                    ? 'On track'
                    : 'Over limit',
                tip: 'Keep your net calories in a deficit to reach your goal.'
              },
              maintain: {
                label: 'Maintain Weight',
                Icon: MinusIcon,
                color: 'blue',
                onTrack: Math.abs(netCalories - DAILY_CALORIES_LIMIT) < 200,
                statusText:
                  Math.abs(netCalories - DAILY_CALORIES_LIMIT) < 200
                    ? 'Balanced'
                    : 'Off balance',
                tip: 'Aim to keep net calories close to your daily limit.'
              },
              gain: {
                label: 'Gain Muscle',
                Icon: DumbbellIcon,
                color: 'orange',
                onTrack: netCalories >= DAILY_CALORIES_LIMIT,
                statusText:
                  netCalories >= DAILY_CALORIES_LIMIT ? 'Surplus' : 'Need more',
                tip: 'Eat above your daily limit to fuel muscle growth.'
              }
            };
            const goal = user.goal as 'lose' | 'maintain' | 'gain';
            const cfg = goalConfig[goal];
            const GoalIcon = cfg.Icon;
            const isGreen = cfg.color === 'blue';
            const isBlue = cfg.color === 'blue';

            const ringMax = DAILY_CALORIES_LIMIT || 2000;
            const ringPct = Math.min(Math.max(netCalories / ringMax, 0), 1);
            const radius = 20;
            const circumference = 2 * Math.PI * radius;
            const dash = ringPct * circumference;

            return (
              <Card className="goal-card-animated overflow-hidden p-5 flex flex-col gap-4">
                {/* top row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="goal-icon-pulse size-11 rounded-2xl bg-linear-to-br from-[#007AFF]/20 to-[#3342D3]/15 dark:from-[#007AFF]/25 dark:to-[#3342D3]/20 flex items-center justify-center shrink-0">
                      <GoalIcon
                        className={`size-5 ${isBlue ? 'text-blue-500 dark:text-blue-400' : 'text-orange-500 dark:text-orange-400'}`}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Your Goal
                      </span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {cfg.label}
                      </p>
                    </div>
                  </div>

                  {/* status chip */}
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.onTrack ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400' : 'bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400'}`}>
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full inline-block ${cfg.onTrack ? 'bg-blue-500' : 'bg-red-500'}`}
                    />
                    {cfg.statusText}
                  </span>
                </div>

                {/* divider */}
                <div className="border-t border-slate-100 dark:border-slate-800" />

                {/* net calories + ring */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Net Calories
                    </span>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {netCalories.toLocaleString()}
                      <span className="text-sm font-medium text-slate-400 ml-1">
                        kcal
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {cfg.tip}
                    </p>
                  </div>

                  {/* mini ring */}
                  <svg
                    aria-hidden="true"
                    width="52"
                    height="52"
                    className="-rotate-90 shrink-0">
                    <circle
                      cx="26"
                      cy="26"
                      r={radius}
                      fill="none"
                      strokeWidth="5"
                      className="stroke-slate-100 dark:stroke-slate-800"
                    />
                    <circle
                      cx="26"
                      cy="26"
                      r={radius}
                      fill="none"
                      strokeWidth="5"
                      strokeDasharray={`${dash} ${circumference}`}
                      strokeLinecap="round"
                      className={`transition-all duration-700 ${isBlue ? 'stroke-blue-500' : 'stroke-orange-500'}`}
                    />
                  </svg>
                </div>
              </Card>
            );
          })()}

        {/* body metrics card */}
        {user && user.weight && (
          <Card className="bg-blue-500/10 dark:bg-blue-400/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center">
                <ScaleIcon className="size-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-500 dark:text-indigo-400">
                  Body Metrics
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Your stats {user.weight} kg
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ScaleIcon className="size-4 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-sm font-medium">Weight</span>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {user.weight} kg
                </span>
              </div>
              {user.height && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <RulerIcon className="size-4 text-indigo-500 dark:text-indigo-400" />
                    <span className="text-sm font-medium">Body Height</span>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {user.height} cm
                  </span>
                </div>
              )}

              {user.height && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-medium">Body Mass Index</span>
                    {user.weight && user.height && (
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium text-right">
                        {(
                          (user.weight /
                            ((user.height / 100) * (user.height / 100))) *
                          10000
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* BMI Scale Visual */}
                  <div className="h-2 w-full bg-slate-900/10 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="flex-1 bg-blue-400 opacity-30" />
                    <div className="flex-1 bg-blue-400 opacity-30" />
                    <div className="flex-1 bg-orange-400 opacity-30" />
                    <div className="flex-1 bg-red-400 opacity-30" />
                    {/* <div
                      className="h-full bg-indigo-500 dark:bg-indigo-400"
                      style={{
                        width: `${(user.weight / (user.height * user.height)) * 10000}%`
                      }}>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {(
                          (user.weight / (user.height * user.height)) *
                          10000
                        ).toFixed(2)}
                      </span>
                    </div> */}
                  </div>
                  <div className="flex justify-between mt-2 text[10px] text-slate-400">
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* quick summary card */}
        <Card>
          <h3 className="text-lg font-bold text-blue-500 dark:text-blue-400">
            Today's Summary
          </h3>

          {/* Meals logged, Total calories, Active time */}
          <div className="space-y-3 mt-4">
            {/* Meals logged */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-medium">Meals logged</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {todayFoodLogs.length}
              </span>
            </div>

            {/* Total calories */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-medium">Total calories</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {totalCalories} kcal
              </span>
            </div>

            {/* Active time */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Active time</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {totalActiveMinutes} minutes
              </span>
            </div>
          </div>
        </Card>

        <Card className="col-span-2">
          <h3 className="text-lg font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-2">
            <BarChartIcon className="size-4 text-blue-500 dark:text-blue-400" />
            Calories Chart
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            This chart shows your calories intake and burn for the last 7 days.
          </p>

          <div className="mt-4">
            <CaloriesChart />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
