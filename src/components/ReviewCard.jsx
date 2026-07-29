import { Card, CardContent, Typography, Box, Avatar, Rating, Button, Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem, TextField, Tooltip, Snackbar, Alert } from "@mui/material";
import { CheckCircle, ThumbsUp, Share2, Flag, Trash2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import Logo from '../assets/lightIcon.png';

export default function ReviewCard({ review, onReviewDeleted }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likeCount || 0);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    reason: '',
    description: '',
  });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Get current user from localStorage on component mount
  useEffect(() => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    setCurrentUser(user);
  }, []);
  
  const getInitials = (fullName) => {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return names[0].charAt(0);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'America/New_York',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const getNameParts = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };

    const nameParts = fullName.trim().split(' ').filter(Boolean);
    if (nameParts.length <= 1) {
      return { firstName: nameParts[0] || '', lastName: '' };
    }

    return {
      firstName: nameParts.slice(0, -1).join(' '),
      lastName: nameParts[nameParts.length - 1],
    };
  };

  const handleLike = async () => {
    setIsLoadingLike(true);
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const email = user?.email || 'guest@example.com';
      
      const response = await fetch('/api/public/function/likeReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId: review._id,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to like review');
      }

      const data = await response.json();
      setIsLiked(data.data.liked);
      setLikeCount(data.data.likeCount);
    } catch (error) {
      console.error('Error liking review:', error);
    } finally {
      setIsLoadingLike(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const email = user?.email;

      const response = await fetch('/api/public/function/deleteReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId: review._id,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Close the dialog and notify parent component
      setOpenDeleteDialog(false);
      // Call the callback to refresh the reviews list
      if (onReviewDeleted) {
        onReviewDeleted(review._id);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isReviewAuthor = currentUser && review.email === currentUser.email;
  const reviewerNameParts = getNameParts(review.name);
  
  // Share Menu Handlers
  const handleShareClick = (event) => {
    setShareMenuAnchor(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareMenuAnchor(null);
  };

  const handleShareFacebook = () => {
    const reviewUrl = `${window.location.origin}${window.location.pathname}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(reviewUrl)}&quote=${encodeURIComponent(review.title)}`;
    window.open(facebookShareUrl, '_blank', 'width=600,height=400');
    handleShareClose();
  };

  const handleShareTwitter = () => {
    const reviewUrl = `${window.location.origin}${window.location.pathname}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(reviewUrl)}&text=${encodeURIComponent(`Check out this review: ${review.title}`)}`;
    window.open(twitterShareUrl, '_blank', 'width=600,height=400');
    handleShareClose();
  };

  const handleCopyLink = () => {
    const reviewUrl = `${window.location.origin}${window.location.pathname}`;
    navigator.clipboard.writeText(reviewUrl);
    setShowCopyToast(true);
    handleShareClose();
  };

  // Report Modal Handlers
  const handleReportOpen = () => {
    setOpenReportDialog(true);
  };

  const handleReportClose = () => {
    setOpenReportDialog(false);
    setReportFormData({ reason: '', description: '' });
  };

  const handleReportFormChange = (e) => {
    const { name, value } = e.target;
    setReportFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReportSubmit = async () => {
    if (!reportFormData.reason.trim()) {
      toast.error('Please select a reason');
      return;
    }
    
    if (!reportFormData.description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    setIsSubmittingReport(true);
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const email = user?.email || 'guest@example.com';

      // You can send the report to your backend here
      const response = await fetch('/api/public/function/reportReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId: review._id,
          reportedBy: email,
          reason: reportFormData.reason,
          description: reportFormData.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      toast.success('Report submitted successfully. Thank you for helping us maintain quality reviews.');
      handleReportClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Error submitting report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
    }
  };
  
  return (
    <Card sx={{ 
      boxShadow: 'none', 
      border: '1px solid #d0d0d0',
      backgroundColor: '#ffffff',
      transition: 'all 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        borderColor: '#1e88e5',
        boxShadow: '0 4px 12px rgba(30, 136, 229, 0.15)',
      }
    }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Reviewer Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Avatar
            src={review.profileImage || undefined}
            onContextMenu={(e) => e.preventDefault()}
            sx={{ 
              bgcolor: '#e8e8e8',
              color: '#1e88e5',
              width: 48,
              height: 48,
              mr: 2,
              fontWeight: 600,
              fontSize: '1.2rem',
              userSelect: 'none',
            }}
          >
            {!review.profileImage && getInitials(review.name)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
              <Box>
              <Typography variant="subtitle2" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                {reviewerNameParts.firstName}{reviewerNameParts.lastName ? ' ' : ''}
                {reviewerNameParts.lastName ? (
                  <Box
                    component="span"
                    sx={{
                      filter: 'blur(3px)',
                      display: 'inline-block',
                      color: '#1a1a1a',
                      userSelect: 'none',
                    }}
                  >
                    {reviewerNameParts.lastName}
                  </Box>
                ) : null}
              </Typography>
              <Typography variant="body2" sx={{ color: '#1a1a1a' }}>
                {review.brokerage}
              </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#4caf50' }}>
                <CheckCircle size={14} /> Verified
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, fontSize: '0.85rem' }}>
              <Typography sx={{ color: '#888' }}>US - 1 review</Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>
                {formatDate(review.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Rating Box */}
        <Rating 
          value={review.rating}
          readOnly 
          sx={{
            '& .MuiRating-iconFilled': {
              color: review.rating === 5 ? '#4caf50' : 
                     review.rating === 4 ? '#66bb6a' : 
                     review.rating === 3 ? '#ffd700' : 
                     review.rating === 2 ? '#ffa500' : '#ff6b6b',
            },
            '& .MuiRating-iconEmpty': {
              color: '#d0d0d0',
            }
          }}
        />

        {/* Review Title and Content */}
        <Typography variant="h6" gutterBottom sx={{ color: '#1a1a1a', mb: 1, fontWeight: 600, fontSize: '1.05rem' }}>
          {review.title}
        </Typography>
        
        <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, mb: 2.5, flex: 1 }}>
          {review.content}
        </Typography>

        {/* Company Reply Section (if exists) */}
        {review.companyReply && (
          <Box sx={{
            backgroundColor: '#f8f8f8',
            border: '1px solid #d0d0d0',
            borderRadius: '8px',
            p: 2.5,
            mb: 2.5,
            marginTop: 2,
          }}>
            {/* Company Reply Header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Avatar
                src={Logo}
                onContextMenu={(e) => e.preventDefault()}
                sx={{ 
                  bgcolor: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
                  color: '#ffffff',
                  width: 40,
                  height: 40,
                  mr: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  userSelect: 'none',
                }}
              >
                LS
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                    Reply from Connect Realm
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#888' }}>
                  {formatDate(review.createdAt)}
                </Typography>
              </Box>
            </Box>
            
            {/* Company Reply Text */}
            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.7, pl: 6.5 }}>
              Hi <strong>{review.name},</strong><br/><br/> {review.companyReply}
            </Typography>
          </Box>
        )}

        {/* Actions Footer */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          pt: 2,
          borderTop: '1px solid #d0d0d0',
        }}>
          <Button
            size="small"
            startIcon={<ThumbsUp size={16} />}
            onClick={handleLike}
            disabled={isLoadingLike}
            sx={{
              textTransform: 'none',
              color: isLiked ? '#1e88e5' : '#888',
              fontSize: '0.85rem',
              padding: '4px 8px',
              '&:hover': {
                color: '#1e88e5',
                backgroundColor: 'rgba(30, 136, 229, 0.1)',
              },
              '&:disabled': {
                opacity: 0.6,
              }
            }}
          >
            Useful {likeCount > 0 && likeCount}
          </Button>

          <Tooltip title="Share">
            <Button
              size="small"
              startIcon={<Share2 size={16} />}
              onClick={handleShareClick}
              sx={{
                textTransform: 'none',
                minWidth: '32px',
                padding: '4px',
                color: '#888',
                '&:hover': {
                  color: '#1e88e5',
                  backgroundColor: 'rgba(30, 136, 229, 0.1)',
                }
              }}
            >
              Share
            </Button>
          </Tooltip>

          {isReviewAuthor ? (
            <Button
              size="small"
              startIcon={<Trash2 size={16} />}
              onClick={() => setOpenDeleteDialog(true)}
              sx={{
                textTransform: 'none',
                color: '#888',
                fontSize: '0.85rem',
                padding: '4px 8px',
                marginLeft: 'auto',
                '&:hover': {
                  color: '#ff6b6b',
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                }
              }}
            >
              Delete
            </Button>
          ) : (
            <Button
              size="small"
              startIcon={<Flag size={16} />}
              onClick={handleReportOpen}
              sx={{
                textTransform: 'none',
                color: '#888',
                fontSize: '0.85rem',
                padding: '4px 8px',
                marginLeft: 'auto',
                '&:hover': {
                  color: '#ff6b6b',
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                }
              }}
            >
              Report
            </Button>
          )}
        </Box>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        PaperProps={{
          sx: {
            backgroundColor: '#f5f5f5',
            backgroundImage: 'none',
          }
        }}
      >
        <DialogTitle 
          id="delete-dialog-title" 
          sx={{ 
            fontWeight: 600,
            color: '#1a1a1a',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          Delete Review
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f5f5f5' }}>
          <Typography sx={{ color: '#555', mt: 2, fontSize: '0.95rem' }}>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ 
              textTransform: 'none', 
              color: '#1e88e5',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(30, 136, 229, 0.1)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: '#ff6b6b',
              color: '#ffffff',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#ff5252',
              },
              '&:disabled': {
                bgcolor: '#ffb3b3',
                color: '#ffffff',
              }
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Menu */}
      <Menu
        anchorEl={shareMenuAnchor}
        open={Boolean(shareMenuAnchor)}
        onClose={handleShareClose}
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <MenuItem 
          onClick={handleShareFacebook}
          sx={{
            textTransform: 'none',
            color: '#1a1a1a',
            display: 'flex',
            gap: 1,
            '&:hover': {
              backgroundColor: 'rgba(30, 136, 229, 0.1)',
              color: '#1e88e5',
            }
          }}
        >
          <Facebook size={18} />
          Facebook
        </MenuItem>
        <MenuItem 
          onClick={handleShareTwitter}
          sx={{
            textTransform: 'none',
            color: '#1a1a1a',
            display: 'flex',
            gap: 1,
            '&:hover': {
              backgroundColor: 'rgba(30, 136, 229, 0.1)',
              color: '#1e88e5',
            }
          }}
        >
          <Twitter size={18} />
          Twitter
        </MenuItem>
        <MenuItem 
          onClick={handleCopyLink}
          sx={{
            textTransform: 'none',
            color: '#1a1a1a',
            display: 'flex',
            gap: 1,
            '&:hover': {
              backgroundColor: 'rgba(30, 136, 229, 0.1)',
              color: '#1e88e5',
            }
          }}
        >
          <LinkIcon size={18} />
          Copy Link
        </MenuItem>
      </Menu>

      {/* Report Review Dialog */}
      <Dialog
        open={openReportDialog}
        onClose={handleReportClose}
        aria-labelledby="report-dialog-title"
        PaperProps={{
          sx: {
            backgroundColor: '#f5f5f5',
            backgroundImage: 'none',
            minWidth: { xs: '90%', sm: '500px' },
          }
        }}
      >
        <DialogTitle 
          id="report-dialog-title" 
          sx={{ 
            fontWeight: 600,
            color: '#1a1a1a',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          Report Review
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f5f5f5', pt: 3 }}>
          <Typography sx={{ color: '#555', mb: 3, fontSize: '0.95rem' }}>
            Please let us know why you're reporting this review.
          </Typography>
          
          {/* Reason Select */}
          <TextField
            select
            fullWidth
            label="Reason for Report"
            name="reason"
            value={reportFormData.reason}
            onChange={handleReportFormChange}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    backgroundColor: '#ffffff',
                    '& .MuiMenuItem-root': {
                      color: '#1a1a1a',
                      '&:hover': {
                        backgroundColor: 'rgba(30, 136, 229, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(30, 136, 229, 0.15)',
                      }
                    }
                  }
                }
              }
            }}
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                '& .MuiOutlinedInput-input': {
                  color: '#1a1a1a',
                  fontSize: '1rem',
                },
                '&:hover fieldset': {
                  borderColor: '#1e88e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1e88e5',
                }
              },
              '& label.Mui-focused': {
                color: '#1e88e5',
              }
            }}
          >
            <MenuItem value="">Select a reason...</MenuItem>
            <MenuItem value="inappropriate">Inappropriate Content</MenuItem>
            <MenuItem value="spam">Spam</MenuItem>
            <MenuItem value="fake">Fake Review</MenuItem>
            <MenuItem value="offensive">Offensive Language</MenuItem>
            <MenuItem value="irrelevant">Irrelevant</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={reportFormData.description}
            onChange={handleReportFormChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                '& .MuiOutlinedInput-input': {
                  color: '#1a1a1a',
                  fontSize: '1rem',
                },
                '&:hover fieldset': {
                  borderColor: '#1e88e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1e88e5',
                }
              },
              '& label.Mui-focused': {
                color: '#1e88e5',
                fontWeight: 600,
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
          <Button
            onClick={handleReportClose}
            disabled={isSubmittingReport}
            sx={{ 
              textTransform: 'none', 
              color: '#1e88e5',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(30, 136, 229, 0.1)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReportSubmit}
            disabled={isSubmittingReport}
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: '#1e88e5',
              color: '#ffffff',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#1565c0',
              },
              '&:disabled': {
                bgcolor: '#bbb',
                color: '#ffffff',
              }
            }}
          >
            {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Link Toast */}
      <Snackbar
        open={showCopyToast}
        autoHideDuration={3000}
        onClose={() => setShowCopyToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowCopyToast(false)}
          severity="success"
          sx={{
            backgroundColor: '#4caf50',
            color: '#ffffff',
            '& .MuiAlert-icon': {
              color: '#ffffff',
            }
          }}
        >
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </Card>
  );
}
