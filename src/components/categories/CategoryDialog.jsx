import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Close, Image as ImageIcon } from '@mui/icons-material';

const CategoryDialog = ({ open, onClose, onSave, category = null, isLoading = false }) => {
  const [iconPreview, setIconPreview] = useState('');
  const isEditMode = !!category;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      icon: '',
    },
  });

  const iconUrl = watch('icon');

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: category.name || '',
          description: category.description || '',
          icon: category.icon || '',
        });
        setIconPreview(category.icon || '');
      } else {
        reset({
          name: '',
          description: '',
          icon: '',
        });
        setIconPreview('');
      }
    } else {
      reset();
      setIconPreview('');
    }
  }, [open, category, reset]);

  // Update preview when icon URL changes
  useEffect(() => {
    if (iconUrl) {
      setIconPreview(iconUrl);
    } else {
      setIconPreview('');
    }
  }, [iconUrl]);

  const onSubmit = (data) => {
    onSave(data);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, we'll just show a message that file upload needs backend support
      // In a real implementation, you'd upload to Cloudinary or similar service
      // and get back a URL to use as the icon
      alert('File upload requires backend integration. Please use an icon URL for now.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            {isEditMode ? 'Edit Category' : 'Add Category'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Name Field */}
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Category name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  required
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  variant="outlined"
                />
              )}
            />

            {/* Description Field */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                />
              )}
            />

            {/* Icon URL Field */}
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Icon URL"
                  fullWidth
                  variant="outlined"
                  placeholder="https://example.com/icon.png"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          component="label"
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            // For now, just show file input (would need backend support)
                            e.preventDefault();
                            document.getElementById('icon-file-input')?.click();
                          }}
                        >
                          <ImageIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <input
              id="icon-file-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />

            {/* Icon Preview */}
            {iconPreview && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  p: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Icon Preview:
                </Typography>
                <Box
                  component="img"
                  src={iconPreview}
                  alt="Icon preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                  sx={{
                    maxWidth: '100px',
                    maxHeight: '100px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryDialog;
