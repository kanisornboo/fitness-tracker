import { isValidEmailFormat } from '@/lib/utils';
import {
  AtSignIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon
} from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useAppContext } from '../context/app-context';

export const Login = () => {
  const [state, setState] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { signup, login, user } = useAppContext();

  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const formDescId = useId();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (state === 'login') {
      if (!isValidEmailFormat(email)) {
        toast.error('Invalid email format');
        setIsSubmitting(false);
        return;
      }
      await login({ email, password });
    } else {
      await signup({ username, email, password });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="login-page-container">
        <form
          className="login-form"
          onSubmit={handleSubmit}
          aria-labelledby="form-heading"
          aria-describedby={formDescId}>
          <h2 id="form-heading" className="text-2xl font-bold text-slate-700 dark:text-white">
            {state === 'login' ? 'Sign in to your account' : 'Create an account'}
          </h2>
          <p id={formDescId} className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {state === 'login'
              ? 'Please enter your email and password to sign in'
              : 'Please enter a username, email and password to create an account'}
          </p>

          {/* Username */}
          {state !== 'login' && (
            <div className="mt-4">
              <label htmlFor={usernameId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Username
              </label>
              <div className="relative mt-2">
                <AtSignIcon aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4.5 text-slate-400" />
                <input
                  id={usernameId}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mt-4">
            <label htmlFor={emailId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <div className="relative mt-2">
              <MailIcon aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4.5 text-slate-400" />
              <input
                id={emailId}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-4">
            <label htmlFor={passwordId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative mt-2">
              <LockIcon aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4.5 text-slate-400" />
              <input
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="Enter your password"
                autoComplete={state === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <Button
                variant="secondary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 outline-none bg-none hover:bg-none active:scale-95"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword
                  ? <EyeIcon size={16} aria-hidden="true" className="text-slate-400" />
                  : <EyeOffIcon size={16} aria-hidden="true" className="text-slate-400" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
            aria-busy={isSubmitting}>
            {isSubmitting
              ? (state === 'login' ? 'Signing in…' : 'Creating account…')
              : (state === 'login' ? 'Sign in' : 'Create account')}
          </Button>

          {state === 'login' && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?
              </p>
              <button
                type="button"
                className="bg-transparent text-sm hover:bg-transparent active:scale-95 p-0 m-0 hover:underline focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                onClick={() => setState('signup')}>
                Sign up
              </button>
            </div>
          )}
          {state === 'signup' && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Already have an account?
              </p>
              <button
                type="button"
                className="bg-transparent text-sm hover:bg-transparent active:scale-95 p-0 m-0 hover:underline focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                onClick={() => setState('login')}>
                Sign in
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};
