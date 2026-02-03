import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';

const UserGrowthChart = ({ data = [] }) => {
  const theme = useTheme();

  // Format data for chart
  const chartData = data.map((item) => ({
    date: item.date,
    'Content Creators': item.contentCreators || 0,
    'Local Businesses': item.localBusinesses || 0,
  }));

  // Format date for display
  const formatDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), 'MMM dd');
    } catch {
      return dateStr;
    }
  };

  return (
    <Card sx={{ height: '100%', boxShadow: theme.shadows[2] }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          User Growth (Last 30 Days)
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke={theme.palette.text.secondary}
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '8px',
                }}
                labelFormatter={(label) => formatDate(label)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Content Creators"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Local Businesses"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserGrowthChart;
