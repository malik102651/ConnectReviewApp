import { Box, Typography, Grid, Paper } from '@mui/material';
import { Building2, Globe, CheckCircle } from 'lucide-react';

export default function CompanyInfo({ company }) {
  return (
    <Box sx={{ my: 0 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#1a1a1a', fontWeight: 600 }}>
        About
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: 3, 
            mb: 0,
            backgroundColor: '#f8f8f8',
            border: '1px solid #d0d0d0',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#1e88e5',
              boxShadow: '0 2px 8px rgba(30, 136, 229, 0.15)',
            }
          }}>
            <Typography variant="body2" paragraph sx={{ color: '#555', lineHeight: 1.6 }}>
              Reviews on Connect Realm are verified when we can match the reviewer with a genuine experience.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3,
            backgroundColor: '#f8f8f8',
            border: '1px solid #d0d0d0',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#1e88e5',
              boxShadow: '0 2px 8px rgba(30, 136, 229, 0.15)',
            }
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ color: '#1e88e5', mt: 0.5, flexShrink: 0 }}>
                  <Building2 size={20} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#1a1a1a', mb: 0.5, fontWeight: 600 }}>
                    Company
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {company.name}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ color: '#1e88e5', mt: 0.5, flexShrink: 0 }}>
                  <Globe size={20} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#1a1a1a', mb: 0.5, fontWeight: 600 }}>
                    Website
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {company.website}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ color: '#1e88e5', mt: 0.5, flexShrink: 0 }}>
                  <CheckCircle size={20} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#1a1a1a', mb: 0.5, fontWeight: 600 }}>
                    Business status
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Active
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
