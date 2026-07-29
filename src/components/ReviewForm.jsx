import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Rating,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';


export default function ReviewForm({ open, onClose, setReloadReviews }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  let user = JSON.parse(localStorage.getItem("user"));

  // Generate professional reply based on rating and review content
  const generateProfessionalReply = () => {
    const replies = {
      5: [
        "Thank you for your positive feedback! We truly appreciate your support and are delighted to know you had a great experience with us. We look forward to continuing to work with you.",
      ],
      4: [
        "Thank you for your positive feedback! We truly appreciate your support and are delighted to know you had a great experience with us. We look forward to continuing to work with you.",
      ],
      3: [
        "Thank you for sharing your experience. We're glad to hear some aspects met your expectations, and we appreciate your feedback on where we can improve. Your support helps us continue enhancing our service.",
      ],
      2: [
        "Thank you for your feedback. We truly value your input and are always committed to improving our service. Your comments help us grow, and we appreciate the opportunity to do better.",
      ],
      1: [
        "Thank you for your feedback. We truly value your input and are always committed to improving our service. Your comments help us grow, and we appreciate the opportunity to do better.",
      ],
    };

    const ratingKey = Math.max(1, Math.min(5, Math.floor(rating)));
    const repliesList = replies[ratingKey] || replies[3];
    return repliesList[Math.floor(Math.random() * repliesList.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const companyReply = generateProfessionalReply();
    try {
      const response = await fetch("/api/public/function/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, title, content, companyReply, name: user.firstName + " " + user.lastName, email: user.email, profileImage: user.profileImage, brokerage: user.brokerage }),
      });

      const result = await response.json();
      // if(result.message){
      //   setRating(0);
      //   setTitle('');
      //   setContent('');
      //   onClose();
      //   return toast.error(result.message);
      // }

      if (result.status === "success") {
        setReloadReviews(true);
        toast.success("Review Uploaded Successfully!");
        setRating(0);
        setTitle('');
        setContent('');
        onClose();
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!"); 
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#ffffff',
          backgroundImage: 'none',
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2.5, 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #d0d0d0',
        backgroundColor: '#ffffff',
      }}>
        <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
          Write a review
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ 
            color: '#888',
            '&:hover': {
              color: '#1e88e5',
            }
          }}
        >
          <X />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ backgroundColor: '#ffffff' }}>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ color: '#1a1a1a', fontWeight: 600, mb: 1.5 }}>
              Rate your experience
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#ffc107',
                },
                '& .MuiRating-iconEmpty': {
                  color: '#d0d0d0',
                }
              }}
            />
          </Box>

          <TextField
            autoFocus
            margin="dense"
            label="Title of your review"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#1a1a1a',
                '& fieldset': {
                  borderColor: '#d0d0d0',
                },
                '&:hover fieldset': {
                  borderColor: '#1e88e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1e88e5',
                  boxShadow: '0 0 0 3px rgba(30, 136, 229, 0.1)',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#bbb',
                opacity: 1,
              },
              '& label': {
                color: '#666',
                '&.Mui-focused': {
                  color: '#1e88e5',
                },
              },
            }}
          />

          <TextField
            label="Your review"
            multiline
            rows={4}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Describe your experience (required)"
            helperText="Your review must be at least 10 characters long"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#1a1a1a',
                '& fieldset': {
                  borderColor: '#d0d0d0',
                },
                '&:hover fieldset': {
                  borderColor: '#1e88e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1e88e5',
                  boxShadow: '0 0 0 3px rgba(30, 136, 229, 0.1)',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#bbb',
                opacity: 1,
              },
              '& label': {
                color: '#666',
                '&.Mui-focused': {
                  color: '#1e88e5',
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#666',
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #d0d0d0', backgroundColor: '#ffffff' }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{
              borderColor: '#d0d0d0',
              color: '#666',
              '&:hover': {
                borderColor: '#1e88e5',
                color: '#1e88e5',
                backgroundColor: 'rgba(30, 136, 229, 0.05)',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{ 
              bgcolor: '#1e88e5',
              color: '#ffffff',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#1565c0',
                boxShadow: '0 8px 24px rgba(30, 136, 229, 0.3)',
              }
            }}
          >
            Post review
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
