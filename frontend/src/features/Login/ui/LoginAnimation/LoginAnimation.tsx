'use client';
import styles from './LoginAnimation.module.scss';
import ProjectIcon from '@/shared/icons/ProjectIcon';
import Lottie from 'lottie-react';
import AfterAnimation from '@/../public/animations/AfterAnimation.json';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const LoginAnimation: React.FC = () => {
  const t = useTranslations('Login');
  const pathname = usePathname();
  return (
    <div key={pathname} className={styles.container}>
      <motion.div
        initial={{ opacity: 0, x: -200 }}
        transition={{ duration: 1, ease: 'backInOut' }}
        animate={{ x: 0, opacity: 1 }}
      >
        <section className={styles.title}>
          <ProjectIcon />
          <Typography
            sx={{
              whiteSpace: 'break-spaces',
            }}
            fontWeight={'bold'}
            variant={'h4'}
            component={'h2'}
          >
            {t('Title')}
          </Typography>
        </section>
      </motion.div>
      <section className={styles.animations}>
        {/*<motion.div*/}
        {/*  initial={{ opacity: 0, x: -100 }}*/}
        {/*  animate={{ x: 0, opacity: 1 }}*/}
        {/*  transition={{ duration: 1, delay: 1.5, ease: 'backInOut' }}*/}
        {/*>*/}
        {/*  <div className={styles.animation}>*/}
        {/*    <Typography*/}
        {/*      sx={{*/}
        {/*        color: Colors.SURFACE,*/}
        {/*      }}*/}
        {/*      fontWeight={'bold'}*/}
        {/*      variant={'h5'}*/}
        {/*      component={'p'}*/}
        {/*    >*/}
        {/*      {t('Before')}*/}
        {/*    </Typography>*/}
        {/*    <Lottie animationData={BeforeAnimation} />*/}
        {/*  </div>*/}
        {/*</motion.div>*/}
        {/*<motion.div*/}
        {/*  className={styles.Boxider}*/}
        {/*  initial={{ opacity: 0, height: 0 }}*/}
        {/*  animate={{ x: 0, opacity: 1, height: '70%' }}*/}
        {/*  transition={{ duration: 1, delay: 3, ease: 'backInOut' }}*/}
        {/*></motion.div>*/}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 1, delay: 1, ease: 'anticipate' }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className={styles.animation}>
            <Lottie animationData={AfterAnimation} />
          </div>
        </motion.div>
      </section>
    </div>
  );
};
