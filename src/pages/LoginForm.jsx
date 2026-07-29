import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Link } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToastId = toast.loading("Logging in...");

    try {
      const response = await fetch("/api/public/function/reviewSignin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the email and password as JSON
      });

      const result = await response.json();

      // Check if API returned an error message
      if (result.msg) {
        toast.dismiss(loadingToastId);
        toast.error(result.msg);
        return;
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      localStorage.setItem("user", JSON.stringify(result?.data?.user));
      toast.dismiss(loadingToastId);
      toast.success("Login successful!");
      navigate('/');
      // Redirect or perform any other actions after successful login
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToastId);
      toast.error("Login failed! Please check your credentials.");
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
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
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="off"
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
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="off"
              sx={{ 
                mb: 3,
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
              Login
            </Button>
          </form>
          <Typography 
            variant="body2" 
            sx={{ mt: 2, color: '#475569' }}
          >
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              variant="body2" 
              sx={{ 
                color: '#1e88e5',
                fontWeight: 600,
                '&:hover': {
                  color: '#06b6d4',
                }
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginForm;