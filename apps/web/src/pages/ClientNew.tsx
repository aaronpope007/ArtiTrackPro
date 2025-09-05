import { Box, Button, Paper, Stack, Switch, TextField, Typography, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createClient } from '../api/http';

export default function ClientNew() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [parentGuardian, setParentGuardian] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consentOnFile, setConsentOnFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await createClient(token, {
        firstName,
        lastName,
        dateOfBirth,
        parentGuardian,
        consentOnFile,
        contactInfo: { email: email || undefined, phone: phone || undefined },
        targetSounds: [],
        treatmentGoals: []
      });
      navigate('/clients');
    } catch (err: any) {
      setError(err.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>New Client</Typography>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 640 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="First name" value={firstName} onChange={e => setFirstName(e.target.value)} fullWidth required />
            <TextField label="Last name" value={lastName} onChange={e => setLastName(e.target.value)} fullWidth required />
          </Stack>
          <TextField label="Date of birth" type="date" InputLabelProps={{ shrink: true }} value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required />
          <TextField label="Parent/Guardian" value={parentGuardian} onChange={e => setParentGuardian(e.target.value)} required />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <TextField label="Phone" value={phone} onChange={e => setPhone(e.target.value)} fullWidth />
          </Stack>
          <FormControlLabel control={<Switch checked={consentOnFile} onChange={e => setConsentOnFile(e.target.checked)} />} label="Consent on file" />
          {error && <Typography color="error">{error}</Typography>}
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={loading}>Create</Button>
            <Button variant="text" onClick={() => navigate(-1)}>Cancel</Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}


