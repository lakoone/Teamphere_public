import React from 'react';
import { Skeleton, Avatar, Grid } from '@mui/material';
import { Colors } from '@/styles/colors/colors';
import { motion } from 'framer-motion';
import { Box } from '@mui/system';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
};
const ChatSkeleton = () => {
  const skeletonMessages = Array.from(new Array(10));

  return (
    <motion.div
      style={{ width: '100%' }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          maxHeight: '100%',
          maxWidth: 1500,
          mx: 'auto',
          p: 2,
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          boxShadow: 1,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '60px',
            position: 'absolute',
            top: '0px',
            zIndex: 10,
            backgroundColor: Colors.BACKGROUND,
          }}
        ></Box>
        {skeletonMessages.map((_, index) => (
          <Grid
            container
            spacing={2}
            key={index}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            {/* Avatar Skeleton */}
            <Grid item>
              <Skeleton animation={'wave'} variant="circular">
                <Avatar />
              </Skeleton>
            </Grid>

            {/* Message Skeleton */}
            <Grid item xs>
              <Skeleton
                animation={'wave'}
                variant="text"
                width="30%"
                sx={{ mt: 0.5 }}
              />
              <Skeleton
                animation={'wave'}
                variant="rectangular"
                height={50}
                width="80%"
                sx={{ borderRadius: 1, maxWidth: 600 }}
              />
            </Grid>
          </Grid>
        ))}
      </Box>
    </motion.div>
  );
};

export default ChatSkeleton;
