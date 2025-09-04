import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth';

export const router = Router();

const contactInfoSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

const goalSchema = z.object({
  id: z.string().optional(),
  description: z.string(),
  targetAccuracy: z.number().min(0).max(100),
  consecutiveSessions: z.number().min(1).max(10)
});

const targetSoundSchema = z.object({
  phoneme: z.string(),
  wordPosition: z.enum(['initial', 'medial', 'final']),
  wordList: z.array(z.string()),
  baselineAccuracy: z.number().min(0).max(100),
  targetAccuracy: z.number().min(0).max(100),
  currentAccuracy: z.number().min(0).max(100).default(0)
});

const clientSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  parentGuardian: z.string(),
  contactInfo: contactInfoSchema,
  targetSounds: z.array(targetSoundSchema),
  treatmentGoals: z.array(goalSchema),
  consentOnFile: z.boolean().default(false)
});

type Client = z.infer<typeof clientSchema> & { id: string; createdDate: string; lastModified: string };

const clients = new Map<string, Client>();

router.use(requireAuth);

router.get('/', requireRole(['admin', 'slp', 'staff']), (_req, res) => {
  res.json(Array.from(clients.values()));
});

router.post('/', requireRole(['admin', 'slp']), (req, res) => {
  const parsed = clientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid client data' });
  }
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const client: Client = { id, createdDate: now, lastModified: now, ...parsed.data };
  clients.set(id, client);
  res.status(201).json(client);
});

router.get('/:id', requireRole(['admin', 'slp', 'staff']), (req, res) => {
  const client = clients.get(req.params.id);
  if (!client) return res.status(404).json({ error: 'Not found' });
  res.json(client);
});

router.put('/:id', requireRole(['admin', 'slp']), (req, res) => {
  const existing = clients.get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const parsed = clientSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid client data' });
  const updated: Client = {
    ...existing,
    ...parsed.data,
    lastModified: new Date().toISOString()
  };
  clients.set(existing.id, updated);
  res.json(updated);
});

router.delete('/:id', requireRole(['admin']), (req, res) => {
  clients.delete(req.params.id);
  res.status(204).send();
});


