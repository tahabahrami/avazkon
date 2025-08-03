import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Upload, Settings, Wand2, Download } from 'lucide-react';
import './WelcomeTour.css';

const tourSteps = [
  {
    id: 'welcome',
    title: 'مرحباً بك في أفازكون!',
    content: 'أداة ذكية لتحرير وتحسين الصور باستخدام الذكاء الاصطناعي. دعنا نأخذك في جولة سريعة.',
    icon: Wand2,
    target: null,
    position: 'center'
  },
  {
    id: 'upload',
    title: 'رفع الصور',
    content: 'ابدأ برفع صورة واحدة أو صورتين لدمجهما معاً. يمكنك السحب والإفلات أو النقر للاختيار.',
    icon: Upload,
    target: '.prompt-upload-section',
    position: 'bottom'
  },
  {
    id: 'prompt',
    title: 'الوصف الإبداعي',
    content: 'اكتب وصفاً لما تريد تحقيقه. كن مبدعاً ومفصلاً للحصول على أفضل النتائج.',
    icon: Settings,
    target: '.prompt-section',
    position: 'top'
  },
  {
    id: 'models',
    title: 'اختيار النموذج',
    content: 'اختر بين النموذج السريع للمعاينة أو النموذج المتقدم للجودة العالية.',
    icon: Settings,
    target: '.model-selection',
    position: 'top'
  },
  {
    id: 'generate',
    title: 'إنشاء الصورة',
    content: 'اضغط على زر الإنشاء وانتظر النتيجة المذهلة! ستظهر الصورة الجديدة أدناه.',
    icon: Download,
    target: '.process-button',
    position: 'top'
  }
];

const WelcomeTour = ({ isVisible, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
    }
  }, [isVisible]);

  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < tourSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
      setIsAnimating(false);
    }, 150);
  };

  const handlePrevious = () => {
    if (isAnimating || currentStep === 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(currentStep - 1);
      setIsAnimating(false);
    }, 150);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
    // Store completion in localStorage
    localStorage.setItem('welcomeTourCompleted', 'true');
  };

  const handleSkip = () => {
    onClose();
    localStorage.setItem('welcomeTourCompleted', 'true');
  };

  const currentStepData = tourSteps[currentStep];
  const IconComponent = currentStepData?.icon;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="welcome-tour-overlay">
        {/* Backdrop */}
        <motion.div
          className="welcome-tour-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleSkip}
        />

        {/* Tour Content */}
        <motion.div
          className={`welcome-tour-content ${currentStepData.position}`}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="tour-header">
            <div className="tour-icon">
              {IconComponent && <IconComponent size={24} />}
            </div>
            <button 
              className="tour-close-btn"
              onClick={handleSkip}
              aria-label="إغلاق الجولة"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="tour-body">
            <h3 className="tour-title">{currentStepData.title}</h3>
            <p className="tour-description">{currentStepData.content}</p>
          </div>

          {/* Progress */}
          <div className="tour-progress">
            <div className="progress-dots">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${
                    index === currentStep ? 'active' : ''
                  } ${
                    index < currentStep ? 'completed' : ''
                  }`}
                />
              ))}
            </div>
            <span className="progress-text">
              {currentStep + 1} من {tourSteps.length}
            </span>
          </div>

          {/* Navigation */}
          <div className="tour-navigation">
            <button
              className="tour-btn secondary"
              onClick={handleSkip}
            >
              تخطي
            </button>
            
            <div className="nav-buttons">
              {currentStep > 0 && (
                <button
                  className="tour-btn outline"
                  onClick={handlePrevious}
                  disabled={isAnimating}
                >
                  <ChevronLeft size={16} />
                  السابق
                </button>
              )}
              
              <button
                className="tour-btn primary"
                onClick={handleNext}
                disabled={isAnimating}
              >
                {currentStep === tourSteps.length - 1 ? 'إنهاء' : 'التالي'}
                {currentStep < tourSteps.length - 1 && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Spotlight for targeted elements */}
        {currentStepData.target && (
          <div className="tour-spotlight" data-target={currentStepData.target} />
        )}
      </div>
    </AnimatePresence>
  );
};

export default WelcomeTour;