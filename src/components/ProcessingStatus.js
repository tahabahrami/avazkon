import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ProcessingStatus = ({ progress = 0 }) => {
  const getStatusText = () => {
    if (progress < 15) return 'آماده‌سازی هوش مصنوعی پیشرفته...';
    if (progress < 30) return 'تحلیل هوشمند محتوای تصویر...';
    if (progress < 50) return 'اعمال بهبودهای حرفه‌ای...';
    if (progress < 70) return 'تنظیم دقیق کیفیت و جزئیات...';
    if (progress < 85) return 'بهینه‌سازی نهایی تصویر...';
    if (progress < 95) return 'آماده‌سازی نتیجه نهایی...';
    return 'تکمیل فرآیند با موفقیت!';
  };

  const getProgressStage = () => {
    if (progress < 25) return 'مرحله تحلیل';
    if (progress < 50) return 'مرحله پردازش';
    if (progress < 75) return 'مرحله بهبود';
    if (progress < 95) return 'مرحله نهایی‌سازی';
    return 'تکمیل شده';
  };

  return (
    <motion.div 
      className="processing-status"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div 
        className="processing-icon"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles size={64} color="#ffd700" />
      </motion.div>
      
      <motion.div 
        className="processing-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        بهبود تصویر با هوش مصنوعی
      </motion.div>
      
      <motion.div
        style={{
          fontSize: '1rem',
          fontWeight: '500',
          color: 'var(--primary)',
          marginBottom: 'var(--space-2)',
          textAlign: 'center'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {getProgressStage()}
      </motion.div>
      
      <motion.div 
        className="progress-bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        style={{ transformOrigin: 'left' }}
      >
        <motion.div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.div>
      
      <motion.div 
        className="progress-text"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        {getStatusText()}
      </motion.div>
      
      <motion.div
        style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          marginBottom: 'var(--space-2)'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4, ease: "backOut" }}
      >
        {progress}%
      </motion.div>
      
      <motion.div
        style={{
          fontSize: '0.9rem',
          fontWeight: '500',
          color: 'var(--gray-600)',
          textAlign: 'center',
          opacity: 0.8
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        initial={{ opacity: 0 }}
      >
        لطفاً صبر کنید، در حال پردازش...
      </motion.div>
    </motion.div>
  );
};

export default ProcessingStatus;