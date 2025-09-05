import { useParams } from 'react-router-dom';
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Typography, FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createSession } from '../api/http';
import type { TargetSoundPerformance } from '@artitrack/shared';

export default function Session() {
  const { clientId } = useParams();
  const { token } = useAuth();
  const [data, setData] = useState<TargetSoundPerformance[]>([]);
  const [notes, setNotes] = useState('');
  const [cuingLevel, setCuingLevel] = useState<'independent' | 'verbal' | 'visual' | 'tactile'>('independent');
  const [stimulability, setStimulability] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  function addTrial(correct: boolean) {
    const key = `${clientId}-/s/-initial`;
    const existing = data[0];
    if (!existing) {
      setData([{ phoneme: '/s/', wordPosition: 'initial', correct: correct ? 1 : 0, incorrect: correct ? 0 : 1 }]);
    } else {
      const updated = { ...existing };
      if (correct) updated.correct += 1; else updated.incorrect += 1;
      setData([updated]);
    }
  }

  async function save() {
    if (!token || !clientId) return;
    await createSession(token, {
      clientId,
      sessionDate: new Date().toISOString(),
      duration: 30,
      targetSoundData: data.map(d => ({ ...d, stimulability, cuingLevel })),
      clinicalNotes: notes,
      cuingLevel
    });
    alert('Session saved');
  }

  const total = data[0] ? data[0].correct + data[0].incorrect : 0;
  const pct = total ? Math.round((data[0].correct / total) * 100) : 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Session</Typography>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Button variant="contained" color="success" sx={{ py: 3 }} onClick={() => addTrial(true)}>Correct</Button>
          <Button variant="contained" color="error" sx={{ py: 3 }} onClick={() => addTrial(false)}>Incorrect</Button>
          <Typography>Trials: {total} • Accuracy: {pct}%</Typography>
          <FormControl sx={{ minWidth: 160 }} size="small">
            <InputLabel id="cuing-label">Cuing</InputLabel>
            <Select labelId="cuing-label" label="Cuing" value={cuingLevel} onChange={e => setCuingLevel(e.target.value as any)}>
              <MenuItem value="independent">Independent</MenuItem>
              <MenuItem value="verbal">Verbal</MenuItem>
              <MenuItem value="visual">Visual</MenuItem>
              <MenuItem value="tactile">Tactile</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel control={<Switch checked={stimulability} onChange={e => setStimulability(e.target.checked)} />} label="Stimulable" />
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Timer: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</Typography>
            {!running ? (
              <Button size="small" variant="outlined" onClick={() => setRunning(true)}>Start</Button>
            ) : (
              <Button size="small" variant="outlined" onClick={() => setRunning(false)}>Pause</Button>
            )}
            <Button size="small" variant="text" onClick={() => { setSeconds(0); setRunning(false); }}>Reset</Button>
          </Stack>
          <Button variant="outlined" onClick={save} disabled={!data.length}>Save</Button>
        </Stack>
        <TextField value={notes} onChange={e => setNotes(e.target.value)} label="Notes" fullWidth multiline rows={3} sx={{ mt: 2 }} />
      </Paper>
    </Box>
  );
}


