import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  CheckCircle,
  Block,
  Delete,
  Business,
  VerifiedUser,
  Warning,
  Cancel,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import adminService from '../services/adminService';
import BusinessFilters from '../components/businesses/BusinessFilters';
import BusinessDetailDialog from '../components/businesses/BusinessDetailDialog';
import VerifyDialog from '../components/businesses/VerifyDialog';
import SuspendDialog from '../components/businesses/SuspendDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import MetricCard from '../components/common/MetricCard';

const Businesses = () => {
  const queryClient = useQueryClient();
  
  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [isVerified, setIsVerified] = useState(null);
  const [status, setStatus] = useState(null);
  
  // Dialog states
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuBusiness, setMenuBusiness] = useState(null);

  // Fetch categories for filter
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await adminService.getAllCategories();
      return response.data.categories || [];
    },
  });

  // Fetch businesses with filters
  const {
    data: businessesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['businesses', search, category, isVerified, status],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (isVerified !== null) params.isVerified = isVerified;
      if (status) params.status = status;
      
      const response = await adminService.getAllBusinesses(params);
      return response.data;
    },
  });

  // Mutations
  const verifyMutation = useMutation({
    mutationFn: (id) => adminService.verifyBusiness(id),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Business verified successfully');
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to verify business'
      );
    },
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, reason }) => adminService.suspendBusiness(id, reason),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Business suspended successfully');
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to suspend business'
      );
    },
  });

  const unsuspendMutation = useMutation({
    mutationFn: (id) => adminService.unsuspendBusiness(id),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Business unsuspended successfully');
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to unsuspend business'
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteBusiness(id),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Business deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to delete business'
      );
    },
  });

  // Handlers
  const handleMenuOpen = (event, business) => {
    setAnchorEl(event.currentTarget);
    setMenuBusiness(business);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuBusiness(null);
  };

  const handleViewDetails = (business) => {
    setSelectedBusiness(business);
    setDetailDialogOpen(true);
    handleMenuClose();
  };

  const handleVerify = (business) => {
    setSelectedBusiness(business);
    setVerifyDialogOpen(true);
    handleMenuClose();
  };

  const handleSuspend = (business) => {
    setSelectedBusiness(business);
    setSuspendDialogOpen(true);
    handleMenuClose();
  };

  const handleUnsuspend = (business) => {
    unsuspendMutation.mutate(business._id);
    handleMenuClose();
  };

  const handleDelete = (business) => {
    setSelectedBusiness(business);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmVerify = () => {
    if (selectedBusiness) {
      verifyMutation.mutate(selectedBusiness._id);
      setVerifyDialogOpen(false);
      setSelectedBusiness(null);
    }
  };

  const handleConfirmSuspend = (reason) => {
    if (selectedBusiness) {
      suspendMutation.mutate({ id: selectedBusiness._id, reason });
      setSuspendDialogOpen(false);
      setSelectedBusiness(null);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedBusiness) {
      deleteMutation.mutate(selectedBusiness._id);
      setDeleteDialogOpen(false);
      setSelectedBusiness(null);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory(null);
    setIsVerified(null);
    setStatus(null);
  };

  // Stats from API response
  const filterCounts = businessesData?.filterCounts || {
    total: 0,
    verified: 0,
    unverified: 0,
    suspended: 0,
  };

  // DataGrid columns
  const columns = [
    {
      field: 'logo',
      headerName: 'Logo',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const logoUrl = params.row.logo;
        return logoUrl ? (
          <Box
            component="img"
            src={logoUrl}
            alt={params.row.businessName}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            sx={{
              width: 50,
              height: 50,
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
        ) : (
          <Box
            sx={{
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.200',
              borderRadius: 1,
            }}
          >
            <Business sx={{ color: 'grey.500' }} />
          </Box>
        );
      },
    },
    {
      field: 'businessName',
      headerName: 'Business Name',
      width: 200,
      flex: 1,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => params.row.category?.name || 'N/A',
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 200,
      renderCell: (params) => {
        const loc = params.row.location;
        return loc ? `${loc.city || ''}, ${loc.country || ''}`.trim() : 'N/A';
      },
    },
    {
      field: 'owner',
      headerName: 'Owner',
      width: 200,
      renderCell: (params) => {
        const user = params.row.userId;
        return user ? (
          <Box>
            <Typography variant="body2">{user.profile?.name || 'N/A'}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user.email || ''}
            </Typography>
          </Box>
        ) : (
          'N/A'
        );
      },
    },
    {
      field: 'isVerified',
      headerName: 'Verification',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Verified' : 'Unverified'}
          color={params.value ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Registration Date',
      width: 150,
      renderCell: (params) => {
        if (!params.value) return '-';
        try {
          return format(new Date(params.value), 'MMM dd, yyyy');
        } catch {
          return params.value;
        }
      },
    },
    {
      field: 'totalContent',
      headerName: 'Total Content',
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === 'active' ? 'Active' : 'Suspended'}
          color={params.value === 'active' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, params.row)}
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Business Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Businesses"
            value={filterCounts.total}
            icon={Business}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Verified"
            value={filterCounts.verified}
            icon={VerifiedUser}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Unverified"
            value={filterCounts.unverified}
            icon={Warning}
            color="#ed6c02"
          />
          {filterCounts.unverified > 0 && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              {filterCounts.unverified} business{filterCounts.unverified !== 1 ? 'es' : ''} need{''}
              {filterCounts.unverified === 1 ? 's' : ''} verification
            </Alert>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Suspended"
            value={filterCounts.suspended || 0}
            icon={Cancel}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <BusinessFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        isVerified={isVerified}
        onVerificationChange={setIsVerified}
        status={status}
        onStatusChange={setStatus}
        onClearFilters={handleClearFilters}
        categories={categoriesData || []}
      />

      {/* DataGrid */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">
            {error?.response?.data?.message ||
              error?.message ||
              'Failed to load businesses'}
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={(businessesData?.businesses || []).map((business, index) => ({
              id: business._id || index,
              ...business,
            }))}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'grey.100',
                fontWeight: 'bold',
              },
            }}
          />
        </Paper>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewDetails(menuBusiness)}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        {menuBusiness && !menuBusiness.isVerified && (
          <MenuItem onClick={() => handleVerify(menuBusiness)}>
            <ListItemIcon>
              <CheckCircle fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Verify</ListItemText>
          </MenuItem>
        )}
        {menuBusiness && menuBusiness.status === 'active' ? (
          <MenuItem onClick={() => handleSuspend(menuBusiness)}>
            <ListItemIcon>
              <Block fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Suspend</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleUnsuspend(menuBusiness)}>
            <ListItemIcon>
              <CheckCircle fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Unsuspend</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleDelete(menuBusiness)}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <BusinessDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedBusiness(null);
        }}
        business={selectedBusiness}
        onVerify={handleVerify}
        onSuspend={handleSuspend}
        onUnsuspend={handleUnsuspend}
        onDelete={handleDelete}
      />

      <VerifyDialog
        open={verifyDialogOpen}
        onClose={() => {
          setVerifyDialogOpen(false);
          setSelectedBusiness(null);
        }}
        onConfirm={handleConfirmVerify}
        business={selectedBusiness}
        isLoading={verifyMutation.isPending}
      />

      <SuspendDialog
        open={suspendDialogOpen}
        onClose={() => {
          setSuspendDialogOpen(false);
          setSelectedBusiness(null);
        }}
        onConfirm={handleConfirmSuspend}
        business={selectedBusiness}
        isLoading={suspendMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedBusiness(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Business"
        message={`Are you sure you want to delete "${selectedBusiness?.businessName}"? This action cannot be undone and will delete all associated content.`}
        confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        confirmColor="error"
        requireTextMatch={true}
        textToMatch={selectedBusiness?.businessName || ''}
        isLoading={deleteMutation.isPending}
      />
    </Container>
  );
};

export default Businesses;
