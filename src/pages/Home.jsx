import { Container, Box, Tabs, Tab, Button, Grid, Breadcrumbs, Typography, TextField, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";
import CompanyHeader from "../components/CompanyHeader";
import RatingDistribution from "../components/RatingDistribution";
import ReviewsSlider from "../components/ReviewsSlider";
import ReviewForm from "../components/ReviewForm";
import { mockCompany } from "../data/mockData";
import { useEffect, useState, useRef } from "react";
import LottieanimationFile from "../LottieanimationFile";
import navbarIcon from "../assets/LogoBg.png";
import { ExternalLink, PenTool, Phone, Mail, Globe, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const reviewsTabRef = useRef(null);
  const [allReviews, setAllReviews] = useState([]);
  const [reloadReviews, setReloadReviews] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState([]); // State for rating distribution
  const [loader, setLoader] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState([]); // State for selected rating filters
  const [searchKeyword, setSearchKeyword] = useState(''); // State for search input
  const [activeSearchQuery, setActiveSearchQuery] = useState(''); // State for active search query

  const avgRating = ratingDistribution.length > 0 
    ? (ratingDistribution.reduce((sum, r) => sum + (r.rating * r.count), 0) / (ratingDistribution.reduce((sum, r) => sum + r.count, 0) || 1)).toFixed(1)
    : 0;

  const totalReviews = allReviews.length;
  const reviewHealth = totalReviews > 0 ? `${avgRating} / 5` : 'No ratings yet';
  const quickStats = [
    { label: 'Reviews', value: totalReviews.toString().padStart(2, '0'), helper: 'Latest customer feedback' },
    { label: 'Average rating', value: avgRating, helper: 'Based on public reviews' },
    { label: 'Focus area', value: 'Real Estate', helper: 'Agency profile overview' },
  ];

  const insights = [
    {
      title: 'Service quality',
      description: 'A clean, professional layout helps visitors quickly understand the brand, the review volume, and the company contact points.',
    },
    {
      title: 'Review discovery',
      description: 'Search, rating filters, and the review slider remain available so users can move from discovery to action without friction.',
    },
    {
      title: 'Trust signals',
      description: 'The redesigned hero, metrics, and verification cues create a more polished first impression while preserving the core workflow.',
    },
  ];

  const services = [
    'Residential Sales',
    'Commercial Real Estate',
    'Property Management',
    'Market Analysis',
    'Investment Consulting',
    'Marketing & Listing',
  ];

  const reasons = [
    'Experienced and certified agents with deep market knowledge',
    'Cutting-edge technology for property listings and marketing',
    'Transparent pricing with no hidden fees',
    '24/7 customer support and personalized guidance',
    'Proven track record of successful transactions',
    'Comprehensive digital marketing strategies',
  ];

  const topics = [
    {
      title: 'Service',
      description: 'Users describe high-quality interactions with service and reliable support throughout the process.',
    },
    {
      title: 'Staff',
      description: 'Consumers find staff to be professional, knowledgeable, and committed to client success.',
    },
    {
      title: 'Customer Service',
      description: 'Customers consistently note responsive agents and helpful support during their journey.',
    },
    {
      title: 'Communication',
      description: 'Reviewers mention clear feedback, quick response times, and easy contact with the team.',
    },
    {
      title: 'Marketing',
      description: 'Reviewers highlight effective marketing strategies and quality lead generation support.',
    },
  ];

  const handleSearch = () => {
    setActiveSearchQuery(searchKeyword);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleOpenReviewForm = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    user ? setIsReviewFormOpen(true) : navigate('/login');
  };

  const handleCloseReviewForm = () => {
    setIsReviewFormOpen(false);
  };

  if(loader){
    return <LottieanimationFile />
  }

  const getAllReviews = async () => {
    try {
      const response = await fetch("/api/public/function/getAllReviews");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        // Sort reviews by createdAt in descending order (newest first)
        const sortedData = [...data].sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setAllReviews(sortedData);
        calculateRatingDistribution(sortedData); // Calculate rating distribution
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const calculateRatingDistribution = (reviews) => {
    // Initialize an array for ratings 1-5
    const distribution = [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 0 },
      { rating: 5, count: 0 },
    ];

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1].count += 1; // Increment the count for the corresponding rating
      }
    });

    setRatingDistribution(distribution); // Update the state with the new distribution
  };

  const handleRatingFilterChange = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
    
    // Set active tab to Reviews and scroll to it
    setTimeout(() => {
      setActiveTab(0);
      if (reviewsTabRef.current) {
        reviewsTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };

  // Filter reviews based on selected ratings and search query
  const filteredReviews = allReviews.filter(review => {
    // Filter by rating if ratings are selected
    const ratingMatch = selectedRatings.length > 0 ? selectedRatings.includes(review.rating) : true;
    
    // Filter by search query (search in review text, reviewer name, and title)
    const searchMatch = activeSearchQuery === '' || 
      (review.reviewText && review.reviewText.toLowerCase().includes(activeSearchQuery.toLowerCase())) ||
      (review.name && review.name.toLowerCase().includes(activeSearchQuery.toLowerCase())) ||
      (review.reviewerName && review.reviewerName.toLowerCase().includes(activeSearchQuery.toLowerCase())) ||
      (review.title && review.title.toLowerCase().includes(activeSearchQuery.toLowerCase()));
    
    return ratingMatch && searchMatch;
  });

  useEffect(() => {
    getAllReviews();
  }, [reloadReviews]);

  const handleReviewDeleted = (reviewId) => {
    // Refetch all reviews to get the updated list
    getAllReviews();
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f7f4ef 0%, #eef2f7 100%)',
      color: '#0f172a',
      py: { xs: 2, md: 3 },
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2.5, md: 4 } }}>
        <Box sx={{
          backgroundColor: 'rgba(255,255,255,0.86)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: { xs: 2, md: 2 },
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.06)',
        }}>
          <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 2, md: 3 }, pb: { xs: 2.5, md: 3.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ minWidth: 0, maxWidth: 850 }}>
                <Breadcrumbs
                  sx={{
                    color: '#64748b',
                    '& .MuiBreadcrumbs-separator': { mx: 1 },
                    '& .MuiTypography-root': {
                      color: 'inherit',
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    },
                  }}
                >
                  <Typography sx={{ display: { xs: 'none', md: 'block' } }}>Real Estate</Typography>
                  <Typography>Agency Reviews</Typography>
                  <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>Connect Realm</Typography>
                </Breadcrumbs>

                <Typography variant="h4" sx={{ mt: 1.1, fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 1.04, fontSize: { xs: '1.7rem', sm: '2.25rem', md: '3rem' }, background: 'linear-gradient(135deg, #1e88e5 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Connect Realm reviews
                </Typography>
                <Typography sx={{ mt: 1, color: '#475569', maxWidth: 760, lineHeight: 1.75, fontSize: { xs: '0.92rem', sm: '0.98rem' } }}>
                  A restrained, premium review page for exploring customer feedback, checking the company profile, and taking action without visual noise.
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 2.5 }}>
                  <Box sx={{ px: 1.5, py: 0.8, borderRadius: 999, backgroundColor: 'rgba(34, 197, 94, 0.10)', color: '#15803d', border: '1px solid rgba(34, 197, 94, 0.22)', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 0.8 }}>
                    <Check size={14} strokeWidth={3} />
                    Claimed profile
                  </Box>
                  <Box sx={{ px: 1.5, py: 0.8, borderRadius: 999, backgroundColor: 'rgba(15, 23, 42, 0.05)', color: '#334155', border: '1px solid rgba(148, 163, 184, 0.18)', fontSize: '0.82rem', fontWeight: 700 }}>
                    {reviewHealth}
                  </Box>
                  <Box sx={{ px: 1.5, py: 0.8, borderRadius: 999, backgroundColor: 'rgba(14, 165, 233, 0.08)', color: '#0369a1', border: '1px solid rgba(14, 165, 233, 0.14)', fontSize: '0.82rem', fontWeight: 700 }}>
                    {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ flexShrink: 0 }}>
                <CompanyHeader
                  company={mockCompany}
                  setReloadReviews={setReloadReviews}
                  isReviewFormOpen={isReviewFormOpen}
                  setIsReviewFormOpen={setIsReviewFormOpen}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: { xs: 2.5, md: 4 } }}>
            <Grid container spacing={2.5} alignItems="stretch">
              <Grid item xs={12} lg={8}>
                <Box sx={{
                  height: '100%',
                  p: { xs: 2.25, sm: 3, md: 3.5 },
                  borderRadius: 2,
                  background: 'linear-gradient(180deg, #ffffff 0%, #fbf7f1 100%)',
                  border: '1px solid rgba(148, 163, 184, 0.18)',
                }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={7}>
                      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 2.5 }, alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Box sx={{ p: 1.2, borderRadius: 5, border: '1px solid rgba(148, 163, 184, 0.18)', backgroundColor: '#fff', boxShadow: '0 12px 24px rgba(15, 23, 42, 0.04)' }}>
                          <img
                            src={navbarIcon}
                            alt="Company logo"
                            style={{
                              display: 'block',
                              width: '100%',
                              maxWidth: '150px',
                              minWidth: '120px',
                              height: 'auto',
                            }}
                          />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 850, letterSpacing: '-0.05em', fontSize: { xs: '1.5rem', sm: '1.95rem', md: '2.2rem' } }}>
                            {mockCompany.name}
                          </Typography>
                          <Typography sx={{ mt: 1, color: '#475569', lineHeight: 1.75, maxWidth: 620, fontSize: { xs: '0.92rem', sm: '0.98rem' } }}>
                            Professional real estate company profile with reviews, rating distribution, and contact options presented in a clean, trustworthy format.
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap', mt: 2.25 }}>
                        <Button
                          onClick={handleOpenReviewForm}
                          sx={{
                            backgroundColor: '#111827',
                            color: '#fff',
                            borderRadius: 2,
                            px: 2.5,
                            py: 1.1,
                            textTransform: 'none',
                            fontWeight: 700,
                            boxShadow: '0 10px 24px rgba(17, 24, 39, 0.12)',
                            '&:hover': {
                              backgroundColor: '#111827',
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          <PenTool size={17} />
                          Write a review
                        </Button>
                        <Button
                          href={mockCompany.website.startsWith('http') ? mockCompany.website : `https://${mockCompany.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          sx={{
                            color: '#0f172a',
                            borderColor: 'rgba(180, 83, 9, 0.18)',
                            borderRadius: 2,
                            px: 2.5,
                            py: 1.1,
                            textTransform: 'none',
                            fontWeight: 700,
                            backgroundColor: '#fff',
                            '&:hover': {
                              borderColor: '#b45309',
                              color: '#92400e',
                              backgroundColor: 'rgba(180, 83, 9, 0.04)',
                            },
                          }}
                        >
                          Visit website
                          <ExternalLink size={17} />
                        </Button>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Box sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 2,
                        backgroundColor: '#fff',
                        border: '1px solid rgba(148, 163, 184, 0.18)',
                      }}>
                        <Typography sx={{ color: '#1e88e5', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
                          Rating overview
                        </Typography>
                        <RatingDistribution
                          distribution={ratingDistribution}
                          selectedRatings={selectedRatings}
                          onRatingFilterChange={handleRatingFilterChange}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Grid container spacing={2.5}>
                  {quickStats.map((stat) => (
                    <Grid item xs={12} sm={4} lg={12} key={stat.label}>
                      <Box sx={{
                        height: '100%',
                        p: 2.2,
                        borderRadius: 2,
                        backgroundColor: '#fff',
                        border: '1px solid rgba(148, 163, 184, 0.18)',
                        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
                      }}>
                        <Typography sx={{ color: '#64748b', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {stat.label}
                        </Typography>
                        <Typography sx={{ mt: 0.6, color: '#0f172a', fontWeight: 850, fontSize: { xs: '1.3rem', sm: '1.45rem' } }}>
                          {stat.value}
                        </Typography>
                        <Typography sx={{ mt: 0.4, color: '#64748b', fontSize: '0.84rem', lineHeight: 1.6 }}>
                          {stat.helper}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{
                  borderRadius: 2,
                  border: '1px solid rgba(148, 163, 184, 0.18)',
                  backgroundColor: '#fff',
                  overflow: 'hidden',
                }}>
                  <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 } }}>
                    <Tabs
                      value={activeTab}
                      onChange={(e, newValue) => setActiveTab(newValue)}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        minHeight: 'unset',
                        '& .MuiTabs-indicator': {
                          height: 3,
                          borderRadius: 999,
                          background: 'linear-gradient(90deg, #1e88e5 0%, #0891b2 100%)',
                        },
                        '& .MuiTab-root': {
                          minHeight: 'unset',
                          py: 1.3,
                          px: { xs: 1.5, sm: 2.5 },
                          mr: 0.75,
                          textTransform: 'none',
                          fontWeight: 700,
                          color: '#64748b',
                          borderRadius: 999,
                          '&.Mui-selected': {
                            color: '#0f172a',
                            backgroundColor: 'rgba(30, 136, 229, 0.08)',
                          },
                        },
                      }}
                    >
                      <Tab label="Reviews" />
                      <Tab label="Summary" />
                      <Tab label="About" />
                      <Tab label="Contact" />
                    </Tabs>
                  </Box>

                  <Box ref={reviewsTabRef} sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2.5, sm: 3.5 }, pt: 2 }}>
                    {activeTab === 0 && (
                      <Box>
                        <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
                          <Grid item xs={12} md={7}>
                            <Box sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, backgroundColor: 'rgba(30, 136, 229, 0.04)', border: '1px solid rgba(148, 163, 184, 0.16)' }}>
                              <Typography sx={{ color: '#0f172a', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                                Browse and filter reviews
                              </Typography>
                              <Typography sx={{ mt: 1, color: '#64748b', lineHeight: 1.7, fontSize: { xs: '0.88rem', sm: '0.95rem' } }}>
                                Search by name, title, or keyword and use the rating distribution to focus on the most relevant feedback.
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <Box sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, background: 'linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%)', border: '1px solid rgba(148, 163, 184, 0.16)' }}>
                              <TextField
                                fullWidth
                                placeholder="Search reviews..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyDown={handleKeyPress}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#1e88e5' }}>
                                        <Search size={18} />
                                      </Box>
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 999,
                                    backgroundColor: '#fff',
                                    '& fieldset': {
                                      borderColor: 'rgba(148, 163, 184, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#1e88e5',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#1e88e5',
                                    },
                                  },
                                }}
                              />
                              <Button
                                onClick={handleSearch}
                                fullWidth
                                sx={{
                                  mt: 1.5,
                                  borderRadius: 999,
                                  textTransform: 'none',
                                  fontWeight: 700,
                                  backgroundColor: '#1e88e5',
                                  color: '#fff',
                                  '&:hover': {
                                    backgroundColor: '#0891b2',
                                  },
                                }}
                              >
                                Search reviews
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>

                        <ReviewsSlider reviews={filteredReviews} onReviewDeleted={handleReviewDeleted} />
                      </Box>
                    )}

                    {activeTab === 1 && (
                      <Box sx={{ display: 'grid', gap: 2.5 }}>
                        <Box sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, backgroundColor: 'rgba(15, 23, 42, 0.02)', border: '1px solid rgba(148, 163, 184, 0.16)' }}>
                          <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 800, fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
                            Review summary
                          </Typography>
                          <Typography sx={{ mt: 1, color: '#64748b', fontSize: '0.88rem' }}>
                            Created with AI, based on recent reviews
                          </Typography>
                          <Typography sx={{ mt: 2, color: '#334155', lineHeight: 1.8, fontSize: { xs: '0.92rem', sm: '1rem' } }}>
                            Looking at {totalReviews} reviews, reviewers consistently point to professionalism, responsiveness, and dependable support. The company presents well in public feedback, with a steady pattern of service-related praise.
                          </Typography>
                        </Box>

                        <Grid container spacing={2}>
                          {topics.map((topic) => (
                            <Grid item xs={12} sm={6} md={4} key={topic.title}>
                              <Box sx={{
                                p: 2.25,
                                borderRadius: 5,
                                border: '1px solid rgba(148, 163, 184, 0.16)',
                                backgroundColor: '#fff',
                                height: '100%',
                              }}>
                                <Typography sx={{ color: '#1e88e5', fontWeight: 800, mb: 0.8, fontSize: '0.95rem' }}>
                                  {topic.title}
                                </Typography>
                                <Typography sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.7 }}>
                                  {topic.description}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    {activeTab === 2 && (
                      <Box sx={{ display: 'grid', gap: 2.5 }}>
                        <Box sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, backgroundColor: 'rgba(15, 23, 42, 0.02)', border: '1px solid rgba(148, 163, 184, 0.16)' }}>
                          <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 800, mb: 1.2, fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
                            About Connect Realm
                          </Typography>
                          <Typography sx={{ color: '#334155', lineHeight: 1.8, fontSize: { xs: '0.92rem', sm: '1rem' } }}>
                            Connect Realm is a real estate agency focused on connecting qualified buyers and sellers with premium properties. This section keeps the information direct and polished, with a restrained presentation that matches the rest of the page.
                          </Typography>
                        </Box>

                        <Grid container spacing={2}>
                          {services.map((service) => (
                            <Grid item xs={12} sm={6} md={4} key={service}>
                              <Box sx={{ p: 2.25, borderRadius: 5, backgroundColor: '#fff', border: '1px solid rgba(148, 163, 184, 0.16)' }}>
                                <Typography sx={{ color: '#1e88e5', fontWeight: 800, mb: 0.8, fontSize: '0.93rem' }}>
                                  {service}
                                </Typography>
                                <Typography sx={{ color: '#64748b', fontSize: '0.84rem', lineHeight: 1.7 }}>
                                  Professional support and guidance tailored to the needs of buyers, sellers, and property owners.
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>

                        <Box sx={{ p: { xs: 2.25, sm: 3 }, borderRadius: 5, backgroundColor: '#0f172a', color: '#fff' }}>
                          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, mb: 1.2, fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
                            Our Mission & Values
                          </Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.8, mb: 1.5, fontSize: { xs: '0.92rem', sm: '1rem' } }}>
                            Mission: To empower individuals and businesses in their real estate journey with exceptional service and practical solutions.
                          </Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.8, fontSize: { xs: '0.92rem', sm: '1rem' } }}>
                            Core values: integrity, transparency, excellence, client-first service, innovation, and community commitment.
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {activeTab === 3 && (
                      <Box sx={{ display: 'grid', gap: 2.5 }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 800, mb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                            Get in Touch
                          </Typography>
                          <Typography sx={{ color: '#64748b', fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
                            Use the contact methods below to connect with the company.
                          </Typography>
                        </Box>

                        <Grid container spacing={2}>
                          {[
                            { label: 'Phone', href: `tel:${mockCompany.phone}`, value: mockCompany.phone, helper: 'Call us', icon: Phone },
                            { label: 'Email', href: `mailto:${mockCompany.email}`, value: mockCompany.email, helper: 'Send email', icon: Mail },
                            { label: 'Website', href: mockCompany.website.startsWith('http') ? mockCompany.website : `https://${mockCompany.website}`, value: mockCompany.website, helper: 'Visit site', icon: Globe, external: true },
                          ].map((contact) => {
                            const Icon = contact.icon;
                            return (
                              <Grid item xs={12} sm={6} md={4} key={contact.label}>
                                <Box
                                  component="a"
                                  href={contact.href}
                                  target={contact.external ? '_blank' : undefined}
                                  rel={contact.external ? 'noopener noreferrer' : undefined}
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    p: { xs: 2.25, sm: 3 },
                                    borderRadius: 5,
                                    backgroundColor: '#fff',
                                    border: '1px solid rgba(148, 163, 184, 0.16)',
                                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                                    '&:hover': {
                                      transform: 'translateY(-2px)',
                                      borderColor: '#1e88e5',
                                    },
                                  }}
                                >
                                  <Box sx={{ p: 1.5, mb: 2, borderRadius: '50%', backgroundColor: 'rgba(30, 136, 229, 0.08)', color: '#1e88e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={24} strokeWidth={2.2} />
                                  </Box>
                                  <Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.7 }}>
                                    {contact.label}
                                  </Typography>
                                  <Typography sx={{ color: '#0f172a', fontSize: { xs: '0.92rem', sm: '1rem' }, fontWeight: 800, textAlign: 'center', wordBreak: 'break-word' }}>
                                    {contact.value}
                                  </Typography>
                                  <Typography sx={{ color: '#1e88e5', fontSize: '0.82rem', fontWeight: 700, mt: 1.4 }}>
                                    {contact.helper} →
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>

                        <Box sx={{ p: { xs: 2.25, sm: 3 }, borderRadius: 5, border: '1px solid rgba(148, 163, 184, 0.16)', backgroundColor: 'rgba(30, 136, 229, 0.04)', textAlign: 'center' }}>
                          <Typography sx={{ color: '#0f172a', fontWeight: 800, mb: 0.8 }}>
                            Prefer another way to connect?
                          </Typography>
                          <Typography sx={{ color: '#64748b', fontSize: { xs: '0.9rem', sm: '0.95rem' }, lineHeight: 1.7 }}>
                            Our team is available to help with any questions or concerns you may have about our services.
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

      <ReviewForm
        open={isReviewFormOpen}
        onClose={handleCloseReviewForm}
        setReloadReviews={setReloadReviews}
      />
    </Box>
  );
}