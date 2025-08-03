import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  CheckCircle, 
  Sparkles, 
  Image as ImageIcon, 
  Share2, 
  Heart, 
  Eye, 
  Maximize2,
  Copy,
  ExternalLink,
  Zap
} from 'lucide-react';
import SafeImage from './SafeImage';
import './ResultDisplay.css';

const ResultDisplay = ({ image, onDownload, outputFormat = 'png' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset states when image changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setIsFullscreen(false);
    setShowShareMenu(false);
  }, [image?.url]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(image.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تصویر بهبود یافته با هوش مصنوعی',
          text: 'نگاهی به این تصویر فوق‌العاده که با هوش مصنوعی ساخته شده!',
          url: image.url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  if (!image || !image.url) {
    return (
      <motion.div 
        className="result-error"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="error-content">
          <ImageIcon className="error-icon" size={48} />
          <h3>خطا در نمایش تصویر</h3>
          <p>متأسفانه تصویر قابل نمایش نیست. لطفاً دوباره تلاش کنید.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        className="result-display-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Success Header with Enhanced Animation */}
        <motion.div
          className="result-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="success-badge">
            <motion.div
              className="success-icon-wrapper"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.4, 
                duration: 0.8, 
                type: "spring", 
                stiffness: 200,
                damping: 15
              }}
            >
              <CheckCircle className="success-icon" size={28} />
              <motion.div
                className="success-ring"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ 
                  delay: 0.6,
                  duration: 1,
                  ease: "easeOut"
                }}
              />
            </motion.div>
            <div className="success-text">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                🎉 تصویر شما آماده است!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                با کیفیت فوق‌العاده و جزئیات بی‌نظیر
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Image Display */}
        <motion.div
          className="result-image-wrapper"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <div className="image-container">
            {/* Loading State */}
            <AnimatePresence>
              {!imageLoaded && !imageError && (
                <motion.div
                  className="image-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="loading-spinner">
                    <Sparkles className="spinner-icon" size={32} />
                  </div>
                  <p>در حال بارگذاری تصویر...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image Frame with Glow Effect */}
            <motion.div
              className="image-frame"
              animate={imageLoaded ? {
                boxShadow: [
                  "0 0 30px rgba(139, 92, 246, 0.4)",
                  "0 0 60px rgba(139, 92, 246, 0.6)",
                  "0 0 30px rgba(139, 92, 246, 0.4)"
                ]
              } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <SafeImage 
                src={image.url} 
                alt="تصویر بهبود یافته" 
                className={`result-image ${imageLoaded ? 'loaded' : ''}`}
                fallbackType="general"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              
              {/* Image Overlay Controls */}
              <AnimatePresence>
                {imageLoaded && (
                  <motion.div
                    className="image-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="overlay-controls">
                      <motion.button
                        className="overlay-btn"
                        onClick={() => setIsFullscreen(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Maximize2 size={20} />
                      </motion.button>
                      <motion.button
                        className="overlay-btn"
                        onClick={handleShare}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Share2 size={20} />
                      </motion.button>
                      <motion.button
                        className="overlay-btn"
                        onClick={handleCopyLink}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Image Info */}
        <motion.div
          className="image-info-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="info-card">
            <ImageIcon className="info-icon" size={20} />
            <div className="info-content">
              <span className="info-label">فرمت</span>
              <span className="info-value">{outputFormat.toUpperCase()}</span>
            </div>
          </div>
          <div className="info-card">
            <Sparkles className="info-icon" size={20} />
            <div className="info-content">
              <span className="info-label">کیفیت</span>
              <span className="info-value">فوق‌العاده</span>
            </div>
          </div>
          <div className="info-card">
            <Zap className="info-icon" size={20} />
            <div className="info-content">
              <span className="info-label">وضعیت</span>
              <span className="info-value">آماده دانلود</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Action Buttons */}
        <motion.div
          className="action-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <motion.button
            className="primary-action-btn download-btn"
            onClick={onDownload}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 50px rgba(139, 92, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="btn-content"
              whileHover={{ x: -3 }}
            >
              <Download size={22} />
              <span>دانلود با کیفیت بالا</span>
            </motion.div>
            <motion.div
              className="btn-shine"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut"
              }}
            />
          </motion.button>

          <motion.button
            className="secondary-action-btn"
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={20} />
            <span>اشتراک‌گذاری</span>
          </motion.button>
        </motion.div>

        {/* Quality Badge */}
        <motion.div
          className="quality-badge"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
        >
          <Sparkles size={16} />
          <span>ساخته شده با هوش مصنوعی</span>
        </motion.div>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fullscreen-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              className="fullscreen-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SafeImage 
                src={image.url} 
                alt="تصویر بهبود یافته - نمای کامل" 
                className="fullscreen-image"
              />
              <button 
                className="close-fullscreen"
                onClick={() => setIsFullscreen(false)}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResultDisplay;