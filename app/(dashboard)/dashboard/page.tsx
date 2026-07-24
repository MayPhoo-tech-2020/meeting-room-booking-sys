"use client";

import { Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import SummaryCard from '../../../components/SummaryCard';

export default function DashboardPage() {
  const [role, setRole] = useState('ADMIN');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(window.localStorage.getItem('selected-role') || 'ADMIN');
    }
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Overview
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryCard title="Current Role" value={role} description="Selected from the shared role selector" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryCard title="Total Users" value="0" description="Managed from the users screen" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryCard title="Total Bookings" value="0" description="Bookings created through the booking form" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryCard title="Available Rooms" value="0" description="Room availability is pending integration" />
          </Grid>
        </Grid>
      </Stack>
    </DashboardLayout>
  );
}
