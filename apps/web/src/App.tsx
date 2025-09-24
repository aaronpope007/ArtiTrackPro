import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Route, Routes, Link as RouterLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Session from './pages/Session';
import ClientNew from './pages/ClientNew';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Articulation from './pages/Articulation';
import YesNoQuestions from './pages/YesNoQuestions';
import WhoQuestions from './pages/WhoQuestions';

function AppShell() {
  const { token, logout } = useAuth();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography component={RouterLink} to="/" variant="h6" sx={{ color: 'inherit', textDecoration: 'none', flex: 1 }}>
            ArtiTrackPro
          </Typography>
          {token && (
            <Button color="inherit" component={RouterLink} to="/reports" sx={{ mr: 1 }}>Reports</Button>
          )}
          {token ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3, flex: 1 }}>
        <Routes>
          <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/clients" element={token ? <Clients /> : <Navigate to="/login" replace />} />
          <Route path="/clients/new" element={token ? <ClientNew /> : <Navigate to="/login" replace />} />
          <Route path="/clients/:id" element={token ? <ClientDetail /> : <Navigate to="/login" replace />} />
          <Route path="/session/:clientId" element={token ? <Session /> : <Navigate to="/login" replace />} />
          <Route path="/reports" element={token ? <Reports /> : <Navigate to="/login" replace />} />
          <Route path="/articulation" element={token ? <Articulation /> : <Navigate to="/login" replace />} />
          <Route path="/yes-no-questions" element={token ? <YesNoQuestions /> : <Navigate to="/login" replace />} />
          <Route path="/who-questions" element={token ? <WhoQuestions /> : <Navigate to="/login" replace />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}


