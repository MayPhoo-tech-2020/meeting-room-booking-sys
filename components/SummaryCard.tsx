"use client";

import { Card, CardContent, Typography, Box } from '@mui/material';
import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  color?: string;
}

export default function SummaryCard({ 
  title, 
  value, 
  description, 
  icon,
  color = '#1976D2' 
}: SummaryCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #E8EDF2',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(25, 118, 210, 0.12)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: '#5A6C7D',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.75rem'
            }}
          >
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: `${color}15`,
                color: color
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#2C3E50',
            fontSize: '2rem',
            mb: description ? 0.5 : 0
          }}
        >
          {value}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            sx={{
              color: '#5A6C7D',
              fontSize: '0.875rem',
              mt: 0.5
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}