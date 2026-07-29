import { useState } from 'react';
import { Box, Button, Menu, MenuItem, Avatar, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { LogOut, LogIn, Settings } from 'lucide-react';
import AccountSettings from './AccountSettings';

export default function CompanyHeader({ company, setReloadReviews, isReviewFormOpen, setIsReviewFormOpen }) {
  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem("user"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const handleOpenReviewForm = () => {
    user ? setIsReviewFormOpen(true) : navigate('/login');
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenSettings = () => {
    handleCloseMenu();
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    user = updatedUser;
  };

  const handleLogout = () => {
    if(user){
      localStorage.removeItem("user");
      navigate('/');
    }else{
      navigate('/login'); 
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        alignItems: 'center',
      }}>
        {/* Profile Section for Logged In Users */}
        {user && (
          <Box
            onClick={handleOpenMenu}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              px: 1,
              py: 0.5,
              borderRadius: '8px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(30, 136, 229, 0.08)',
              },
            }}
          >
            <Avatar
              src={currentUser?.profileImage}
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#e0f2fe',
                color: '#1e88e5',
                fontSize: '0.95rem',
                fontWeight: 700,
              }}
            >
              {currentUser?.firstName ? currentUser.firstName[0].toUpperCase() : 'U'}
            </Avatar>
            <Typography
              sx={{
                fontSize: '0.9rem',
                color: '#0f172a',
                fontWeight: 600,
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {currentUser?.firstName} {currentUser?.lastName}
            </Typography>
          </Box>
        )}

        <Button 
          onClick={handleLogout}
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            px: 2.5,
            py: 1,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
              background: user 
                ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(30, 136, 229, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: user 
                ? '1.5px solid rgba(14, 165, 233, 0.28)' 
                : '1.5px solid rgba(30, 136, 229, 0.3)',
              color: user ? '#0891b2' : '#1e88e5',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: user
                  ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(30, 136, 229, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: user
                  ? '1.5px solid rgba(14, 165, 233, 0.45)'
                  : '1.5px solid rgba(6, 182, 212, 0.5)',
              color: user ? '#0ea5e9' : '#06b6d4',
              boxShadow: user
                ? '0 4px 12px rgba(14, 165, 233, 0.15)'
                : '0 4px 12px rgba(30, 136, 229, 0.15)',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
              visibility: user ? 'hidden' : 'visible',
              pointerEvents: user ? 'none' : 'auto',
          }}
          variant="outlined"
        >
          {!user && (
            <>
              <LogIn size={18} />
              Login
            </>
          )}
        </Button>
      </Box>

      {/* Profile Dropdown Menu */}
      {user && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              backgroundColor: '#ffffff',
              border: '1px solid #d7e2ee',
              mt: 1,
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
            },
          }}
        >
          <MenuItem
            // disabled
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              color: '#1e88e5',
              fontWeight: 700,
              fontSize: '1.1rem',
              // py: 2,
              px: 2,
              backgroundColor: 'rgba(30, 136, 229, 0.05)',
            }}
          >
            {currentUser?.firstName} {currentUser?.lastName}
          </MenuItem>
          <MenuItem
            // disabled
            sx={{
              color: '#0f172a',
              fontSize: '0.9rem',
              fontWeight: 500,
              // py: 1,
              px: 2,
            }}
          >
            {currentUser?.email}
          </MenuItem>
          <Box sx={{ borderBottom: '1px solid #d7e2ee', my: 1 }} />
          <MenuItem
            onClick={handleOpenSettings}
            sx={{
              color: '#0f172a',
              gap: 1,
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: 'rgba(30, 136, 229, 0.08)',
                color: '#1e88e5',
              },
            }}
          >
            <Settings size={18} />
            Account Settings
          </MenuItem>
          <Box sx={{ borderBottom: '1px solid #d7e2ee', my: 1 }} />
          <MenuItem
            onClick={handleLogout}
            sx={{
              color: '#0ea5e9',
              gap: 1,
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                color: '#0891b2',
              },
            }}
          >
            <LogOut size={18} />
            Logout
          </MenuItem>
        </Menu>
      )}

      {/* Account Settings Modal */}
      {user && (
        <AccountSettings
          open={openSettings}
          onClose={handleCloseSettings}
          user={currentUser}
          onUpdate={handleUpdateUser}
        />
      )}
    </Box>
  );
}