import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';

export const MetricCardSkeleton = () => (
  <Card sx={{ height: '100%', boxShadow: 2 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
      </Box>
      <Skeleton variant="text" width="60%" height={40} />
      <Skeleton variant="text" width="40%" height={24} />
    </CardContent>
  </Card>
);

export const ChartSkeleton = () => (
  <Card sx={{ height: '100%', boxShadow: 2 }}>
    <CardContent>
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 1 }} />
    </CardContent>
  </Card>
);

export const ActivityItemSkeleton = () => (
  <Box display="flex" alignItems="center" gap={2} py={1.5}>
    <Skeleton variant="circular" width={40} height={40} />
    <Box flex={1}>
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="40%" height={16} sx={{ mt: 0.5 }} />
    </Box>
  </Box>
);
