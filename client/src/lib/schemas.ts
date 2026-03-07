import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email format' }),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.email({ message: 'Invalid email format' }),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const ageStepSchema = z.object({
  age: z
    .number({ message: 'Age is required' })
    .min(15, 'Age must be between 15 and 100')
    .max(100, 'Age must be between 15 and 100')
});

export const bodyStepSchema = z.object({
  weight: z
    .number({ message: 'Weight is required' })
    .min(5, 'Weight must be between 5 and 500 kg')
    .max(500, 'Weight must be between 5 and 500 kg'),
  height: z
    .number()
    .min(100, 'Height must be between 100 and 220 cm')
    .max(220, 'Height must be between 100 and 220 cm')
    .optional()
});

export const goalStepSchema = z.object({
  goal: z.enum(['lose', 'maintain', 'gain'], {
    message: 'Please select a goal'
  }),
  dailyCalorieIntake: z.number().min(0).max(30000),
  dailyCalorieBurn: z.number().min(0).max(30000)
});

export const foodLogSchema = z.object({
  name: z
    .string()
    .min(1, 'Food name is required')
    .refine((v) => v.trim().length > 0, 'Food name cannot be empty'),
  calories: z
    .number({ message: 'Calories is required' })
    .min(1, 'Calories must be at least 1')
    .max(10000, 'Calories must be at most 10,000'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack'], {
    message: 'Please select a meal type'
  })
});

export const activityLogSchema = z.object({
  name: z
    .string()
    .min(1, 'Activity name is required')
    .refine((v) => v.trim().length > 0, 'Activity name cannot be empty'),
  duration: z
    .number({ message: 'Duration is required' })
    .min(1, 'Duration must be at least 1 minute')
    .max(300, 'Duration must be at most 300 minutes'),
  calories: z.number().min(0).max(3000)
});

export const profileFormSchema = z.object({
  age: z
    .number()
    .min(15, 'Age must be between 15 and 100')
    .max(100, 'Age must be between 15 and 100'),
  weight: z
    .number()
    .min(5, 'Weight must be between 5 and 500 kg')
    .max(500, 'Weight must be between 5 and 500 kg'),
  height: z
    .number()
    .min(100, 'Height must be between 100 and 220 cm')
    .max(220, 'Height must be between 100 and 220 cm')
    .optional(),
  goal: z.enum(['lose', 'maintain', 'gain']),
  dailyCalorieBurn: z.number().min(0).max(30000),
  dailyCalorieIntake: z.number().min(0).max(30000)
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type FoodLogInput = z.infer<typeof foodLogSchema>;
export type ActivityLogInput = z.infer<typeof activityLogSchema>;
export type ProfileFormInput = z.infer<typeof profileFormSchema>;
