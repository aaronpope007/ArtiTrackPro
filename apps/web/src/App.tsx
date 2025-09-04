import { AppBar, Box, Container, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Route, Routes, Link as RouterLink } from 'react-router-dom';

function Dashboard() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Dashboard</Typography>
      <Typography color="text.secondary">Welcome to ArtiTrackPro.</Typography>
    </Box>
  );
}

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography component={RouterLink} to="/" variant="h6" sx={{ color: 'inherit', textDecoration: 'none' }}>
            ArtiTrackPro
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3, flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Container>
    </Box>
  );
}


