import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Chip,
  Divider,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Close,
  Business,
  LocationOn,
  Email,
  Phone,
  Category,
  Person,
  CheckCircle,
  Cancel,
  Schedule,
  Image as ImageIcon,
  VideoLibrary,
  TrendingUp,
} from '@mui/icons-material';
import { format } from 'date-fns';

const BusinessDetailDialog = ({ open, onClose, business, onVerify, onSuspend, onUnsuspend, onDelete }) => {
  const [tabValue, setTabValue] = useState(0);

  if (!business) return null;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            {business.logo && (
              <Avatar
                src={business.logo}
                alt={business.businessName}
                sx={{ width: 56, height: 56 }}
              >
                <Business />
              </Avatar>
            )}
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {business.businessName}
              </Typography>
              <Box display="flex" gap={1} mt={0.5}>
                <Chip
                  label={business.isVerified ? 'Verified' : 'Unverified'}
                  color={business.isVerified ? 'success' : 'warning'}
                  size="small"
                />
                <Chip
                  label={business.status === 'active' ? 'Active' : 'Suspended'}
                  color={business.status === 'active' ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
          <Button onClick={onClose} size="small">
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Info" />
          <Tab label="Milestones" />
          <Tab label="Content" />
          <Tab label="Stats" />
        </Tabs>

        {/* Info Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Business Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Business />
                    </ListItemIcon>
                    <ListItemText
                      primary="Business Name"
                      secondary={business.businessName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Category />
                    </ListItemIcon>
                    <ListItemText
                      primary="Category"
                      secondary={business.category?.name || 'N/A'}
                    />
                  </ListItem>
                  {business.description && (
                    <ListItem>
                      <ListItemText
                        primary="Description"
                        secondary={business.description}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={`${business.location?.city || ''}, ${business.location?.country || ''}`}
                    />
                  </ListItem>
                  {business.location?.address && (
                    <ListItem>
                      <ListItemText
                        primary="Address"
                        secondary={business.location.address}
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Owner Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Owner Name"
                      secondary={business.userId?.profile?.name || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={business.userId?.email || 'N/A'}
                    />
                  </ListItem>
                  {business.contactInfo?.phone && (
                    <ListItem>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={business.contactInfo.phone}
                      />
                    </ListItem>
                  )}
                  {business.contactInfo?.email && (
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText
                        primary="Business Email"
                        secondary={business.contactInfo.email}
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Registration Date
                    </Typography>
                    <Typography variant="body1">
                      {business.createdAt
                        ? format(new Date(business.createdAt), 'MMM dd, yyyy')
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  {business.verifiedAt && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Verified Date
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(business.verifiedAt), 'MMM dd, yyyy')}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Content Received
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {business.totalContent || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Content Settings
                    </Typography>
                    <Box display="flex" gap={1} mt={0.5}>
                      {business.contentSettings?.acceptsPhoto && (
                        <Chip label="Photos" size="small" icon={<ImageIcon />} />
                      )}
                      {business.contentSettings?.acceptsVideo && (
                        <Chip label="Videos" size="small" icon={<VideoLibrary />} />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Milestones Tab */}
        {tabValue === 1 && (
          <Box>
            {business.milestones && business.milestones.length > 0 ? (
              <List>
                {business.milestones.map((milestone, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Typography variant="h6" fontWeight="bold">
                        Milestone {index + 1}
                      </Typography>
                      <Chip
                        label={`${milestone.points} points`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {milestone.rewardTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {milestone.rewardDescription}
                    </Typography>
                    {milestone.termsAndConditions && (
                      <Typography variant="caption" color="text.secondary">
                        Terms: {milestone.termsAndConditions}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </List>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No milestones defined for this business
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Content Tab */}
        {tabValue === 2 && (
          <Box>
            <Typography variant="body1" color="text.secondary" paragraph>
              Content management features would be displayed here. This would typically show recent content submissions with thumbnails.
            </Typography>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="primary" />
                <Box>
                  <Typography variant="h6">Total Content</Typography>
                  <Typography variant="h4" color="primary">
                    {business.totalContent || 0}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Stats Tab */}
        {tabValue === 3 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Content
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {business.totalContent || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Unique Creators
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    {business.totalUniqueCreators || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={business.status === 'active' ? 'Active' : 'Suspended'}
                    color={business.status === 'active' ? 'success' : 'error'}
                    sx={{ mt: 1 }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Verification
                  </Typography>
                  <Chip
                    label={business.isVerified ? 'Verified' : 'Unverified'}
                    color={business.isVerified ? 'success' : 'warning'}
                    sx={{ mt: 1 }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        {!business.isVerified && (
          <Button onClick={() => onVerify(business)} variant="contained" color="success">
            Verify
          </Button>
        )}
        {business.status === 'active' ? (
          <Button onClick={() => onSuspend(business)} variant="outlined" color="warning">
            Suspend
          </Button>
        ) : (
          <Button onClick={() => onUnsuspend(business)} variant="outlined" color="success">
            Unsuspend
          </Button>
        )}
        <Button onClick={() => onDelete(business)} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BusinessDetailDialog;
