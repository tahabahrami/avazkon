import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Upload, 
  Edit3, 
  Wand2, 
  Download,
  Settings,
  Eye,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import './WelcomeTour.css';

const WelcomeTour = ({ isVisible, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const overlayRef = useRef(null);
  const spotlightRef = useRef(null);

  const tourSteps = [
    {
      id: 'welcome',
      title: 'به آوازکن خوش آمدید!',
      content: 'آوازکن یک ابزار قدرتمند برای ویرایش و ترکیب تصاویر با استفاده از هوش مصنوعی است. بیایید با ویژگی‌های آن آشنا شوید.',
      target: null,
      position: 'center',
      icon: <Wand2 size={24} />,
      highlight: false
    },
    {
      id: 'upload',
      title: 'بارگذاری تصاویر',
      content: 'اینجا می‌توانید تصاویر خود را بارگذاری کنید. می‌توانید یک تصویر برای ویرایش یا دو تصویر برای ترکیب انتخاب کنید.',
      target: '.upload-section',
      position: 'bottom',
      icon: <Upload size={20} />,
      highlight: true
    },
    {
      id: 'prompt',
      title: 'دستور خلاقانه',
      content: 'در این قسمت دستور خود را بنویسید. توضیح دهید که چه تغییری در تصویر می‌خواهید یا چگونه تصاویر را ترکیب کنید.',
      target: '.prompt-section',
      position: 'top',
      icon: <Edit3 size={20} />,
      highlight: true
    },
    {
      id: 'models',
      title: 'انتخاب مدل',
      content: 'مدل هوش مصنوعی مناسب برای کار خود انتخاب کنید. هر مدل ویژگی‌ها و قابلیت‌های خاص خود را دارد.',
      target: '.model-selection',
      position: 'top',
      icon: <Settings size={20} />,
      highlight: true
    },
    {
      id: 'process',
      title: 'پردازش تصویر',
      content: 'پس از تکمیل تنظیمات، روی دکمه "ایجاد تصویر" کلیک کنید تا پردازش آغاز شود.',
      target: '.process-button',
      position: 'top',
      icon: <Wand2 size={20} />,
      highlight: true
    },
    {
      id: 'result',
      title: 'نتیجه و دانلود',
      content: 'پس از پردازش، تصویر نهایی نمایش داده می‌شود و می‌توانید آن را دانلود کنید.',
      target: '.result-section',
      position: 'top',
      icon: <Download size={20} />,
      highlight: true
    },
    {
      id: 'accessibility',
      title: 'تنظیمات دسترسی',
      content: 'از دکمه تنظیمات دسترسی برای بهبود تجربه کاربری خود استفاده کنید.',
      target: '.accessibility-toggle',
      position: 'left',
      icon: <Eye size={20} />,
      highlight: true
    },
    {
      id: 'complete',
      title: 'آماده شروع!',
      content: 'حالا می‌توانید از تمام ویژگی‌های آوازکن استفاده کنید. موفق باشید!',
      target: null,
      position: 'center',
      icon: <CheckCircle size={24} />,
      highlight: false
    }
  ];

  const currentStepData = tourSteps[currentStep];

  // Calculate spotlight position
  const calculateSpotlightPosition = () => {
    if (!currentStepData.target) return null;
    
    const element = document.querySelector(currentStepData.target);
    if (!element) return null;
    
    const rect = element.getBoundingClientRect();
    const padding = 10;
    
    return {
      x: rect.left - padding,
      y: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    };
  };

  // Calculate tooltip position
  const calculateTooltipPosition = () => {
    if (currentStepData.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }
    
    if (!currentStepData.target) return {};
    
    const element = document.querySelector(currentStepData.target);
    if (!element) return {};
    
    const rect = element.getBoundingClientRect();
    const tooltipOffset = 20;
    
    switch (currentStepData.position) {
      case 'top':
        return {
          bottom: `${window.innerHeight - rect.top + tooltipOffset}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          top: `${rect.bottom + tooltipOffset}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          right: `${window.innerWidth - rect.left + tooltipOffset}px`,
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + tooltipOffset}px`,
          transform: 'translateY(-50%)'
        };
      default:
        return {};
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsPlaying(false);
    onSkip();
  };

  // Auto-play functionality
  const startAutoPlay = () => {
    setIsPlaying(true);
  };

  const stopAutoPlay = () => {
    setIsPlaying(false);
  };

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setTimeout(() => {
      if (currentStep < tourSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false);
      }
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [currentStep, isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case 'Space':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevStep();
          break;
        case 'Escape':
          e.preventDefault();
          handleSkip();
          break;
        default:
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, currentStep]);

  // Scroll to target element
  useEffect(() => {
    if (currentStepData.target) {
      const element = document.querySelector(currentStepData.target);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }, [currentStep]);

  if (!isVisible) return null;

  const spotlightPosition = calculateSpotlightPosition();
  const tooltipPosition = calculateTooltipPosition();

  return (
    <AnimatePresence>
      <div className="welcome-tour" role="dialog" aria-labelledby="tour-title" aria-modal="true">
        {/* Overlay */}
        <motion.div
          ref={overlayRef}
          className="tour-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Spotlight */}
          {currentStepData.highlight && spotlightPosition && (
            <motion.div
              ref={spotlightRef}
              className="tour-spotlight"
              style={{
                left: spotlightPosition.x,
                top: spotlightPosition.y,
                width: spotlightPosition.width,
                height: spotlightPosition.height
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}
        </motion.div>

        {/* Tooltip */}
        <motion.div
          className={`tour-tooltip tour-tooltip--${currentStepData.position}`}
          style={tooltipPosition}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="tour-header">
            <div className="tour-icon">
              {currentStepData.icon}
            </div>
            <h3 id="tour-title" className="tour-title">
              {currentStepData.title}
            </h3>
            <button
              className="tour-close"
              onClick={handleSkip}
              aria-label="بستن راهنما"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="tour-content">
            <p>{currentStepData.content}</p>
          </div>

          {/* Progress */}
          <div className="tour-progress">
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="progress-text">
              {currentStep + 1} از {tourSteps.length}
            </span>
          </div>

          {/* Step Indicators */}
          <div className="tour-indicators">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => goToStep(index)}
                aria-label={`رفتن به مرحله ${index + 1}`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="tour-controls">
            <div className="control-group">
              <button
                className="tour-button tour-button--secondary"
                onClick={handleSkip}
              >
                رد کردن
              </button>
              
              {currentStep > 0 && (
                <button
                  className="tour-button tour-button--secondary"
                  onClick={prevStep}
                >
                  <ChevronLeft size={16} />
                  قبلی
                </button>
              )}
            </div>

            <div className="control-group">
              <button
                className={`tour-button tour-button--icon ${isPlaying ? 'active' : ''}`}
                onClick={isPlaying ? stopAutoPlay : startAutoPlay}
                aria-label={isPlaying ? 'توقف پخش خودکار' : 'شروع پخش خودکار'}
                title={isPlaying ? 'توقف پخش خودکار' : 'شروع پخش خودکار'}
              >
                <Lightbulb size={16} />
              </button>
              
              <button
                className="tour-button tour-button--primary"
                onClick={nextStep}
              >
                {currentStep === tourSteps.length - 1 ? 'تمام' : 'بعدی'}
                {currentStep < tourSteps.length - 1 && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WelcomeTour;