import { Card, CardContent, Typography } from '@mui/material';

export type MotivationalQuoteProps = {
  quote: string;
};

export function MotivationalQuote({ quote }: MotivationalQuoteProps) {
  return (
    <Card sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
      <CardContent>
        <Typography variant='h6' gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          Мотивация на сегодня
        </Typography>
        <Typography variant='body1' sx={{ fontStyle: 'italic' }}>
          "{quote}"
        </Typography>
      </CardContent>
    </Card>
  );
}
