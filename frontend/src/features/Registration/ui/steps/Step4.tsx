'use client';
import styles from './Steps.module.scss';
import { useTranslations } from 'next-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useData } from '@/providers/RegistrationContext/DataProvider';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DropzoneFileInput } from '@/shared/components/DropzoneFileInput';
import Image from 'next/image';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const Step4 = () => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const tValidation = useTranslations('Validations');
  const t = useTranslations('Registration');
  const context = useData();
  const schema = z.object({
    img: z.array(
      z.instanceof(File).refine((file) => file.type.startsWith('image/'), {
        message: tValidation('PhotoValidation'),
      }),
    ),
  });
  type LoginData = z.infer<typeof schema>;
  const { setValue, handleSubmit, formState } = useForm<LoginData>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
    defaultValues: {
      img: [],
    },
  });
  useEffect(() => {
    if (context.data?.img) {
      const url = URL.createObjectURL(context.data.img);
      setPreviewUrl(url);
      setValue('img', [context.data.img], { shouldValidate: true });
    }
  }, []);

  const handleInputChange = (file: File) => {
    setValue('img', [file], { shouldValidate: true });
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
  };
  const onSubmit: SubmitHandler<LoginData> = (data) => {
    context.setSteps!(context.step! + 1);
    context.setValues && data.img && context.setValues({ img: data.img[0] });
  };
  return (
    <div className={styles.container}>
      <form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
        {previewUrl && !formState.errors.img && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <Image
              style={{ borderRadius: '50%' }}
              width={200}
              height={200}
              src={previewUrl}
              alt={'img'}
            />
          </motion.div>
        )}
        <div className={styles.dropzoneContainer}>
          <DropzoneFileInput handleInputChange={handleInputChange} />
        </div>
        <motion.div
          className={styles.Buttons}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => {
              context.setSteps!(context.step! - 1);
            }}
            color={'inherit'}
            variant={'contained'}
          >
            {t('Back')}
          </Button>

          <Button
            sx={{
              marginLeft: 'auto',
            }}
            type={'submit'}
            variant={'contained'}
          >
            {t('Next')}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};
