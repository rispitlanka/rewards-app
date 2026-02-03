import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const CategoryDistributionChart = ({ data = [] }) => {
  const theme = useTheme();

  // Generate colors for categories
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    '#9c27b0',
    '#ff5722',
    '#00bcd4',
    '#795548',
  ];

  // Format data for chart
  const chartData = data.map((item) => ({
    name: item.categoryName || 'Unknown',
    value: item.count || 0,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            p: 1.5,
            boxShadow: theme.shadows[4],
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {payload[0].name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Businesses: {payload[0].value}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: '100%', boxShadow: theme.shadows[2] }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Businesses by Category
        </Typography>
        {chartData.length > 0 ? (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 300,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No category data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryDistributionChart;
