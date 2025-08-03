import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import './ProgressIndicator.css';

const ProgressIndicator = ({
  type = 'linear', // 'linear', 'circular', 'dots', 'pulse'
  progress = 0, // 0-100
  status = 'loading', // 'loading', 'success', 'error', 'warning'
  size = 'medium', // 'small', 'medium', 'large'
  showPercentage = false,
  showIcon = true,
  label = '',
  className = '',
  animated = true,
  color = 'primary', // 'primary', 'success', 'warning', 'error'
  thickness = 'medium' // 'thin', 'medium', 'thick'
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="status-icon success" />;
      case 'error':
        return <XCircle className="status-icon error" />;
      case 'warning':
        return <AlertCircle className="status-icon warning" />;
      case 'loading':
      default:
        return <Loader2 className="status-icon loading" />;
    }
  };

  const getProgressValue = () => {
    return Math.min(Math.max(progress, 0), 100);
  };

  const renderLinearProgress = () => {
    const progressValue = getProgressValue();
    
    return (
      <div className={`progress-linear ${size} ${color} ${thickness} ${className}`}>
        {label && <div className="progress-label">{label}</div>}
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={animated ? { duration: 0.5, ease: 'easeOut' } : { duration: 0 }}
          />
          {animated && (
            <motion.div
              className="progress-shimmer"
              animate={{
                x: ['0%', '100%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
        </div>
        <div className="progress-info">
          {showIcon && getStatusIcon()}
          {showPercentage && (
            <span className="progress-percentage">{Math.round(progressValue)}%</span>
          )}
        </div>
      </div>
    );
  };

  const renderCircularProgress = () => {
    const progressValue = getProgressValue();
    const radius = size === 'small' ? 16 : size === 'large' ? 32 : 24;
    const strokeWidth = thickness === 'thin' ? 2 : thickness === 'thick' ? 4 : 3;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (progressValue / 100) * circumference;

    return (
      <div className={`progress-circular ${size} ${color} ${className}`}>
        {label && <div className="progress-label">{label}</div>}
        <div className="progress-circle-container">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="progress-circle"
          >
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="progress-circle-fill"
            />
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="progress-circle-track"
            />
          </svg>
          <div className="progress-circle-content">
            {showIcon && getStatusIcon()}
            {showPercentage && (
              <span className="progress-percentage">{Math.round(progressValue)}%</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDotsProgress = () => {
    const dotCount = size === 'small' ? 3 : size === 'large' ? 5 : 4;
    
    return (
      <div className={`progress-dots ${size} ${color} ${className}`}>
        {label && <div className="progress-label">{label}</div>}
        <div className="dots-container">
          {Array.from({ length: dotCount }).map((_, index) => (
            <motion.div
              key={index}
              className="progress-dot"
              animate={animated ? {
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3]
              } : {}}
              transition={animated ? {
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut'
              } : {}}
            />
          ))}
        </div>
        <div className="progress-info">
          {showIcon && getStatusIcon()}
          {showPercentage && (
            <span className="progress-percentage">{Math.round(getProgressValue())}%</span>
          )}
        </div>
      </div>
    );
  };

  const renderPulseProgress = () => {
    return (
      <div className={`progress-pulse ${size} ${color} ${className}`}>
        {label && <div className="progress-label">{label}</div>}
        <div className="pulse-container">
          <motion.div
            className="pulse-circle"
            animate={animated ? {
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.3, 0.7]
            } : {}}
            transition={animated ? {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            } : {}}
          >
            {showIcon && getStatusIcon()}
          </motion.div>
          {animated && (
            <motion.div
              className="pulse-ring"
              animate={{
                scale: [1, 2],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut'
              }}
            />
          )}
        </div>
        <div className="progress-info">
          {showPercentage && (
            <span className="progress-percentage">{Math.round(getProgressValue())}%</span>
          )}
        </div>
      </div>
    );
  };

  const renderProgress = () => {
    switch (type) {
      case 'circular':
        return renderCircularProgress();
      case 'dots':
        return renderDotsProgress();
      case 'pulse':
        return renderPulseProgress();
      case 'linear':
      default:
        return renderLinearProgress();
    }
  };

  return (
    <div className={`progress-indicator ${status} ${animated ? 'animated' : ''}`}>
      {renderProgress()}
    </div>
  );
};

export default ProgressIndicator;