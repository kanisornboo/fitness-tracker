import { mealTypeOptions, quickActivitiesFoodLog } from '@/assets/assets';
import type { FoodEntry } from '@/assets/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { api } from '@/configs/api';
import { useAppContext } from '@/context/app-context';
import {
  Loader2Icon,
  PlusIcon,
  SparkleIcon,
  Trash2Icon,
  UtensilsCrossedIcon,
  XIcon
} from 'lucide-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import toast from 'react-hot-toast';

const FoodLog = () => {
  const { allFoodLogs, setAllFoodLogs } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    calories: number;
    mealType: string;
  }>({
    name: '',
    calories: 0,
    mealType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // group entries by meal type for the current day in the allFoodLogs array
  // this is used to display the entries in the UI by meal type
  // e.g. breakfast, lunch, dinner, snack
  const groupEntries: Record<
    'breakfast' | 'lunch' | 'dinner' | 'snack',
    FoodEntry[]
  > = useMemo(
    () =>
      entries.reduce(
        (acc, entry) => {
          acc[entry.mealType] = [...(acc[entry.mealType] || []), entry];
          return acc;
        },
        {} as Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]>
      ),
    [entries]
  );

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const foodEntries: FoodEntry[] = allFoodLogs.filter((entry) => {
        if (!entry.createdAt) return false;
        return new Date(entry.createdAt).toISOString().split('T')[0] === today;
      }) as FoodEntry[];
      setEntries(foodEntries);
    } catch (error) {
      console.error(error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [allFoodLogs, today]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      formData.calories <= 0 ||
      !formData.mealType.trim()
    ) {
      return toast.error('Please fill in all fields');
    }

    try {
      const { data } = await api.post('/api/food-logs', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setAllFoodLogs((prev) => [...prev, data]);
      setFormData({ name: '', calories: 0, mealType: '' });
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setError((error as Error).message);
    }
  };

  const handleQuickAdd = (
    activityName: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ) => {
    api.post(
      '/api/food-logs',
      {
        name: activityName,
        calories: 0,
        mealType: activityName
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  };

  const handleDelete = async (documentId: string) => {
    try {
      const confirm = window.confirm(
        'Are you sure you want to delete this food entry?'
      ) as boolean;
      if (!confirm) return;
      await api.delete(`/api/food-logs/${documentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAllFoodLogs((prev) =>
        prev.filter((entry) => entry.documentId !== documentId)
      );
      // loadEntries();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete food entry');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/api/image-analysis', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      let mealType = '';
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) {
        mealType = 'breakfast';
      } else if (hour >= 12 && hour < 18) {
        mealType = 'lunch';
      } else if (hour >= 18 && hour < 24) {
        mealType = 'dinner';
      } else {
        mealType = 'snack';
      }

      if (!mealType || !response.data.result?.calories) {
        toast.error('Failed to analyze image');
        return;
      }

      // save result to the database
      console.log({ response });
      const { data: newEntry } = await api.post('/api/food-logs', {
        name: response.data.result?.name || '',
        calories: response.data.result?.calories || 0,
        mealType: mealType
      });

      setAllFoodLogs([...allFoodLogs, newEntry]);
      setFormData({ name: '', calories: 0, mealType: '' });
      setShowForm(false);

      if (inputRef.current) {
        inputRef.current.value = '';
      }

      toast.success('Food entry added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const totalCalories = entries.reduce((acc, entry) => acc + entry.calories, 0);

  return (
    <div className="page-container">
      {/* header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Food Log
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track your food intake and activity to stay on track with your
              goals.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Today's Total
            </p>
            <p className="text-2xl font-semi  bold text-emerald-500 dark:text-emerald-400">
              {totalCalories.toLocaleString()} kcal
            </p>
          </div>
        </div>
      </div>

      <div className="page-content-grid">
        {/* Quick add section */}
        {!showForm && (
          <div className="space-y-4">
            <Card>
              <h3 className="text-lg font-bold text-indigo-500 dark:text-indigo-400">
                Quick Add
              </h3>

              <div className="flex flex-wrap gap-2 mt-4">
                {quickActivitiesFoodLog.map((activity) => (
                  <button
                    key={activity.name}
                    onClick={() =>
                      handleQuickAdd(
                        activity.name as
                          | 'breakfast'
                          | 'lunch'
                          | 'dinner'
                          | 'snack'
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-700/80 dark:bg-green-900/80 text-white hover:bg-green-800 dark:hover:bg-green-800 transition-colors duration-200 cursor-pointer">
                    <span className="text-lg">{activity.emoji}</span>
                    <span className="text-base font-medium">
                      {activity.name}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* button tags */}
            <div className="flex flex-row gap-2 justify-center">
              <Button
                variant="primary"
                className="w-1/2   text-white hover:bg-green-800 dark:hover:bg-green-800 transition-colors duration-200 cursor-pointer"
                onClick={() => setShowForm(true)}>
                <PlusIcon className="size-4 mr-2" />
                Add Food Entry
              </Button>
              <Button
                variant="primary"
                className="w-1/2  text-white hover:bg-blue-800 dark:hover:bg-blue-800 transition-colors duration-200 cursor-pointer"
                onClick={() => inputRef.current && inputRef.current.click()}>
                {loading ? (
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                ) : (
                  <SparkleIcon className="size-4 mr-2" />
                )}

                {loading ? 'Analyzing image...' : 'AI Food Suggestions'}
              </Button>
              <input
                type="file"
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
                ref={inputRef}
              />

              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  Error: {error}
                </p>
              )}
            </div>
          </div>
        )}

        {/* add form section */}
        {showForm && (
          <div className="space-y-4 col-span-2">
            <Card className="border-2 border-indigo-500 dark:border-indigo-400">
              <h3 className="text-lg font-bold text-indigo-500 dark:text-indigo-400">
                Add Food Entry
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <Input
                  label="Food Name"
                  type="text"
                  placeholder="Enter food name"
                  value={formData.name}
                  onChange={(value) =>
                    setFormData({ ...formData, name: value as string })
                  }
                />
                <Input
                  label="Calories (kcal)"
                  type="number"
                  required
                  min={1}
                  max={10000}
                  value={formData.calories}
                  onChange={(value) =>
                    setFormData({ ...formData, calories: Number(value) })
                  }
                />
                <Select
                  label="Meal Type"
                  placeholder="Select meal type"
                  value={formData.mealType}
                  options={
                    mealTypeOptions as { label: string; value: string }[]
                  }
                  onChange={(value) =>
                    setFormData({ ...formData, mealType: value.toString() })
                  }
                />
                <div className="flex gap-2 pt-2 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({
                        name: '',
                        calories: 0,
                        mealType: ''
                      });
                    }}>
                    <XIcon className="size-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      loading ||
                      !formData.name.trim() ||
                      formData.calories <= 0 ||
                      !formData.mealType.trim()
                    }
                    type="submit"
                    variant="primary"
                    className="flex-1">
                    <PlusIcon className="size-4 mr-2" />
                    {loading ? (
                      <Loader2Icon className="size-4 mr-2 animate-spin" />
                    ) : (
                      'Add Food Entry'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* entries list section  */}
        {entries.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossedIcon className="size-8 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              No food logged today
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Start tracking your food intake to stay on track with your goals.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupEntries).map(([mealType, entries]) => (
              <Card
                key={mealType}
                className="border-2 border-indigo-500 dark:border-indigo-400">
                <h3 className="font-semibold text-slate-800 dark:text-white capitalize flex items-center gap-2 justify-between p-2 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-lg mb-2">
                  <div className="flex items-center gap-2">
                    {mealTypeOptions.find((option) => option.value === mealType)
                      ?.label || mealType}{' '}
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      ({entries.length} items)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {entries.reduce((acc, entry) => acc + entry.calories, 0)}{' '}
                      kcal
                    </span>
                  </div>
                </h3>
                <div className="flex flex-col gap-2">
                  {entries.map((entry) => (
                    <Card key={entry.documentId}>
                      <div className="flex items-center gap-2 justify-between p-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {entry.name}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {entry.calories} kcal
                          </span>
                          <button
                            className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200 cursor-pointer"
                            onClick={() =>
                              handleDelete(entry.documentId as string)
                            }>
                            <Trash2Icon className="size-4 text-red-500 dark:text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FoodLog;
