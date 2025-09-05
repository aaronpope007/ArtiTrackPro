import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClientById, getSessionsByClient } from '../api/http';
import { useAuth } from '../context/AuthContext';
import { Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function ClientDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientById(token!, id!),
    enabled: !!token && !!id
  });
  const { data: sessions } = useQuery({
    queryKey: ['sessions', id],
    queryFn: () => getSessionsByClient(token!, id!),
    enabled: !!token && !!id
  });

  const navigate = useNavigate();
  if (isLoading || !data) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {data.firstName} {data.lastName}
      </Typography>
      <Typography color="text.secondary">Parent/Guardian: {data.parentGuardian}</Typography>
      <Typography color="text.secondary" gutterBottom>DOB: {new Date(data.dateOfBirth).toLocaleDateString()}</Typography>

      <Typography variant="h6" sx={{ mt: 3 }}>Target Sounds</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {data.targetSounds.map((ts, i) => (
          <Chip key={i} label={`${ts.phoneme} (${ts.wordPosition}) • ${ts.currentAccuracy}%`} />
        ))}
      </Stack>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(`/session/${data.id}`)}>Start Session</Button>

      <Typography variant="h6" sx={{ mt: 3 }}>Progress Over Time</Typography>
      <Box sx={{ height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={(sessions || []).map(s => ({
            date: new Date(s.sessionDate).toLocaleDateString(),
            accuracy: s.overallAccuracy
          }))}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Line type="monotone" dataKey="accuracy" stroke="#1976d2" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}


