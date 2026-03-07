import { DumbbellIcon, PersonStanding, Weight } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Steps from '../components/steps';

type Step = 1 | 2 | 3;

type GoalOption = {
  value: 'lose' | 'maintain' | 'gain';
  label: string;
  icon: React.ElementType;
};

export const Onboarding = () => {
  return (
    <>
      <Toaster position="top-right" />
      <div className="onboarding-container">
        <div className="onboarding-wrapper">
          <div className="p-6 pt-12 onboarding-wrapper">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10">
                <PersonStanding
                  size={24}
                  className=" text-emerald-500 dark:text-emerald-400"
                />
              </div>
              <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                Welcome to the Onboarding
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Please complete the following steps to get started.
            </p>
          </div>

          <Steps />
        </div>
      </div>
    </>
  );
};
