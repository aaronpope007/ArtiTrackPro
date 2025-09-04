import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { ClientSchema, type Client as SharedClient, type ClientInput } from '@artitrack/shared';
import { requireAuth, requireRole } from '../middleware/auth';

export const router = Router();

type Client = SharedClient;

const clients = new Map<string, Client>();

router.use(requireAuth);

router.get('/', requireRole(['admin', 'slp', 'staff']), (_req, res) => {
  res.json(Array.from(clients.values()));
});

router.post('/', requireRole(['admin', 'slp']), (req, res) => {
  const parsed = ClientSchema.safeParse(req.body as ClientInput);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid client data' });
  }
  const id = randomUUID();
  const now = new Date().toISOString();
  const client: Client = { id, createdDate: now, lastModified: now, ...parsed.data } as Client;
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
  const parsed = ClientSchema.safeParse(req.body as ClientInput);
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


