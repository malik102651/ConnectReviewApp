import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb() {
  return (
    <Box sx={{ mb: 4 }}>
      <Breadcrumbs 
        separator={<ChevronRight size={16} />} 
        sx={{ 
          '& .MuiBreadcrumbs-separator': {
            color: '#94a3b8',
          },
          '& a': {
            color: '#1e88e5',
            transition: 'color 0.2s',
            '&:hover': {
              color: '#06b6d4',
            },
          },
        }}
      >
        <Link href="#" underline="hover" color="inherit">
          Categories
        </Link>
        <Link href="#" underline="hover" color="inherit">
          Education
        </Link>
        <Typography color="text.primary">Connect Realm</Typography>
      </Breadcrumbs>
    </Box>
  );
}
