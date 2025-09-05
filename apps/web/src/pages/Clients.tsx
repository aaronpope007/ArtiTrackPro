import { useQuery } from '@tanstack/react-query';
import { getClients } from '../api/http';
import { useAuth } from '../context/AuthContext';
import { Avatar, Box, Button, CircularProgress, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';

export default function Clients() {
  const { token } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClients(token!) ,
    enabled: !!token
  });

  if (isLoading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
  if (error) return <Typography color="error">Failed to load clients</Typography>;

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>Clients</Typography>
        <Button variant="contained" component={RouterLink} to="/clients/new">Add Client</Button>
      </Stack>
      <List>
        {data?.map(c => (
          <ListItem key={c.id}
            secondaryAction={
              <IconButton edge="end" component={RouterLink} to={`/clients/${c.id}`} aria-label="open">
                <ArrowForwardIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar><PersonIcon /></Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${c.firstName} ${c.lastName}`} secondary={c.parentGuardian} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}


