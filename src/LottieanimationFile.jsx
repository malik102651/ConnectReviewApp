import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Box } from '@mui/material';

const LottieanimationFile = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f8fbff',
    }}>
      <DotLottieReact
        src="https://lottie.host/27a7906e-d8eb-4116-b389-2fada9668a61/u11VWmxysT.lottie"
        loop
        autoplay
        speed={3}
        style={{ width: '10%', height: '10%' }}
      />
    </Box>
  );
};

export default LottieanimationFile;