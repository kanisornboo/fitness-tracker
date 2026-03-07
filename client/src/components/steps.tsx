import { ageStepSchema, bodyStepSchema, goalStepSchema } from '@/lib/schemas';
import { api } from '@/configs/api';
import {
  DumbbellIcon,
  InfoIcon,
  TargetIcon,
  UserIcon,
  Weight
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { ProfileFormData, UserData } from '../assets/types';
import Button from '../assets/ui/Button';
import Input from '../components/ui/Input';
import { useAppContext } from '../context/app-context';
import { Slider } from './ui/Slider';
import Tooltip from './ui/Tooltip';

type Step = 1 | 2 | 3;

type GoalOption = {
  value: 'lose' | 'maintain' | 'gain';
  label: string;
  description: string;
  calories: number;
  burn: number;
  target: number;

  icon: React.ElementType;
};

const goalOptions: GoalOption[] = [
  {
    value: 'lose',
    label: 'Lose Weight',
    description: 'Lose weight by burning more calories than you intake.',
    calories: 2500,
    burn: 400,
    target: 1000,
    icon: DumbbellIcon as React.ElementType
  },
  {
    value: 'maintain',
    label: 'Maintain Weight',
    description:
      'Maintain your weight by burning and intake the same amount of calories.',
    calories: 1000,
    burn: 1000,
    target: 1000,
    icon: Weight as React.ElementType
  },
  {
    value: 'gain',
    label: 'Gain Muscle',
    description: 'Gain muscle by burning more calories than you intake.',
    calories: 1500,
    burn: 500,
    target: 1000,
    icon: DumbbellIcon as React.ElementType
  }
];

const Steps = () => {
  const [step, setStep] = useState<Step>(1);

  const totalSteps = 3;

  const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height: 0,
    goal: '',
    dailyCalorieIntake: 0,
    dailyCalorieBurn: 0
  });

  const { user, setOnboardingCompleted, fetchUser } = useAppContext();

  const updateField = (
    field: keyof ProfileFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (step === 1) {
      const result = ageStepSchema.safeParse({ age: formData.age });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
    }

    if (step === 2) {
      const result = bodyStepSchema.safeParse({
        weight: formData.weight,
        height: formData.height > 0 ? formData.height : undefined
      });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
    }

    if (step < totalSteps) {
      setStep((prev) => (prev + 1) as Step);
    } else {
      const goalResult = goalStepSchema.safeParse({
        goal: formData.goal,
        dailyCalorieIntake: formData.dailyCalorieIntake,
        dailyCalorieBurn: formData.dailyCalorieBurn
      });
      if (!goalResult.success) {
        toast.error(goalResult.error.issues[0].message);
        return;
      }
      const userData = {
        ...formData,
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        createdAt: new Date().toISOString()
      } as UserData;

      localStorage.setItem('fitnessUser', JSON.stringify(userData));

      try {
        await api.put(`/api/users/${user?.id}`, userData as UserData, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        toast.success('User data updated successfully');
        setOnboardingCompleted(true);
        fetchUser(user?.token ?? '');
      } catch (error: unknown) {
        toast.error((error as Error).message);
      }
    }
  };

  const handlePrevious = () => {
    // if the step is 1, do not allow the user to go back
    // Math.max is used to ensure the step is not less than 1
    setStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleGoalClick = (option: GoalOption) => () => {
    updateField('goal', option.value);
    updateField('dailyCalorieIntake', option.calories);
    updateField('dailyCalorieBurn', option.burn);
  };

  return (
    <>
      <div className="px-6 mb-8 onboarding-wrapper">
        <div className="flex gap-2 max-w-2xl">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-lg transition-all duration-500 ease-out ${index + 1 <= step ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'}`}
            />
          ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Step {step} of {totalSteps}
        </p>
      </div>
      <div className="flex-1 px-6 onboarding-wrapper">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center border border-emerald-500/20 dark:border-emerald-400/20">
                <UserIcon
                  size={24}
                  className="text-slate-500 dark:text-slate-400 size-6"
                />
              </div>
              <div className="">
                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                  How old are you?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  We need to know your age to calculate your daily calorie
                  intake and burn.
                </p>
              </div>
            </div>
            <Input
              label="Age"
              value={formData.age}
              onChange={(value) => updateField('age', Number(value))}
              placeholder="Enter your age"
              className="max-w-2xl "
              type="number"
              required
              min={1}
              max={100}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 onboarding-wrapper">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center border border-emerald-500/20 dark:border-emerald-400/20">
                <Weight
                  size={24}
                  className="text-slate-500 dark:text-slate-400 size-6"
                />
              </div>
              <div className="">
                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                  How much do you weigh?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  We need to know your weight to calculate your daily calorie
                  intake and burn.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 max-w-2xl">
              {/* Weight Input */}
              <Input
                label="Weight (kg)"
                value={formData.weight}
                onChange={(value) => updateField('weight', Number(value))}
                placeholder="Enter your weight"
                className="max-w-2xl "
                type="number"
                required
                min={5}
                max={500}
              />

              {/* Height Input */}
              <Input
                label="Height (cm) - Optionals"
                value={formData.height}
                onChange={(value) => updateField('height', value)}
                placeholder="Enter your height"
                className="max-w-2xl "
                min={100}
                max={220}
              />
            </div>
          </div>
        )}

        {/* Step 3 - What is your goal? Loose Weight, Maintain Weight, Gain Muscle. Daily Targets */}
        {step === 3 && (
          <div className="space-y-6 onboarding-wrapper">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center border border-emerald-500/20 dark:border-emerald-400/20">
                <TargetIcon
                  size={24}
                  className="text-slate-500 dark:text-slate-400 size-6"
                />
              </div>
              <div className="">
                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                  What is your goal?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  We need to know your goal to calculate your daily calorie
                  intake and burn.
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="w-full flex flex-col gap-4">
              {goalOptions.map((option) => (
                <div
                  key={option.value as string}
                  className={`onboarding-option-btn items-center border border-slate-200 dark:border-slate-700 ${formData.goal === option.value ? 'ring-2 ring-emerald-500 dark:ring-emerald-400 flex space-x-4' : 'flex space-x-4'}`}
                  onClick={handleGoalClick(option)}>
                  <option.icon
                    size={16}
                    className="text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="text-slate-700 dark:text-slate-200">
                    {option.label}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    {option.description}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

            {/* Daily Targets */}
            <div className="space-y-8 max-w-lg">
              <h3 className="text-md font-bold text-slate-700 dark:text-slate-200">
                <TargetIcon
                  size={24}
                  className="text-emerald-500 dark:text-emerald-400"
                />
                <span className="text-slate-700 dark:text-slate-200">
                  Daily Targets
                </span>
              </h3>

              <div className="space-y-6">
                {/* Daily Calorie Intake */}
                {/* min 120, max 10000  , step 100 */}
                <div className="flex items-center gap-4 justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 justify-center text-base cursor-help">
                    Daily Calorie Intake
                    <Tooltip content="The amount of calories you need to intake to maintain your weight">
                      <InfoIcon
                        size={16}
                        className="text-slate-500 dark:text-slate-400"
                      />
                    </Tooltip>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {formData.dailyCalorieIntake} kcal
                  </span>
                </div>
                <Slider
                  value={
                    Array.isArray(formData.dailyCalorieIntake)
                      ? formData.dailyCalorieIntake
                      : [formData.dailyCalorieIntake]
                  }
                  max={30000}
                  step={50}
                  className="w-full text-green-300 dark:text-green-400 bg-green-500/10 dark:bg-green-400/10"
                  onValueChange={(value) =>
                    updateField('dailyCalorieIntake', Number(value[0]))
                  }
                />
                <div className="flex items-center gap-4 justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 justify-center text-base cursor-help">
                    Daily Calorie Burn
                    <Tooltip content="The amount of calories you need to burn to maintain your weight">
                      <InfoIcon
                        size={16}
                        className="text-slate-500 dark:text-slate-400"
                      />
                    </Tooltip>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {formData.dailyCalorieBurn} kcal
                  </span>
                </div>

                {/* Daily Calorie Burn */}
                <Slider
                  value={
                    Array.isArray(formData.dailyCalorieBurn)
                      ? formData.dailyCalorieBurn
                      : [formData.dailyCalorieBurn]
                  }
                  max={30000}
                  step={50}
                  className="w-full"
                  onValueChange={(value) =>
                    updateField('dailyCalorieBurn', Number(value[0]))
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 onboarding-wrapper flex items-center gap-4 mt-4 lg:mt-8">
        {/* Next Button */}
        <div className="flex md:flex-row gap-3 ml-auto justify-end">
          <Button
            variant="primary"
            className="max-lg:flex-1"
            onClick={handleNext}>
            {step === totalSteps ? 'Get Started' : 'Continue'}
          </Button>

          {/* Previous Button */}
          <Button
            variant="primary"
            className="max-lg:flex-1"
            onClick={handlePrevious}>
            Previous
          </Button>
        </div>
      </div>
    </>
  );
};

export default Steps;
