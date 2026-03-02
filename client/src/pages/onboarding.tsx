import {
  CheckIcon,
  DumbbellIcon,
  PersonStanding,
  TargetIcon,
  UserIcon,
  Weight,
  XIcon
} from 'lucide-react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import mockApi from '../assets/mockApi';
import type { ProfileFormData, User, UserData } from '../assets/types';
import Button from '../assets/ui/Button';
import Steps from '../components/steps';
import Input from '../components/ui/Input';
import { useAppContext } from '../context/app-context';

type Step = 1 | 2 | 3;

type GoalOption = {
  value: 'lose' | 'maintain' | 'gain';
  label: string;
  icon: React.ElementType;
};

const goalOptions: GoalOption[] = [
  {
    value: 'lose',
    label: 'Lose Weight',
    icon: DumbbellIcon as React.ElementType
  },
  {
    value: 'maintain',
    label: 'Maintain Weight',
    icon: Weight as React.ElementType
  },
  {
    value: 'gain',
    label: 'Gain Muscle',
    icon: DumbbellIcon as React.ElementType
  }
];

export const Onboarding = () => {
  // const [step, setStep] = useState<Step>(3);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // const totalSteps = 3;

  // const [formData, setFormData] = useState<ProfileFormData>({
  //     age: 0,
  //     weight: 0,
  //     height: 0,
  //     goal: 'maintain',
  //     dailyCalorieIntake: 2500,
  //     dailyCalorieBurn: 400
  // });

  // const { user, setOnboardingCompleted, fetchUser } = useAppContext();

  return (
    <>
      <Toaster position="top-right" />
      <div className="onboarding-container">
        <div className="onboarding-wrapper">
          {/* Header */}
          <div className="p-6 pt-12 onboarding-wrapper">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10">
                <PersonStanding
                  size={24}
                  className=" text-emerald-500 dark:text-emerald-400"
                />
              </div>
              <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-200 dark:text-slate-200">
                Welcome to the Onboarding
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Please complete the following steps to get started.
            </p>
          </div>

          {/* Progress Bar */}

          {/*  Form content */}
          <Steps />
        </div>
      </div>
    </>
  );
};
