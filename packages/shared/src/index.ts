import { z } from 'zod';

export const ContactInfoSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});
export type ContactInfo = z.infer<typeof ContactInfoSchema>;

export const GoalSchema = z.object({
  id: z.string().optional(),
  description: z.string(),
  targetAccuracy: z.number().min(0).max(100),
  consecutiveSessions: z.number().min(1).max(10)
});
export type Goal = z.infer<typeof GoalSchema>;

export const TargetSoundSchema = z.object({
  phoneme: z.string(),
  wordPosition: z.enum(['initial', 'medial', 'final']),
  wordList: z.array(z.string()),
  baselineAccuracy: z.number().min(0).max(100),
  targetAccuracy: z.number().min(0).max(100),
  currentAccuracy: z.number().min(0).max(100).default(0)
});
export type TargetSound = z.infer<typeof TargetSoundSchema>;

export const ClientSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  parentGuardian: z.string(),
  contactInfo: ContactInfoSchema,
  targetSounds: z.array(TargetSoundSchema),
  treatmentGoals: z.array(GoalSchema),
  consentOnFile: z.boolean().default(false)
});
export type ClientInput = z.infer<typeof ClientSchema>;

export type Client = ClientInput & {
  id: string;
  createdDate: string;
  lastModified: string;
};

export const TargetSoundPerformanceSchema = z.object({
  phoneme: z.string(),
  wordPosition: z.enum(['initial', 'medial', 'final']),
  correct: z.number().min(0),
  incorrect: z.number().min(0),
  stimulability: z.boolean().optional(),
  cuingLevel: z.enum(['independent', 'verbal', 'visual', 'tactile']).optional()
});
export type TargetSoundPerformance = z.infer<typeof TargetSoundPerformanceSchema>;

export const TherapySessionSchema = z.object({
  clientId: z.string(),
  sessionDate: z.string(),
  duration: z.number().min(1),
  targetSoundData: z.array(TargetSoundPerformanceSchema),
  clinicalNotes: z.string().optional(),
  cuingLevel: z.enum(['independent', 'verbal', 'visual', 'tactile']).optional()
});
export type TherapySessionInput = z.infer<typeof TherapySessionSchema>;

export type TherapySession = TherapySessionInput & {
  id: string;
  overallAccuracy: number;
};


