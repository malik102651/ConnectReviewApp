import { Box, Typography, LinearProgress, Grid, Checkbox } from "@mui/material";

export default function RatingDistribution({ distribution, selectedRatings = [], onRatingFilterChange }) {
  const total = distribution.reduce((acc, item) => acc + item.count, 0);

  // Define colors for each rating
  const ratingColors = {
    5: '#4caf50', // Green
    4: '#8bc34a', // Light Green
    3: '#ffeb3b', // Yellow
    2: '#ff9800', // Orange
    1: '#f44336', // Red
  };

  // Reverse the order to show 5-star first
  const sortedDistribution = [...distribution].reverse();

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: '#1a1a1a', mb: 3, fontWeight: 600 }}>
        Rating Distribution
      </Typography>
      {sortedDistribution.map((item) => (
        <Grid container spacing={2} alignItems="center" key={item.rating}>
          {/* Checkbox */}
          <Grid item xs="auto">
            <Checkbox
              checked={selectedRatings.includes(item.rating)}
              onChange={() => onRatingFilterChange(item.rating)}
              // sx={{
              //   color: ratingColors[item.rating],
              //   '&.Mui-checked': {
              //     color: ratingColors[item.rating],
              //   },
              // }}
            />
          </Grid>

          {/* Rating Label */}
          <Grid item xs={2} sm={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '0.95rem' }}>
                {item.rating}
              </Typography>
              <Box sx={{ fontSize: '0.9rem' }}>star</Box>
            </Box>
          </Grid>

          {/* Progress Bar */}
          <Grid item xs="auto" sx={{ flex: 1, minWidth: '150px' }}>
            <LinearProgress
              variant="determinate"
              value={(item.count / total) * 100 || 0}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: ratingColors[item.rating],
                  borderRadius: 4,
                }
              }}
            />
          </Grid>

          {/* Percentage */}
          <Grid item xs="auto" sx={{ minWidth: '50px', textAlign: 'right' }}>
            <Typography sx={{ color: '#777', fontWeight: 600, fontSize: '0.9rem' }}>
              {total > 0 ? Math.round((item.count / total) * 100) : 0}%
            </Typography>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}
