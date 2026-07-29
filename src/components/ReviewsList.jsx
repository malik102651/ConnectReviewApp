import { Box, Typography } from "@mui/material";
import ReviewCard from "./ReviewCard";

export default function ReviewsList({ reviews }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#1a1a1a', fontWeight: 600 }}>
        All reviews ({reviews.length})
      </Typography>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))
      ) : (
        <Typography sx={{ color: '#999', py: 4, textAlign: 'center' }}>
          No reviews yet. Be the first to share your experience!
        </Typography>
      )}
    </Box>
  );
}
