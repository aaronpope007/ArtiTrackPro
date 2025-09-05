import { useQuery } from '@tanstack/react-query';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllSessions } from '../api/http';

export default function Reports() {
  const { token } = useAuth();
  const { data } = useQuery({
    queryKey: ['sessions-all'],
    queryFn: () => getAllSessions(token!),
    enabled: !!token
  });

  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(s => {
      const d = new Date(s.sessionDate).toISOString().slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [data, from, to]);

  function exportCsv() {
    const rows = [
      ['id', 'clientId', 'sessionDate', 'overallAccuracy'],
      ...filtered.map(s => [s.id, s.clientId, s.sessionDate, String(s.overallAccuracy)])
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sessions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const avg = filtered.length ? Math.round(filtered.reduce((a, s) => a + s.overallAccuracy, 0) / filtered.length) : 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Reports</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <TextField label="From" type="date" value={from} onChange={e => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="To" type="date" value={to} onChange={e => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
          <Button variant="outlined" onClick={exportCsv} disabled={!filtered.length}>Export CSV</Button>
          <Typography sx={{ ml: 'auto' }}>Average accuracy: {avg}%</Typography>
        </Stack>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={1}>
          {filtered.map(s => (
            <Typography key={s.id}>
              {new Date(s.sessionDate).toLocaleString()} • Client {s.clientId} • {s.overallAccuracy}%
            </Typography>
          ))}
          {!filtered.length && <Typography color="text.secondary">No sessions for selected range.</Typography>}
        </Stack>
      </Paper>
    </Box>
  );
}


