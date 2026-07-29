import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Avatar, Link } from '@mui/material';
import { toast } from 'react-hot-toast'; // Ensure you have this for toast notifications
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate(); // Initialize navigate

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    brokerage: '',
    email: '',
    password: '',
    profileImage: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profileImage: e.target.files[0],
    }));
    // Clear error for profileImage when file is selected
    if (errors.profileImage) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        profileImage: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    toast.loading("Submitting...");

    // Create a FormData object to send the data
    const formDataToSend = new FormData();
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('brokerage', formData.brokerage);
    formDataToSend.append('email', formData.email); 
    formDataToSend.append('password', formData.password);
    if (formData.profileImage) {
      formDataToSend.append('profileImage', formData.profileImage);
    }

    try {
      const response = await fetch("/api/public/function/reviewSignup", {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      toast.success("Signup successful!");
      navigate('/login'); // Redirect to login page after successful signup
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    } finally {
      // Reset the form or set loading state
      setFormData({
        firstName: '',
        lastName: '',
        brokerage: '',
        email: '',
        password: '',
        profileImage: null,
      });
      setErrors({});
      toast.dismiss(); // Dismiss the loading toast
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: 2,
      backgroundColor: '#f8fbff',
    }}>
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
            border: '1px solid #d7e2ee',
            padding: 4,
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ color: '#0f172a', fontWeight: 700, mb: 3 }}
          >
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              // required
              error={!!errors.firstName}
              helperText={errors.firstName}
              sx={{ 
                mb: 2,
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
              label="Last Name (Optional)"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              sx={{ 
                mb: 2,
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
              label="Real Estate Brokerage"
              name="brokerage"
              value={formData.brokerage}
              onChange={handleChange}
              autoComplete="organization"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: '#0f172a',
                  '& fieldset': {
                    borderColor: '#d0d0d0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1e88e5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1e88e5',
                    boxShadow: '0 0 0 3px rgba(30, 136, 229, 0.12)',
                  },
                },
                '& label': {
                  color: '#64748b',
                  '&.Mui-focused': {
                    color: '#1e88e5',
                  },
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
              // required
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="off"
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: '#0f172a',
                  '& fieldset': {
                    borderColor: errors.email ? '#ff6b6b' : '#d0d0d0',
                  },
                  '&:hover fieldset': {
                    borderColor: errors.email ? '#ff6b6b' : '#1e88e5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errors.email ? '#ff6b6b' : '#1e88e5',
                    boxShadow: errors.email ? '0 0 0 3px rgba(255, 107, 107, 0.1)' : '0 0 0 3px rgba(30, 136, 229, 0.12)',
                  },
                },
                '& label': {
                  color: '#64748b',
                  '&.Mui-focused': {
                    color: errors.email ? '#ff6b6b' : '#1e88e5',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: errors.email ? '#ff6b6b' : '#475569',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              // required
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="off"
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: '#0f172a',
                  '& fieldset': {
                    borderColor: errors.password ? '#ff6b6b' : '#d0d0d0',
                  },
                  '&:hover fieldset': {
                    borderColor: errors.password ? '#ff6b6b' : '#1e88e5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errors.password ? '#ff6b6b' : '#1e88e5',
                    boxShadow: errors.password ? '0 0 0 3px rgba(255, 107, 107, 0.1)' : '0 0 0 3px rgba(30, 136, 229, 0.12)',
                  },
                },
                '& label': {
                  color: '#64748b',
                  '&.Mui-focused': {
                    color: errors.password ? '#ff6b6b' : '#1e88e5',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: errors.password ? '#ff6b6b' : '#475569',
                },
              }}
            />
            <Box sx={{ mb: 3 }}>
              <label htmlFor="profile-image-upload" style={{ display: 'block', marginBottom: '12px' }}>
                <input
                  accept="image/*"
                  id="profile-image-upload"
                  type="file"
                  onChange={handleFileChange}
                  name="profileImage"
                  style={{ display: 'none' }}
                />
                <Button 
                  variant="outlined" 
                  component="span" 
                  fullWidth
                  sx={{
                    borderColor: errors.profileImage ? '#ff6b6b' : '#d0d0d0',
                    color: errors.profileImage ? '#ff6b6b' : '#1e88e5',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: errors.profileImage ? '#ff6b6b' : '#1e88e5',
                      color: errors.profileImage ? '#ff6b6b' : '#1e88e5',
                      backgroundColor: errors.profileImage ? 'rgba(255, 107, 107, 0.05)' : 'rgba(30, 136, 229, 0.05)',
                    }
                  }}
                >
                  Choose Profile Image
                </Button>
              </label>
              {errors.profileImage && (
                <Typography 
                  variant="caption" 
                  sx={{ color: '#ff6b6b', display: 'block', mt: 0.5 }}
                >
                  {errors.profileImage}
                </Typography>
              )}
            </Box>
            {formData.profileImage && (
              <Avatar
                alt="Profile Image"
                src={URL.createObjectURL(formData.profileImage)}
                sx={{ 
                  width: 100, 
                  height: 100, 
                  margin: '0 auto', 
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(30, 136, 229, 0.18)',
                }}
              />
            )}
            <Button 
              variant="contained" 
              fullWidth
              type="submit"
              sx={{
                background: 'linear-gradient(135deg, #1e88e5 0%, #06b6d4 100%)',
                color: '#ffffff',
                fontWeight: 600,
                py: 1.5,
                mb: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #0891b2 100%)',
                  boxShadow: '0 8px 24px rgba(30, 136, 229, 0.28)',
                }
              }}
            >
              Sign Up
            </Button>
          </form>
          <Typography 
            variant="body2" 
            sx={{ mt: 2, color: '#475569' }}
          >
            Already have an account?{' '}
            <Link 
              href="/login" 
              variant="body2"
              sx={{ 
                color: '#1e88e5',
                fontWeight: 600,
                '&:hover': {
                  color: '#06b6d4',
                }
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupForm;