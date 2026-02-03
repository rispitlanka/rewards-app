import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';

const ContentGenerationChart = ({ data = [] }) => {
  const theme = useTheme();

  // Format data for chart
  const chartData = data.map((item) => ({
    date: item.date,
    Accepted: item.accepted || 0,
    Rejected: item.rejected || 0,
    Pending: item.pending || 0,
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
          Content Generation (Last 30 Days)
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
              <Bar
                dataKey="Accepted"
                stackId="a"
                fill={theme.palette.success.main}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Rejected"
                stackId="a"
                fill={theme.palette.error.main}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Pending"
                stackId="a"
                fill={theme.palette.warning.main}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContentGenerationChart;
