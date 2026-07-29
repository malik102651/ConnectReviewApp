import { Box, Typography, IconButton, Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReviewCard from "./ReviewCard";

export default function ReviewsSlider({ reviews, onReviewDeleted }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(6);
  const sliderRef = useRef(null);

  // Calculate how many cards to show based on screen size
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) return 1;
      if (width < 1024) return 2;
      return 6;
    }
    return 6;
  };

  // Handle window resize
  useEffect(() => {
    setCardsPerView(getCardsPerView());
    
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.max(0, Math.ceil(reviews.length / cardsPerView) - 1);

  const handlePrev = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex - 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const getPaginationPages = () => {
    const maxDisplay = 7;
    const pages = [];
    const total = totalSlides + 1;
    
    if (total <= maxDisplay) {
      // Show all pages if total is small
      for (let i = 0; i < total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);
      
      // Calculate range around current page (5 pages window)
      let start = Math.max(1, currentIndex - 2);
      let end = Math.min(total - 2, currentIndex + 2);
      
      // Adjust to always show 5 pages if possible
      if (end - start < 4) {
        if (start === 1) {
          end = Math.min(total - 2, start + 4);
        } else if (end === total - 2) {
          start = Math.max(1, end - 4);
        }
      }
      
      // Add ellipsis and pages
      if (start > 1) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < total - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(total - 1);
    }
    
    return pages;
  };

  const handleNext = () => {
    if (currentIndex < totalSlides && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const visibleReviews = reviews.slice(
    currentIndex * cardsPerView,
    (currentIndex + 1) * cardsPerView
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#1a1a1a', fontWeight: 600 }}>
        All reviews ({reviews.length})
      </Typography>

      {reviews.length > 0 ? (
        <Box sx={{ position: 'relative' }}>
          {/* Slider Container */}
          <Box
            ref={sliderRef}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 3,
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isTransitioning ? 0.7 : 1,
            }}
          >
            {visibleReviews.map((review) => (
              <Box key={review.id} sx={{ minHeight: '100%' }}>
                <ReviewCard review={review} onReviewDeleted={onReviewDeleted} />
              </Box>
            ))}
          </Box>

          {/* Navigation Arrows */}
          {reviews.length > cardsPerView && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                mt: 3,
                mb: 2,
              }}
            >
              <IconButton
                onClick={handlePrev}
                disabled={currentIndex === 0}
                sx={{
                  backgroundColor: currentIndex === 0 ? '#f0f0f0' : '#ffffff',
                  border: '2px solid #d0d0d0',
                  color: currentIndex === 0 ? '#ccc' : '#1e88e5',
                  transition: 'all 0.3s ease',
                  padding: '10px',
                  '&:hover': {
                    backgroundColor: currentIndex === 0 ? '#f0f0f0' : '#f5f5f5',
                    borderColor: currentIndex === 0 ? '#d0d0d0' : '#1e88e5',
                  },
                  '&:disabled': {
                    cursor: 'not-allowed',
                  },
                }}
              >
                <ChevronLeft size={20} />
              </IconButton>

              {/* Pagination Numbers */}
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                {getPaginationPages().map((page, index) => 
                  page === '...' ? (
                    <Box
                      key={`ellipsis-${index}`}
                      sx={{
                        minWidth: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: '#888',
                        fontWeight: 500,
                      }}
                    >
                      ...
                    </Box>
                  ) : (
                    <Button
                      key={page}
                      onClick={() => {
                        if (!isTransitioning) {
                          setIsTransitioning(true);
                          setCurrentIndex(page);
                          setTimeout(() => setIsTransitioning(false), 500);
                        }
                      }}
                      sx={{
                        minWidth: '40px',
                        height: '40px',
                        padding: '0',
                        fontSize: '0.95rem',
                        fontWeight: currentIndex === page ? 700 : 500,
                        color: currentIndex === page ? '#ffffff' : '#1a1a1a',
                        backgroundColor: currentIndex === page ? '#1e88e5' : '#f0f0f0',
                        border: currentIndex === page ? '2px solid #1e88e5' : '2px solid #d0d0d0',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: currentIndex === page ? '#1565c0' : '#e8e8e8',
                          borderColor: currentIndex === page ? '#1565c0' : '#999',
                        },
                      }}
                    >
                      {page + 1}
                    </Button>
                  )
                )}
              </Box>

              <IconButton
                onClick={handleNext}
                disabled={currentIndex === totalSlides}
                sx={{
                  backgroundColor: currentIndex === totalSlides ? '#f0f0f0' : '#ffffff',
                  border: '2px solid #d0d0d0',
                  color: currentIndex === totalSlides ? '#ccc' : '#1e88e5',
                  transition: 'all 0.3s ease',
                  padding: '10px',
                  '&:hover': {
                    backgroundColor: currentIndex === totalSlides ? '#f0f0f0' : '#f5f5f5',
                    borderColor: currentIndex === totalSlides ? '#d0d0d0' : '#1e88e5',
                  },
                  '&:disabled': {
                    cursor: 'not-allowed',
                  },
                }}
              >
                <ChevronRight size={20} />
              </IconButton>
            </Box>
          )}

          {/* Slide Counter */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
              {reviews.length > cardsPerView
                ? `Page ${currentIndex + 1} of ${totalSlides + 1}`
                : `Showing all ${reviews.length} reviews`}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Typography sx={{ color: '#999', py: 4, textAlign: 'center' }}>
          No reviews yet. Be the first to share your experience!
        </Typography>
      )}
    </Box>
  );
}
