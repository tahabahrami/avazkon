import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Image, Wand2, Sparkles, Zap, Clock } from 'lucide-react';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';
import './LoadingStates.css';

const LoadingStates = ({
  type = 'default', // 'default', 'image-upload', 'processing', 'generating', 'analyzing'
  message = '',
  progress = 0,
  showProgress = false,
  size = 'medium', // 'small', 'medium', 'large'
  animated = true,
  className = '',
  steps = [], // Array of step objects: { label, status: 'pending'|'active'|'completed' }
  currentStep = 0
}) => {
  const getLoadingIcon = () => {
    switch (type) {
      case 'image-upload':
        return <Image className="loading-icon" />;
      case 'processing':
        return <Wand2 className="loading-icon" />;
      case 'generating':
        return <Sparkles className="loading-icon" />;
      case 'analyzing':
        return <Zap className="loading-icon" />;
      default:
        return <Loader2 className="loading-icon spinning" />;
    }
  };

  const getLoadingMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'image-upload':
        return 'آپلود تصاویر...';
      case 'processing':
        return 'پردازش تصاویر...';
      case 'generating':
        return 'تولید تصویر جدید...';
      case 'analyzing':
        return 'تجزیه و تحلیل...';
      default:
        return 'در حال بارگذاری...';
    }
  };

  const renderSteps = () => {
    if (!steps.length) return null;

    return (
      <div className="loading-steps">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isPending = index > currentStep;

          return (
            <motion.div
              key={index}
              className={`loading-step ${
                isCompleted ? 'completed' : isActive ? 'active' : 'pending'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="step-indicator">
                {isCompleted ? (
                  <motion.div
                    className="step-check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    ✓
                  </motion.div>
                ) : isActive ? (
                  <motion.div
                    className="step-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 size={12} />
                  </motion.div>
                ) : (
                  <div className="step-number">{index + 1}</div>
                )}
              </div>
              <div className="step-content">
                <div className="step-label">{step.label}</div>
                {step.description && (
                  <div className="step-description">{step.description}</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderSkeletonLoader = () => {
    return (
      <div className="skeleton-loader">
        <div className="skeleton-lines">
          <div className="skeleton-line long" />
          <div className="skeleton-line medium" />
          <div className="skeleton-line short" />
        </div>
      </div>
    );
  };

  const renderPulseLoader = () => {
    return (
      <div className="pulse-loader">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            className="pulse-dot"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  };

  const renderWaveLoader = () => {
    return (
      <div className="wave-loader">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            className="wave-bar"
            animate={{
              scaleY: [1, 2, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.1,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  };

  const renderSpinnerVariants = () => {
    switch (type) {
      case 'skeleton':
        return renderSkeletonLoader();
      case 'pulse':
        return renderPulseLoader();
      case 'wave':
        return renderWaveLoader();
      default:
        return (
          <motion.div
            className="loading-spinner"
            animate={animated ? { rotate: 360 } : {}}
            transition={animated ? {
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            } : {}}
          >
            {getLoadingIcon()}
          </motion.div>
        );
    }
  };

  return (
    <div className={`loading-states ${type} ${size} ${className}`}>
      <div className="loading-content">
        {/* Main Loading Indicator */}
        <div className="loading-main">
          {renderSpinnerVariants()}
          
          <div className="loading-text">
            <motion.h3
              className="loading-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {getLoadingMessage()}
            </motion.h3>
            
            {showProgress && (
              <motion.div
                className="loading-progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ProgressIndicator
                  type="linear"
                  progress={progress}
                  showPercentage={true}
                  size={size}
                  animated={animated}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Steps Indicator */}
        {renderSteps()}

        {/* Additional Info */}
        <motion.div
          className="loading-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="loading-tips">
            {type === 'generating' && (
              <div className="tip">
                <Clock size={14} />
                <span>تولید تصویر ممکن است چند دقیقه طول بکشد</span>
              </div>
            )}
            {type === 'processing' && (
              <div className="tip">
                <Sparkles size={14} />
                <span>در حال بهینه‌سازی کیفیت تصویر</span>
              </div>
            )}
            {type === 'image-upload' && (
              <div className="tip">
                <Image size={14} />
                <span>آپلود فایل‌های بزرگ ممکن است کمی زمان ببرد</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Background Animation */}
      {animated && (
        <div className="loading-background">
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              className="bg-particle"
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.5,
                ease: 'easeOut'
              }}
              style={{
                left: `${10 + index * 15}%`,
                animationDelay: `${index * 0.5}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadingStates;