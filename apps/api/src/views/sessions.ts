import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { TherapySessionSchema, type TherapySessionInput } from '@artitrack/shared';
import { requireAuth, requireRole } from '../middleware/auth';

export const router = Router();

type TherapySession = z.infer<typeof TherapySessionSchema> & { id: string; overallAccuracy: number };

const sessions = new Map<string, TherapySession>();

router.use(requireAuth);

router.get('/', requireRole(['admin', 'slp', 'staff']), (_req, res) => {
  res.json(Array.from(sessions.values()));
});

router.post('/', requireRole(['admin', 'slp']), (req, res) => {
  const parsed = TherapySessionSchema.safeParse(req.body as TherapySessionInput);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid session data' });

  const totals = parsed.data.targetSoundData.reduce(
    (acc, cur) => {
      acc.correct += cur.correct;
      acc.incorrect += cur.incorrect;
      return acc;
    },
    { correct: 0, incorrect: 0 }
  );
  const overallAccuracy = totals.correct + totals.incorrect > 0
    ? Math.round((totals.correct / (totals.correct + totals.incorrect)) * 100)
    : 0;

  const id = randomUUID();
  const session: TherapySession = { id, overallAccuracy, ...parsed.data };
  sessions.set(id, session);
  res.status(201).json(session);
});

router.get('/by-client/:clientId', requireRole(['admin', 'slp', 'staff']), (req, res) => {
  const list = Array.from(sessions.values()).filter(s => s.clientId === req.params.clientId);
  res.json(list);
});


