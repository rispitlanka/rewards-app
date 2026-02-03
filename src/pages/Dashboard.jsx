import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  People,
  Business,
  Article,
  TrendingUp,
  PersonAdd,
  BusinessCenter,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import adminService from '../services/adminService';
import MetricCard from '../components/common/MetricCard';
import UserGrowthChart from '../components/charts/UserGrowthChart';
import ContentGenerationChart from '../components/charts/ContentGenerationChart';
import CategoryDistributionChart from '../components/charts/CategoryDistributionChart';
import {
  MetricCardSkeleton,
  ChartSkeleton,
  ActivityItemSkeleton,
} from '../components/common/LoadingSkeleton';

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch dashboard stats with React Query
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await adminService.getDashboardStats();
      return response.data.statistics;
    },
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });

  // Calculate growth percentages (mock calculation - you can enhance this)
  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <PersonAdd color="primary" />;
      case 'business_registration':
        return <BusinessCenter color="primary" />;
      case 'content_submission':
        return <Article color="info" />;
      case 'milestone_achievement':
        return <CheckCircle color="success" />;
      default:
        return <Schedule color="action" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {/* Metric Cards Skeleton */}
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <MetricCardSkeleton />
            </Grid>
          ))}
          {/* Charts Skeleton */}
          <Grid item xs={12} md={6}>
            <ChartSkeleton />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartSkeleton />
          </Grid>
          {/* Category Distribution Skeleton */}
          <Grid item xs={12} md={6}>
            <ChartSkeleton />
          </Grid>
          {/* Activity Feed Skeleton */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3 }} />
                {[1, 2, 3, 4, 5].map((item) => (
                  <ActivityItemSkeleton key={item} />
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }

  // Error state
  if (isError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error Loading Dashboard</AlertTitle>
          {error?.response?.data?.message || error?.message || 'Failed to load dashboard statistics'}
        </Alert>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  const stats = dashboardData || {};
  const userStats = stats.userStatistics || {};
  const businessStats = stats.businessStatistics || {};
  const contentStats = stats.contentStatistics || {};
  const growthCharts = stats.growthCharts || {};
  const categoryDistribution = stats.categoryDistribution || {};
  const recentActivity = stats.recentActivity || [];

  // Calculate active users (last 7 days) - using new users this week as proxy
  const activeUsers = userStats.newUsersThisWeek || 0;

  // Calculate growth for metric cards (simplified - using week over week)
  const totalUsersGrowth = calculateGrowth(
    userStats.totalUsers || 0,
    (userStats.totalUsers || 0) - (userStats.newUsersThisWeek || 0)
  );
  const totalBusinessesGrowth = calculateGrowth(
    businessStats.totalBusinesses || 0,
    (businessStats.totalBusinesses || 0) - (businessStats.unverifiedBusinesses || 0) * 0.1
  );
  const totalContentGrowth = calculateGrowth(
    contentStats.totalContent || 0,
    (contentStats.totalContent || 0) - (contentStats.thisWeekContent || 0)
  );
  const activeUsersGrowth = calculateGrowth(
    activeUsers,
    activeUsers * 0.8
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Dashboard
      </Typography>

      {/* Action Required Section */}
      {businessStats.unverifiedBusinesses > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate('/businesses')}
            >
              View Businesses
            </Button>
          }
        >
          <AlertTitle>Action Required</AlertTitle>
          {businessStats.unverifiedBusinesses} unverified business{businessStats.unverifiedBusinesses !== 1 ? 'es' : ''} need{''}
          {businessStats.unverifiedBusinesses === 1 ? 's' : ''} verification
        </Alert>
      )}

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Users"
            value={userStats.totalUsers || 0}
            growth={totalUsersGrowth}
            icon={People}
            color="#1976d2"
            onClick={() => navigate('/creators')}
          />
          {userStats.totalUsers > 0 && (
            <Box mt={1} display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={`Creators: ${userStats.contentCreators || 0}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`Businesses: ${userStats.localBusinesses || 0}`}
                size="small"
                variant="outlined"
              />
            </Box>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Businesses"
            value={businessStats.totalBusinesses || 0}
            growth={totalBusinessesGrowth}
            icon={Business}
            color="#dc004e"
            onClick={() => navigate('/businesses')}
          />
          {businessStats.totalBusinesses > 0 && (
            <Box mt={1} display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={`Verified: ${businessStats.verifiedBusinesses || 0}`}
                size="small"
                color="success"
                variant="outlined"
              />
              <Chip
                label={`Unverified: ${businessStats.unverifiedBusinesses || 0}`}
                size="small"
                color="warning"
                variant="outlined"
              />
            </Box>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Content"
            value={contentStats.totalContent || 0}
            growth={totalContentGrowth}
            icon={Article}
            color="#2e7d32"
            onClick={() => navigate('/content')}
          />
          {contentStats.totalContent > 0 && (
            <Box mt={1} display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={`Today: ${contentStats.todayContent || 0}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`This Week: ${contentStats.thisWeekContent || 0}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`This Month: ${contentStats.thisMonthContent || 0}`}
                size="small"
                variant="outlined"
              />
            </Box>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Users (7 days)"
            value={activeUsers}
            growth={activeUsersGrowth}
            icon={TrendingUp}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <UserGrowthChart data={growthCharts.userGrowth || []} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ContentGenerationChart data={growthCharts.contentGrowth || []} />
        </Grid>
      </Grid>

      {/* Category Distribution and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CategoryDistributionChart
            data={categoryDistribution.businessesByCategory || []}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Recent Activity
              </Typography>
              {recentActivity.length > 0 ? (
                <List
                  sx={{
                    maxHeight: 400,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.3)',
                      },
                    },
                  }}
                >
                  {recentActivity.map((activity, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <ListItemIcon>{getActivityIcon(activity.type)}</ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={
                          activity.timestamp
                            ? formatDistanceToNow(new Date(activity.timestamp), {
                                addSuffix: true,
                              })
                            : 'Unknown time'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
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
                    No recent activity
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
