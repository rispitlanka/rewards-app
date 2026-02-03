import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const MetricCard = ({ title, value, growth, icon: Icon, color = '#1976d2', onClick }) => {
  const theme = useTheme();
  const isPositive = growth >= 0;

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        } : {},
        boxShadow: theme.shadows[2],
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color, fontSize: 28 }} />
          </Box>
          {growth !== undefined && growth !== null && (
            <Box
              display="flex"
              alignItems="center"
              sx={{
                color: isPositive ? theme.palette.success.main : theme.palette.error.main,
                backgroundColor: isPositive
                  ? `${theme.palette.success.main}15`
                  : `${theme.palette.error.main}15`,
                borderRadius: 1,
                px: 1,
                py: 0.5,
              }}
            >
              {isPositive ? (
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
              )}
              <Typography variant="caption" fontWeight="bold">
                {Math.abs(growth)}%
              </Typography>
            </Box>
          )}
        </Box>
        <Typography variant="h4" fontWeight="bold" color="text.primary" mb={0.5}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
