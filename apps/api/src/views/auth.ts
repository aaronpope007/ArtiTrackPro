import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const user = {
    id: 'demo-user-id',
    role: 'slp',
    email: parsed.data.email
  } as const;
  const token = jwt.sign(user, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '12h' });
  res.json({ token, user });
});


