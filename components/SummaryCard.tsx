"use client";

import { Card, CardContent, Typography } from '@mui/material';

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export default function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5">{value}</Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}
