import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Grid, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getAllSessions } from '../api/http';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { token } = useAuth();
  const { data } = useQuery({
    queryKey: ['sessions-all'],
    queryFn: () => getAllSessions(token!),
    enabled: !!token
  });
  const totalSessions = data?.length || 0;
  const avgAccuracy = data && data.length
    ? Math.round(data.reduce((a, s) => a + s.overallAccuracy, 0) / data.length)
    : 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Dashboard</Typography>
      
      {/* Navigation Buttons */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Practice Activities</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              component={RouterLink}
              to="/articulation"
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 2 }}
            >
              Articulation
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              component={RouterLink}
              to="/yes-no-questions"
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 2 }}
            >
              Yes/No Questions
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              component={RouterLink}
              to="/who-questions"
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 2 }}
            >
              Who Questions
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Statistics Cards */}
      <Typography variant="h6" gutterBottom>Statistics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary" gutterBottom>Total Sessions</Typography>
            <Typography variant="h4">{totalSessions}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary" gutterBottom>Avg Accuracy</Typography>
            <Typography variant="h4">{avgAccuracy}%</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Box>
  );
}


