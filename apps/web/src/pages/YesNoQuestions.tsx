import { Box, Typography, Card, CardContent } from '@mui/material';

export default function YesNoQuestions() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Yes/No Questions
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            This page will contain yes/no question exercises and practice activities.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
