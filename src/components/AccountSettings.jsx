import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountSettings({ open, onClose, user, onUpdate }) {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    profileImage: null,
    previewImage: user?.profileImage || '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (passwordErrors[name]) {
      setPasswordErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profileImage: file,
          previewImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.oldPassword.trim()) {
      newErrors.oldPassword = 'Current password is required';
    }
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    toast.loading('Updating profile...');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userId', user?._id);
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      const response = await fetch('/api/public/function/updateSignupReview', {
        method: 'PUT',
        body: formDataToSend,
      });
      if (!response.status === 200) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      toast.dismiss();
      toast.success('Profile updated successfully!');
      // Update user in localStorage
      const updatedUser = { ...user, ...result?.message?.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      onUpdate(updatedUser);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.dismiss();
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    const newErrors = validatePasswordForm();
    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      toast.error('Please fill in all password fields correctly');
      return;
    }

    setLoading(true);
    toast.loading('Updating password...');

    try {
      const response = await fetch('/api/public/function/reviewUpdatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult?.message || 'Failed to update password');
      }

      const result = await response.json();
      toast.dismiss();
      toast.success('Password updated successfully!');

      // Reset password form
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    } catch (error) {
      console.error('Error:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          color: '#0f172a',
          backgroundColor: '#ffffff',
          fontWeight: 700,
          fontSize: '1.5rem',
          borderBottom: '1px solid #d7e2ee',
        }}
      >
        Account Settings
      </DialogTitle>
      
      {/* Tabs */}
      <Box sx={{ 
        backgroundColor: '#f9f9f9',
        borderBottom: '1px solid #d7e2ee',
      }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#1e88e5',
              height: '3px',
            },
            '& .MuiTabs-root': {
              minHeight: '56px',
            },
            '& .MuiTab-root': {
              color: '#475569',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              minHeight: '56px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(30, 136, 229, 0.04)',
                color: '#1e88e5',
              },
              '&.Mui-selected': {
                color: '#1e88e5',
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab label="Account Info" />
          <Tab label="Password Update" />
        </Tabs>
      </Box>

      <DialogContent
        sx={{
          backgroundColor: '#ffffff',
          py: 3,
        }}
      >
        {/* Account Info Tab */}
        {tabValue === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Profile Image Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={formData.previewImage}
              sx={{
                width: 100,
                height: 100,
                bgcolor: '#e0f2fe',
                color: '#1e88e5',
                fontWeight: 700,
              }}
            >
              {!formData.previewImage && formData.firstName[0]}
            </Avatar>
            <Box
              component="label"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                border: '1.5px solid rgba(30, 136, 229, 0.35)',
                color: '#1e88e5',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.18) 0%, rgba(6, 182, 212, 0.1) 100%)',
                  border: '1.5px solid rgba(6, 182, 212, 0.55)',
                  boxShadow: '0 4px 12px rgba(30, 136, 229, 0.18)',
                },
              }}
            >
              <Upload size={18} />
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e88e5' }}>
                Change Photo
              </Typography>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Box>
          </Box>

          {/* Form Fields */}
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#0f172a',
                '& fieldset': {
                  borderColor: errors.firstName ? '#ff6b6b' : '#d0d0d0',
                },
                '&:hover fieldset': {
                  borderColor: errors.firstName ? '#ff6b6b' : '#1e88e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: errors.firstName ? '#ff6b6b' : '#1e88e5',
                  boxShadow: errors.firstName ? '0 0 0 3px rgba(255, 107, 107, 0.1)' : '0 0 0 3px rgba(30, 136, 229, 0.12)',
                },
              },
              '& label': {
                color: '#64748b',
                '&.Mui-focused': {
                  color: errors.firstName ? '#ff6b6b' : '#1e88e5',
                },
              },
              '& .MuiFormHelperText-root': {
                color: errors.firstName ? '#ff6b6b' : '#475569',
              },
            }}
          />

          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#0f172a',
                '& fieldset': {
                  borderColor: errors.lastName ? '#ff6b6b' : '#d0d0d0',
                },
                '&:hover fieldset': {
                  borderColor: errors.lastName ? '#ff6b6b' : '#1e88e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: errors.lastName ? '#ff6b6b' : '#1e88e5',
                  boxShadow: errors.lastName ? '0 0 0 3px rgba(255, 107, 107, 0.1)' : '0 0 0 3px rgba(30, 136, 229, 0.12)',
                },
              },
              '& label': {
                color: '#64748b',
                '&.Mui-focused': {
                  color: errors.lastName ? '#ff6b6b' : '#1e88e5',
                },
              },
              '& .MuiFormHelperText-root': {
                color: errors.lastName ? '#ff6b6b' : '#475569',
              },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={true}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#0f172a',
                backgroundColor: '#ffffff',
                opacity: 0.65,
                '& fieldset': {
                  borderColor: '#d0d0d0',
                  borderWidth: '1px',
                },
                '&.Mui-disabled': {
                  '& fieldset': {
                    borderColor: '#d0d0d0',
                  },
                },
              },
              '& .MuiOutlinedInput-input': {
                WebkitTextFillColor: '#333333',
              },
              '& label': {
                color: '#64748b',
                opacity: 0.65,
                '&.Mui-disabled': {
                  color: '#64748b',
                },
              },
            }}
          />
        </Box>
        )}

        {/* Password Update Tab */}
        {tabValue === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Current Password"
            name="oldPassword"
            type="password"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.oldPassword}
            helperText={passwordErrors.oldPassword}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#0f172a',
                '& fieldset': {
                  borderColor: passwordErrors.oldPassword ? '#ff6b6b' : '#d0d0d0',
                },
                '&:hover fieldset': {
                  borderColor: passwordErrors.oldPassword ? '#ff6b6b' : '#1e88e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: passwordErrors.oldPassword ? '#ff6b6b' : '#1e88e5',
                  boxShadow: passwordErrors.oldPassword ? '0 0 0 3px rgba(255, 107, 107, 0.1)' : '0 0 0 3px rgba(30, 136, 229, 0.12)',
                },
              },
              '& label': {
                color: '#64748b',
                '&.Mui-focused': {
                  color: passwordErrors.oldPassword ? '#ff6b6b' : '#1e88e5',
                },
              },
              '& .MuiFormHelperText-root': {
                color: passwordErrors.oldPassword ? '#ff6b6b' : '#475569',
              },
            }}
          />

          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.newPassword}
            helperText={passwordErrors.newPassword}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#0f172a',
                '& fieldset': {
                  borderColor: passwordErrors.newPassword ? '#ff6b6b' : '#d0d0d0',
                },
                '&:hover fieldset': {
                  borderColor: passwordErrors.newPassword ? '#ff6b6b' : '#1e88e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: passwordErrors.newPassword ? '#ff6b6b' : '#1e88e5',
                  boxShadow: passwordErrors.newPassword ? '0 0 0 3px rgba(255, 107, 107, 0.1)' : '0 0 0 3px rgba(30, 136, 229, 0.12)',
                },
              },
              '& label': {
                color: '#64748b',
                '&.Mui-focused': {
                  color: passwordErrors.newPassword ? '#ff6b6b' : '#1e88e5',
                },
              },
              '& .MuiFormHelperText-root': {
                color: passwordErrors.newPassword ? '#ff6b6b' : '#475569',
              },
            }}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.confirmPassword}
            helperText={passwordErrors.confirmPassword}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#0f172a',
                '& fieldset': {
                  borderColor: passwordErrors.confirmPassword ? '#ff6b6b' : '#d0d0d0',
                },
                '&:hover fieldset': {
                  borderColor: passwordErrors.confirmPassword ? '#ff6b6b' : '#1e88e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: passwordErrors.confirmPassword ? '#ff6b6b' : '#1e88e5',
                  boxShadow: passwordErrors.confirmPassword ? '0 0 0 3px rgba(255, 107, 107, 0.1)' : '0 0 0 3px rgba(30, 136, 229, 0.12)',
                },
              },
              '& label': {
                color: '#64748b',
                '&.Mui-focused': {
                  color: passwordErrors.confirmPassword ? '#ff6b6b' : '#1e88e5',
                },
              },
              '& .MuiFormHelperText-root': {
                color: passwordErrors.confirmPassword ? '#ff6b6b' : '#475569',
              },
            }}
          />
        </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: '#f8fbff',
          gap: 1,
          padding: 2,
          borderTop: '1px solid #d7e2ee',
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: '#475569',
            textTransform: 'none',
            fontSize: '0.95rem',
            '&:hover': {
              color: '#1e88e5',
              backgroundColor: 'rgba(30, 136, 229, 0.06)',
            },
          }}
        >
          Cancel
        </Button>
        {tabValue === 0 && (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.16) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: '1.5px solid rgba(30, 136, 229, 0.45)',
              color: '#1e88e5',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.22) 0%, rgba(6, 182, 212, 0.12) 100%)',
                border: '1.5px solid rgba(6, 182, 212, 0.65)',
                boxShadow: '0 4px 12px rgba(30, 136, 229, 0.18)',
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Save Changes'}
          </Button>
        )}
        {tabValue === 1 && (
          <Button
            onClick={handlePasswordSubmit}
            disabled={loading}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.16) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: '1.5px solid rgba(30, 136, 229, 0.45)',
              color: '#1e88e5',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.22) 0%, rgba(6, 182, 212, 0.12) 100%)',
                border: '1.5px solid rgba(6, 182, 212, 0.65)',
                boxShadow: '0 4px 12px rgba(30, 136, 229, 0.18)',
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Update Password'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
