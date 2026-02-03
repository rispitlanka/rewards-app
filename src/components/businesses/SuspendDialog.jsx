import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const SuspendDialog = ({ open, onClose, onConfirm, business, isLoading = false }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reason: '',
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    onConfirm(data.reason);
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Warning color="warning" />
          Suspend Business
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to suspend <strong>{business?.businessName}</strong>? This action will prevent the business from receiving new content.
          </Typography>
          <Controller
            name="reason"
            control={control}
            rules={{
              required: 'Suspension reason is required',
              minLength: {
                value: 10,
                message: 'Reason must be at least 10 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Suspension Reason"
                required
                fullWidth
                multiline
                rows={4}
                error={!!errors.reason}
                helperText={errors.reason?.message}
                variant="outlined"
                placeholder="Enter the reason for suspending this business..."
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="warning"
            disabled={isLoading}
          >
            {isLoading ? 'Suspending...' : 'Suspend Business'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SuspendDialog;
