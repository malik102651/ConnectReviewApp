import { AppBar, Toolbar, Button, Box, InputBase, IconButton } from '@mui/material';
import { Search, Menu } from 'lucide-react';

export default function Navigation() {
  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #d7e2ee',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            edge="start" 
            sx={{ 
              color: '#0f172a',
              '&:hover': {
                color: '#1e88e5',
              }
            }}
          >
            <Menu />
          </IconButton>
          <img src="https://consumer-images.trustpilot.com/_next/static/media/tp-logo.f872e592..svg" 
               alt="Trustpilot" 
               style={{ height: 24 }} />
        </Box>
        
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f8fbff',
          borderRadius: 999,
          padding: '6px 12px',
          flex: '0 1 400px',
          margin: '0 24px',
          border: '1px solid #d7e2ee',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#1e88e5',
            boxShadow: '0 4px 12px rgba(30, 136, 229, 0.12)',
          },
          '&:focus-within': {
            borderColor: '#06b6d4',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.16)',
          }
        }}>
          <InputBase
            placeholder="Find company or category"
            sx={{ 
              ml: 1, 
              flex: 1,
              color: '#0f172a',
              '& .MuiInputBase-input::placeholder': {
                color: '#64748b',
                opacity: 1,
              }
            }}
          />
          <IconButton 
            type="button" 
            sx={{ 
              p: '8px',
              color: '#1e88e5',
              '&:hover': {
                backgroundColor: 'rgba(30, 136, 229, 0.08)',
              }
            }}
          >
            <Search size={20} />
          </IconButton>
        </Box>

        <Button 
          variant="contained" 
          sx={{ 
            background: 'linear-gradient(135deg, #1e88e5 0%, #06b6d4 100%)',
            color: '#ffffff',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #0891b2 100%)',
              boxShadow: '0 8px 24px rgba(30, 136, 229, 0.24)',
            }
          }}
        >
          Write a review
        </Button>
      </Toolbar>
    </AppBar>
  );
}