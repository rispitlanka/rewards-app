import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Clear,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import adminService from '../services/adminService';
import CategoryDialog from '../components/categories/CategoryDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';

const Categories = () => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories
  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await adminService.getAllCategories();
      return response.data.categories || [];
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => adminService.createCategory(data),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Category created successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to create category';
      toast.error(message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminService.updateCategory(id, data),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update category';
      toast.error(message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteCategory(id),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete category';
      toast.error(message);
      
      // If error is about businesses using the category, keep dialog open
      if (error.response?.status !== 400) {
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
    },
  });

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categoriesData) return [];
    if (!searchText.trim()) return categoriesData;

    const searchLower = searchText.toLowerCase();
    return categoriesData.filter(
      (category) =>
        category.name?.toLowerCase().includes(searchLower) ||
        category.description?.toLowerCase().includes(searchLower)
    );
  }, [categoriesData, searchText]);

  // Handle add category
  const handleAdd = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  // Handle edit category
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  // Handle delete category
  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  // Handle save (create or update)
  const handleSave = (data) => {
    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete._id);
    }
  };

  // DataGrid columns
  const columns = [
    {
      field: 'icon',
      headerName: 'Icon',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const iconUrl = params.row.icon;
        return iconUrl ? (
          <Box
            component="img"
            src={iconUrl}
            alt={params.row.name}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            sx={{
              width: 40,
              height: 40,
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />
        ) : (
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.200',
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              No Icon
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'businessCount',
      headerName: '# Businesses',
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 180,
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
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEdit(params.row)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Get delete error message
  const deleteErrorMessage = categoryToDelete
    ? deleteMutation.error?.response?.data?.message
    : null;
  const deleteBusinessCount =
    categoryToDelete && deleteMutation.error?.response?.status === 400
      ? deleteMutation.error?.response?.data?.businessCount
      : categoryToDelete?.businessCount || 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Business Categories
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Category
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search categories by name or description..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchText('')}
                  edge="end"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
        />
      </Paper>

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
              'Failed to load categories'}
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredCategories.map((cat, index) => ({
              id: cat._id || index,
              ...cat,
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

      {/* Add/Edit Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSave}
        category={selectedCategory}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
          deleteMutation.reset();
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        requireTextMatch={true}
        textToMatch={categoryToDelete?.name || ''}
        showBusinessCount={true}
        businessCount={deleteBusinessCount}
        errorMessage={
          deleteErrorMessage && deleteBusinessCount > 0
            ? 'Cannot delete category with associated businesses'
            : deleteErrorMessage || null
        }
      />
    </Container>
  );
};

export default Categories;
