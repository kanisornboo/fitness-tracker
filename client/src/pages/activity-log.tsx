import { quickActivities } from '@/assets/assets';
import { type ActivityEntry } from '@/assets/types';
import Input from '@/assets/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { api } from '@/configs/api';
import { useAppContext } from '@/context/app-context';
import {
  ActivityIcon,
  DumbbellIcon,
  PlusIcon,
  TimerIcon,
  Trash2Icon,
  XIcon
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ActivityLog = () => {
  const today = new Date().toISOString().split('T')[0] as string;
  const { allActivityLogs, setAllActivityLogs } = useAppContext();

  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    duration: number;
    calories: number;
  }>({
    name: '',
    duration: 0,
    calories: 0
  });

  const loadActivities = useCallback(async () => {
    setLoading(true);
    try {
      const todayActivities = allActivityLogs.filter((activity) => {
        if (!activity.createdAt) return false;
        return (
          new Date(activity.createdAt).toISOString().split('T')[0] === today
        );
      }) as ActivityEntry[];
      setActivities(todayActivities);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [allActivityLogs, today]);

  const handleQuickAdd = (activity: { name: string; rate: number }) => {
    setFormData((prev) => ({
      ...prev,
      name: activity.name,
      duration: 30,
      calories: activity.rate * 30
    }));
    setShowForm(true);
  };

  useEffect(() => {
    (async () => {
      await loadActivities();
    })();
  }, [allActivityLogs, loadActivities, today]);

  const totalMinutes = activities.reduce(
    (acc, activity) => acc + activity.duration,
    0
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.duration <= 0) {
      return toast.error(
        'Please fill in all fields and duration must be greater than 0'
      );
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/activity-logs', formData);
      setAllActivityLogs((prev) => [...prev, data]);
      setFormData({ name: '', duration: 0, calories: 0 });
      setError(null);
      setShowForm(false);
      toast.success('Activity added successfully');
    } catch (err) {
      toast.error('Failed to add activity');
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: '', duration: 0, calories: 0 });
    setError(null);
  };

  const handleDurationChange = (value: string | number) => {
    const duration = Number(value);
    const activity = quickActivities.find(
      (a) => a.name.toLowerCase() === formData.name?.toLowerCase()
    );

    setFormData({
      ...formData,
      duration,
      calories: activity ? duration * activity.rate : formData.calories
    });
  };

  const handleDelete = async (documentId: string) => {
    try {
      await api.delete(`/api/activity-logs/${documentId}`);
      setAllActivityLogs((prev) =>
        prev.filter((activity) => activity.documentId !== documentId)
      );
    } catch {
      toast.error('Failed to delete activity');
    }
  };

  return (
    <div className="page-container">
      {/* header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Activity Log
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track your activity to stay on track with your goals.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Active Time Today
            </p>
            <p className="text-2xl font-semi  bold text-emerald-500 dark:text-blue-400">
              {totalMinutes.toLocaleString()} minutes
            </p>
          </div>
        </div>
      </div>

      <div className="page-content-grid">
        {/* Quick add section */}
        {!showForm && (
          <div className="space-y-4">
            <Card>
              <h3 className="text-lg font-bold text-indigo-500 dark:text-white">
                Quick Add
              </h3>

              <div className="flex flex-wrap gap-2 mt-4 ">
                {quickActivities.map((activity) => (
                  <button
                    key={activity.name}
                    onClick={() => handleQuickAdd(activity)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-700/80 dark:bg-green-900/80 text-white hover:bg-green-800 dark:hover:bg-green-800 transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-green-700">
                    <activity.icon aria-hidden="true" size={18} />
                    <span className="text-base font-medium capitalize text-white">
                      {activity.name}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            <button
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-700/80 dark:bg-green-900/80 text-white hover:bg-green-800 dark:hover:bg-green-800 transition-colors duration-200 cursor-pointer"
              onClick={() => setShowForm(true)}>
              <PlusIcon className="size-4 mr-2" />
              Add Activity
            </button>
          </div>
        )}

        {/* Add form section */}
        {showForm && (
          <Card className="border-2 border-indigo-500 dark:border-indigo-400">
            <h3 className="text-lg font-bold text-indigo-500 dark:text-indigo-400 mb-4">
              New Activity
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input
                label="Activity Name"
                type="text"
                placeholder="e.g Running, Swimming, etc."
                value={formData.name}
                onChange={(value) =>
                  setFormData({ ...formData, name: value as string })
                }
              />

              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  label="Duration (min)"
                  type="number"
                  placeholder="e.g 30"
                  value={formData.duration}
                  onChange={handleDurationChange}
                  min={1}
                  max={300}
                />
                <Input
                  className="flex-1"
                  label="Calories Burned"
                  type="number"
                  min={1}
                  max={3000}
                  placeholder="e.g 300"
                  value={formData.calories}
                  onChange={(value) =>
                    setFormData({ ...formData, calories: Number(value) })
                  }
                />
              </div>

              {error && <p role="alert" className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="flex gap-2 pt-2 justify-end">
                <Button
                  variant="secondary"
                  className="flex-1"
                  type="button"
                  onClick={handleCancel}>
                  <XIcon className="size-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="flex-1">
                  <PlusIcon className="size-4 mr-2" />
                  Add Activity
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* activities list section */}
        {activities.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center mx-auto mb-4">
              <DumbbellIcon className="size-10 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-lg font-bold text-indigo-500 dark:text-indigo-400">
                No activities logged today
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Start tracking your activities to stay on track with your goals.
              </p>
            </div>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <PlusIcon className="size-4 mr-2" />
              Add Activity
            </Button>
          </Card>
        ) : (
          <Card className="text-center py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center">
                <ActivityIcon className="size-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-indigo-500 dark:text-indigo-400">
                  Today's Activities List
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {activities.length} activities logged today
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-entry-item">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center">
                      <TimerIcon className="size-4 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 capitalize">
                        {activity.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(activity?.createdAt || '').toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {activity.duration} minutes
                      </p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {activity.calories.toLocaleString()} kcal
                      </p>
                    </div>
                    <button
                      aria-label={`Delete ${activity.name}`}
                      className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                      onClick={() => handleDelete(activity.documentId)}>
                      <Trash2Icon aria-hidden="true" className="size-4 text-red-500 dark:text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* total summary section */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                Total Active Time
              </span>
              <span className="text-sm font-medium text-emerald-500 dark:text-emerald-400">
                {totalMinutes.toLocaleString()} minutes
              </span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
